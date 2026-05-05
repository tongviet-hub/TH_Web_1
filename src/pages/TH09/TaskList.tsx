import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Card,
  Typography,
} from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import TaskFormModal from './components/TaskFormModal';
import { PRIORITY_COLOR, PRIORITY_LABEL, STATUS_LABEL } from './constants';
import type { TaskFormPayload, TaskItem, TaskStatus, TaskPriority } from './types';
import './style.less';
const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useModel('th09');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [visible, setVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | undefined>();

  const list = useMemo(() => {
    return tasks.filter((task) => {
      const ok1 = statusFilter === 'ALL' || task.status === statusFilter;
      const ok2 = task.title.toLowerCase().includes(keyword.trim().toLowerCase());
      return ok1 && ok2;
    });
  }, [tasks, statusFilter, keyword]);

  const columns: TableColumnsType<TaskItem> = [
    {
      title: 'Tên task',
      dataIndex: 'title',
      key: 'title',
      render: (value, record) => (
        <div>
          <Typography.Text strong>{value}</Typography.Text>
          <div>
            {(record.tags || []).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: TaskStatus) => <Tag color='geekblue'>{STATUS_LABEL[value]}</Tag>,
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (value: TaskPriority) => (
    <Tag color={PRIORITY_COLOR[value]}>{PRIORITY_LABEL[value]}</Tag>
  ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTask(record);
              setVisible(true);
            }}
          />
          <Popconfirm title='Bạn có chắc muốn xóa task này?' onConfirm={() => deleteTask(record.id)}>
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSubmit = (values: TaskFormPayload) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setVisible(false);
    setEditingTask(undefined);
  };

  return (
    <div className='th09-page th09-table-page'>
      <img src='/th09-hero.svg' alt='Kanban Hero' className='th09-hero' />

      <Row justify='space-between' align='middle' className='th09-title-row'>
        <Col>
          <div className='th09-title-wrap'>
            <UnorderedListOutlined className='th09-title-icon' />
            <Typography.Title level={3} className='th09-title'>
              Danh sách task
            </Typography.Title>
          </div>
          <Typography.Text className='th09-subtitle'>
            Lọc, tìm kiếm và sắp xếp deadline để quản lý công việc hiệu quả hơn.
          </Typography.Text>
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(undefined);
              setVisible(true);
            }}
          >
            Thêm task
          </Button>
        </Col>
      </Row>

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} md={12}>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Tìm theo tên task...'
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select style={{ width: '100%' }} value={statusFilter} onChange={setStatusFilter}>
            <Select.Option value='ALL'>Tất cả trạng thái</Select.Option>
            <Select.Option value='TODO'>{STATUS_LABEL.TODO}</Select.Option>
            <Select.Option value='IN_PROGRESS'>{STATUS_LABEL.IN_PROGRESS}</Select.Option>
            <Select.Option value='DONE'>{STATUS_LABEL.DONE}</Select.Option>
          </Select>
        </Col>
      </Row>

      <Card className='th09-table-card'>
        <Table<TaskItem> rowKey='id' columns={columns} dataSource={list} />
      </Card>

      <TaskFormModal
        visible={visible}
        editingTask={editingTask}
        onCancel={() => {
          setVisible(false);
          setEditingTask(undefined);
        }}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default TaskList;
