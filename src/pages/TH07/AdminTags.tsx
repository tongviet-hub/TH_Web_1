import React, { useState } from 'react';
import { Table, Button, Space, Input, Modal, Form, Popconfirm, message, Card, Typography, Tag as AntdTag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Title } = Typography;

const AdminTags: React.FC = () => {
  const { tags, addTag, editTag, delTag } = useModel('blogModel');
  const [vis, setVis] = useState(false);
  const [old, setOld] = useState<string | null>(null);
  const [form] = Form.useForm();

  const onOpen = (name?: string) => {
    if (name) {
      setOld(name);
      form.setFieldsValue({ name });
    } else {
      setOld(null);
      form.resetFields();
    }
    setVis(true);
  };

  const onSave = (val: { name: string }) => {
    if (old) {
      editTag(old, val.name);
      message.success('Đã sửa');
    } else {
      addTag(val.name);
      message.success('Đã thêm');
    }
    setVis(false);
  };

  const cols = [
    { title: 'Thẻ', dataIndex: 'name', key: 'name', render: (n: string) => <AntdTag color="blue">{n}</AntdTag> },
    { title: 'Số bài', dataIndex: 'count', key: 'count', sorter: (a: any, b: any) => a.count - b.count },
    {
      title: 'Thao tác',
      render: (_: any, r: any) => (
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => onOpen(r.name)} />
          <Popconfirm title="Xóa?" onConfirm={() => { delTag(r.name); message.success('Đã xóa'); }}>
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Space><TagsOutlined /><Title level={3} style={{ margin: 0 }}>Thẻ (Tag)</Title></Space>} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => onOpen()}>Thêm mới</Button>}>
        <Table columns={cols} dataSource={tags} rowKey="name" />
      </Card>

      <Modal title={old ? 'Sửa' : 'Thêm'} visible={vis} onCancel={() => setVis(false)} footer={null} destroyOnClose forceRender>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item name="name" label="Tên thẻ" rules={[
            { required: true },
            { validator: (_, v) => !old && tags.some(t => t.name === v) ? Promise.reject('Đã tồn tại') : Promise.resolve() }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space><Button onClick={() => setVis(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu</Button></Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTags;
