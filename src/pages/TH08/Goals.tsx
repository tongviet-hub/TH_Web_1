import React, { useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Drawer, Form, Input, InputNumber, Popconfirm, Progress, Row, Segmented } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

type GoalStatus = 'Active' | 'Achieved' | 'Cancelled';

type GoalRow = {
  id: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  status: GoalStatus;
};

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const statusOptions: Array<{ label: string; value: GoalStatus | 'All' }> = [
  { label: 'Tất cả', value: 'All' },
  { label: 'Đang thực hiện', value: 'Active' },
  { label: 'Đã đạt', value: 'Achieved' },
  { label: 'Đã hủy', value: 'Cancelled' },
];

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useModel('th08');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'All'>('All');

  const visibleGoals = useMemo(() => {
    if (statusFilter === 'All') return goals;
    return goals.filter((goal: GoalRow) => goal.status === statusFilter);
  }, [goals, statusFilter]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <Segmented options={statusOptions} value={statusFilter} onChange={(value) => setStatusFilter(value as GoalStatus | 'All')} />
        <Button type="primary" style={{ float: 'right' }} onClick={openDrawer}>
          Thêm mục tiêu
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {visibleGoals.map((goal: GoalRow) => {
          const progressPercent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

          return (
            <Col xs={24} sm={12} md={8} key={goal.id}>
              <Card
                title={goal.name}
                actions={[
                  <Popconfirm key="delete-goal" title="Xóa mục tiêu?" onConfirm={() => deleteGoal(goal.id)}>
                    <a>Xóa</a>
                  </Popconfirm>,
                ]}
              >
                <div>Loại: {goal.type}</div>
                <div>Giá trị mục tiêu: {goal.targetValue}</div>
                <div>
                  Giá trị hiện tại:{' '}
                  <InputNumber value={goal.currentValue} min={0} onChange={(value) => updateGoal({ ...goal, currentValue: value || 0 })} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <Progress percent={progressPercent} />
                </div>
                <div>Deadline: {goal.deadline ? moment(goal.deadline).format('YYYY-MM-DD') : '-'}</div>
                <div>Trạng thái: {goal.status}</div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer title="Thêm mục tiêu" visible={isDrawerOpen} onClose={closeDrawer} width={480} destroyOnClose>
        <Form onFinish={(values) => {
          const payload = {
            ...values,
            id: createId(),
            currentValue: values.currentValue || 0,
            status: 'Active' as GoalStatus,
            deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : undefined,
          };
          addGoal(payload);
          closeDrawer();
        }}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="Loại"><Input /></Form.Item>
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}><InputNumber min={0} /></Form.Item>
          <Form.Item name="currentValue" label="Giá trị hiện tại"><InputNumber min={0} /></Form.Item>
          <Form.Item name="deadline" label="Deadline"><DatePicker /></Form.Item>
          <Form.Item><Button htmlType="submit" type="primary">Lưu</Button></Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Goals;
