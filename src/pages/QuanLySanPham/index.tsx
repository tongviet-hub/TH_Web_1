import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Input, Modal, Form, InputNumber, Popconfirm, message, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const initialData: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const QuanLySanPham: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Filter products based on search text
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const newProducts = products.filter((item) => item.id !== id);
    setProducts(newProducts);
    message.success('Xóa sản phẩm thành công!');
  };

  const handleAdd = (values: any) => {
    const newProduct: Product = {
      id: Date.now(), // Simple ID generation
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    };
    setProducts([...products, newProduct]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Thêm sản phẩm thành công!');
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý sản phẩm">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />

        <Modal
          title="Thêm sản phẩm mới"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleAdd}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá"
              rules={[
                { required: true, message: 'Vui lòng nhập giá!' },
                { type: 'number', min: 1, message: 'Giá phải là số dương!' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập giá"
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' },
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default QuanLySanPham;
