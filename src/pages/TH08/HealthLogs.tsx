import React, { useState } from 'react';
import { Button, DatePicker, Empty, Form, InputNumber, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const getBmiTagMeta = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' as const };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' as const };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' as const };
  return { label: 'Béo phì', color: 'red' as const };
};

type HealthLogRow = {
  id: string;
  date: string;
  weight: number;
  height: number;
  restingHr?: number;
  sleepTime?: string;
};

type HealthLogFormValues = {
  date: moment.Moment;
  weight: number;
  height: number;
  restingHr?: number;
  sleepTime?: string;
};

const HealthLogs: React.FC = () => {
  const { healthLogs, addHealth, updateHealth, deleteHealth } = useModel('th08');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<HealthLogRow | null>(null);

  const openEditor = (log?: HealthLogRow) => {
    setSelectedLog(log ?? null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedLog(null);
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', render: (d: string) => moment(d).format('YYYY-MM-DD') },
    { title: 'Cân nặng (kg)', dataIndex: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height' },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      render: (_: unknown, record: HealthLogRow) => {
        const heightInMeters = record.height / 100;
        const bmi = +(record.weight / (heightInMeters * heightInMeters)).toFixed(1);
        const bmiMeta = getBmiTagMeta(bmi);

        return <Tag color={bmiMeta.color}>{bmi} - {bmiMeta.label}</Tag>;
      },
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'restingHr' },
    { title: 'Giờ ngủ', dataIndex: 'sleepTime' },
    {
      title: 'Hành động',
      render: (_: unknown, row: HealthLogRow) => (
        <Space>
          <Button onClick={() => openEditor(row)}>Sửa</Button>
          <Popconfirm title="Xóa chỉ số?" onConfirm={() => deleteHealth(row.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const initialFormValues: Partial<HealthLogFormValues> = selectedLog
    ? { ...selectedLog, date: moment(selectedLog.date) }
    : { date: moment() };

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => openEditor()} style={{ marginBottom: 12 }}>
        Thêm chỉ số
      </Button>

      {healthLogs.length ? (
        <Table rowKey="id" dataSource={healthLogs} columns={columns} />
      ) : (
        <Empty description="Chưa có chỉ số" />
      )}

      <Modal title={selectedLog ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'} visible={isEditorOpen} onCancel={closeEditor} footer={null} destroyOnClose>
        <Form initialValues={initialFormValues} onFinish={(values: HealthLogFormValues) => {
          const payload = { ...values, id: selectedLog?.id || createId(), date: values.date.format('YYYY-MM-DD') };
          if (selectedLog) {
            updateHealth(payload);
          } else {
            addHealth(payload);
          }
          closeEditor();
        }}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker /></Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}><InputNumber min={1} /></Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}><InputNumber min={1} /></Form.Item>
          <Form.Item name="restingHr" label="Nhịp tim lúc nghỉ (bpm)"><InputNumber min={0} /></Form.Item>
          <Form.Item name="sleepTime" label="Giờ ngủ"><InputNumber min={0} max={24} /></Form.Item>
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

export default HealthLogs;
