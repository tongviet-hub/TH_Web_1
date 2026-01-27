import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Input, Modal, Form, InputNumber, Popconfirm, message, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const QuanLySanPham = () => {
  const { danhSachSanPham, setDanhSachSanPham } = useModel('sanpham');
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [sanPhamDangSua, setSanPhamDangSua] = useState({
    name: '',
    price: 0,
    quantity: 0,
    id: 999999,
  });


  // Filter data based on search text
  const filteredData = danhSachSanPham.filter((item: any) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddProduct = (values: any) => {
    const newId = danhSachSanPham.length > 0 ? Math.max(...danhSachSanPham.map((item: any) => item.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      ...values,
    };
    setDanhSachSanPham([...danhSachSanPham, newProduct]);
    message.success('Thêm sản phẩm thành công');
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteProduct = (id: number) => {
    const newData = danhSachSanPham.filter((item: any) => item.id !== id);
    setDanhSachSanPham(newData);
    message.success('Xóa sản phẩm thành công');
  };

  const handleEditProduct = (record: any) => {
    setSanPhamDangSua(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };


  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
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
      render: (text: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>
              Sửa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý sản phẩm">
      <Card>
        <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Thêm sản phẩm
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Thêm sản phẩm mới"
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddProduct}

          >
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
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập giá sản phẩm"
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' }, // "dương" usually implies > 0.
              ]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" precision={0} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default QuanLySanPham;
