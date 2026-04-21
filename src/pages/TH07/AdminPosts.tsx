import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Input, Select, Modal, Form, Popconfirm, message, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { Article, ArticleStatus } from '@/models/blogModel';

const { Title } = Typography;
const { Option } = Select;

const AdminPosts: React.FC = () => {
  const { posts, addPost, editPost, delPost, tags } = useModel('blogModel');
  const [kw, setKw] = useState('');
  const [st, setSt] = useState<ArticleStatus | 'All'>('All');
  const [vis, setVis] = useState(false);
  const [item, setItem] = useState<Article | null>(null);
  const [form] = Form.useForm();

  const data = useMemo(() => {
    return posts.filter((p) => {
      const matchKW = p.title.toLowerCase().includes(kw.toLowerCase());
      const matchST = st === 'All' ? true : p.status === st;
      return matchKW && matchST;
    });
  }, [posts, kw, st]);

  const onOpen = (p?: Article) => {
    if (p) {
      setItem(p);
      form.setFieldsValue({ ...p });
    } else {
      setItem(null);
      form.resetFields();
    }
    setVis(true);
  };

  const onSave = (val: any) => {
    if (item) {
      editPost(item.id, val);
      message.success('Đã cập nhật');
    } else {
      addPost({ ...val, author: 'Nguyễn Văn A', summary: val.content.substring(0, 100) + '...' });
      message.success('Đã thêm');
    }
    setVis(false);
  };

  const cols = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', sorter: (a: any, b: any) => a.title.localeCompare(b.title) },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      render: (s: string) => <Tag color={s === 'Published' ? 'green' : 'gold'}>{s === 'Published' ? 'Đã đăng' : 'Nháp'}</Tag>
    },
    { title: 'Thẻ', dataIndex: 'tags', render: (ts: string[]) => ts.map(t => <Tag key={t} color="blue">{t}</Tag>) },
    { title: 'Xem', dataIndex: 'viewCount' },
    { title: 'Ngày', dataIndex: 'date' },
    {
      title: 'Thao tác',
      render: (_: any, r: Article) => (
        <Space>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => onOpen(r)} />
          <Popconfirm title="Xóa?" onConfirm={() => { delPost(r.id); message.success('Đã xóa'); }}>
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<Title level={3}>Bài viết</Title>} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => onOpen()}>Thêm mới</Button>}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="Tìm..." prefix={<SearchOutlined />} onChange={(e) => setKw(e.target.value)} style={{ width: 200 }} />
          <Select defaultValue="All" style={{ width: 150 }} onChange={(v) => setSt(v as any)}>
            <Option value="All">Tất cả</Option>
            <Option value="Published">Đã đăng</Option>
            <Option value="Draft">Nháp</Option>
          </Select>
        </Space>
        <Table columns={cols} dataSource={data} rowKey="id" />
      </Card>

      <Modal title={item ? 'Sửa' : 'Thêm'} visible={vis} onCancel={() => setVis(false)} footer={null} width={800} destroyOnClose forceRender>
        <Form form={form} layout="vertical" onFinish={onSave} initialValues={{ status: 'Published', tags: [] }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="thumbnail" label="URL Ảnh" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="tags" label="Thẻ">
            <Select mode="multiple">
              {tags.map(t => <Option key={t.name} value={t.name}>{t.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select><Option value="Published">Đã đăng</Option><Option value="Draft">Nháp</Option></Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}><Input.TextArea rows={8} /></Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space><Button onClick={() => setVis(false)}>Hủy</Button><Button type="primary" htmlType="submit">Lưu</Button></Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPosts;
