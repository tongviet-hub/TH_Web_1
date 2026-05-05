import { DashboardOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Statistic, Tag, Typography } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';
import { PRIORITY_COLOR, PRIORITY_LABEL, STATUS_LABEL } from './constants';
import type { TaskItem } from './types';
import './style.less';

const Dashboard: React.FC = () => {
  const { tasks, stats } = useModel('th09') as {
    tasks: TaskItem[];
    stats: {
      total: number;
      completed: number;
      overdue: number;
    };
  };

  const recent = [...tasks]
    .sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf())
    .slice(0, 5);

  return (
    <div className='th09-page th09-dashboard'>
      <img src='/th09-hero.svg' alt='Kanban Hero' className='th09-hero' />

      <div className='th09-title-row'>
        <div className='th09-title-wrap'>
          <DashboardOutlined className='th09-title-icon' />
          <Typography.Title level={3} className='th09-title'>
            Dashboard quản lý công việc
          </Typography.Title>
        </div>
        <Typography.Text className='th09-subtitle'>
          Theo dõi nhanh tiến độ, tỷ lệ hoàn thành và tình trạng quá hạn của task.
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className='th09-stat-card'>
            <Statistic title='Tổng số task' value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className='th09-stat-card'>
            <Statistic title='Task hoàn thành' value={stats.completed} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className='th09-stat-card'>
            <Statistic title='Task quá hạn' value={stats.overdue} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Card
        className='th09-latest-card'
        title='Task cập nhật gần đây'
        extra={<a onClick={() => history.push('/TH09/tasks')}>Xem danh sách đầy đủ</a>}
      >
        {recent.length === 0 ? (
          <Empty description='Chưa có task nào' />
        ) : (
          recent.map((task) => (
            <Card.Grid key={task.id} className='th09-task-grid'>
              <Row justify='space-between' align='middle' gutter={[8, 8]}>
                <Col xs={24} md={14}>
                  <Typography.Text strong>{task.title}</Typography.Text>
                  <div>
                    <Tag color='geekblue'>{STATUS_LABEL[task.status]}</Tag>
                    <Tag color={PRIORITY_COLOR[task.priority]}>{PRIORITY_LABEL[task.priority]}</Tag>
                  </div>
                </Col>
                <Col xs={24} md={10} style={{ textAlign: 'right' }}>
                  <Typography.Text type='secondary'>
                    Deadline: {moment(task.deadline).format('DD/MM/YYYY')}
                  </Typography.Text>
                </Col>
              </Row>
            </Card.Grid>
          ))
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
