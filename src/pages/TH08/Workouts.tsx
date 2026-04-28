import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { WORKOUT_STATUS_OPTIONS, WORKOUT_TYPE_OPTIONS } from './constants';

type WorkoutStatus = 'Completed' | 'Missed';

type WorkoutFormValues = {
  date: moment.Moment;
  name: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
  status: WorkoutStatus;
};

type WorkoutRow = {
  id: string;
  date: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
  status: WorkoutStatus;
};

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const { RangePicker } = DatePicker;

const renderStatusTag = (status: WorkoutStatus) =>
  status === 'Completed' ? <Tag color="green">Hoàn thành</Tag> : <Tag color="red">Bỏ lỡ</Tag>;

const Workouts: React.FC = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useModel('th08');
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRow | null>(null);

  const openEditor = (workout?: WorkoutRow) => {
    setSelectedWorkout(workout ?? null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedWorkout(null);
  };

  const filtered = useMemo<WorkoutRow[]>(() => {
    return workouts.filter((workout) => {
      const matchesSearch = workout.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = selectedType ? workout.type === selectedType : true;
      const matchesRange = dateRange ? moment(workout.date).isBetween(dateRange[0], dateRange[1], 'day', '[]') : true;

      return matchesSearch && matchesType && matchesRange;
    });
  }, [dateRange, searchText, selectedType, workouts]);

  const columns = [
    { title: 'Ngày', dataIndex: 'date', render: (d: string) => moment(d).format('YYYY-MM-DD') },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Thời lượng (phút)', dataIndex: 'duration' },
    { title: 'Calo', dataIndex: 'calories' },
    { title: 'Ghi chú', dataIndex: 'note' },
    { title: 'Trạng thái', dataIndex: 'status', render: (status: WorkoutStatus) => renderStatusTag(status) },
    {
      title: 'Hành động',
      render: (_: unknown, record: WorkoutRow) => (
        <Space>
          <Button onClick={() => openEditor(record)}>Sửa</Button>
          <Popconfirm title="Xóa buổi tập?" onConfirm={() => deleteWorkout(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const initialFormValues: Partial<WorkoutFormValues> = selectedWorkout
    ? { ...selectedWorkout, date: moment(selectedWorkout.date) }
    : { date: moment(), type: 'Cardio', status: 'Completed' };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tìm theo tên" allowClear onSearch={(value) => setSearchText(value)} />
        <Select placeholder="Lọc loại" style={{ width: 160 }} allowClear value={selectedType} onChange={(value) => setSelectedType(value)}>
          {WORKOUT_TYPE_OPTIONS.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <RangePicker onChange={(value) => setDateRange(value && value[0] && value[1] ? [value[0], value[1]] : null)} />
        <Button type="primary" onClick={() => openEditor()}>Thêm buổi tập</Button>
      </Space>

      <Table rowKey="id" dataSource={filtered} columns={columns} />

      <Modal title={selectedWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập'} visible={isEditorOpen} onCancel={closeEditor} footer={null} destroyOnClose>
        <Form initialValues={initialFormValues} onFinish={(values: WorkoutFormValues) => {
          const payload = { ...values, date: values.date.format('YYYY-MM-DD'), id: selectedWorkout?.id || createId() };
          if (selectedWorkout) {
            updateWorkout(payload);
          } else {
            addWorkout(payload);
          }
          closeEditor();
        }}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker /></Form.Item>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="Loại"><Select>
            {WORKOUT_TYPE_OPTIONS.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select></Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)"><InputNumber min={1} /></Form.Item>
          <Form.Item name="calories" label="Calo"><InputNumber min={0} /></Form.Item>
          <Form.Item name="note" label="Ghi chú"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="status" label="Trạng thái"><Select>
            {WORKOUT_STATUS_OPTIONS.map((status) => (
              <Select.Option key={status} value={status}>
                {status === 'Completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
              </Select.Option>
            ))}
          </Select></Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">Lưu</Button>
              <Button onClick={closeEditor}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Workouts;
