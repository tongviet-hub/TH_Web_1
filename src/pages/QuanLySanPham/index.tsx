import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Table, message, Button, Modal, Form, Input, InputNumber, Select, Tag, Space, Card, Slider, Row, Col, Statistic } from 'antd';
import { useState, useMemo } from 'react';
import { useModel } from 'umi';

const CATEGORIES = ['Laptop', 'Điện thoại', 'Máy tính bảng', 'Phụ kiện'];

import { ReloadOutlined } from '@ant-design/icons';

const BaiTap01 = () => {
  const [form] = Form.useForm();
  const { danhSachSanPham, setDanhSachSanPham } = useModel('sanpham');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleResetData = () => {
    localStorage.removeItem('danhSachSanPham');
    window.location.reload();
  };

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  const filteredData = useMemo(() => {
    return danhSachSanPham.filter((item: any) => {
      const matchName = (item.name || '').toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = filterCategory ? item.category === filterCategory : true;
      const matchPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      let status = 'Còn hàng';
      if (item.quantity === 0) status = 'Hết hàng';
      else if (item.quantity <= 10) status = 'Sắp hết';

      const matchStatus = filterStatus ? status === filterStatus : true;

      return matchName && matchCategory && matchPrice && matchStatus;
    });
  }, [danhSachSanPham, searchText, filterCategory, filterStatus, priceRange]);

  const stats = useMemo(() => {
    const totalProducts = danhSachSanPham.length;
    const totalStockValue = danhSachSanPham.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    return { totalProducts, totalStockValue };
  }, [danhSachSanPham]);

  const handleEdit = (record: any) => {
    setIsEditing(true);
    setEditingId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    const newData = danhSachSanPham.filter((item: any) => item.id !== id);
    setDanhSachSanPham(newData);
    message.success('Xóa sản phẩm thành công!');
  };

  const handleSave = (values: any) => {
    if (isEditing && editingId !== null) {
      const newData = danhSachSanPham.map((item: any) =>
        item.id === editingId ? { ...item, ...values } : item
      );
      setDanhSachSanPham(newData);
      message.success('Cập nhật sản phẩm thành công');
    } else {
      const newId = danhSachSanPham.length > 0 ? Math.max(...danhSachSanPham.map((i: any) => i.id)) + 1 : 1;
      setDanhSachSanPham([...danhSachSanPham, { ...values, id: newId }]);
      message.success('Thêm sản phẩm thành công');
    }
    setOpen(false);
    form.resetFields();
  };

  const getStatusTag = (quantity: number) => {
    if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
    if (quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: CATEGORIES.map(c => ({ text: c, value: c })),
      onFilter: (value: any, record: any) => record.category === value,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => getStatusTag(record.quantity),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Tổng số sản phẩm" value={stats.totalProducts} />
          </Col>
          <Col span={12}>
            <Statistic title="Tổng giá trị tồn kho" value={stats.totalStockValue} suffix="₫" groupSeparator="." />
          </Col>
        </Row>
      </Card>

      <Card title="Quản lý Sản phẩm" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleResetData}>
            Khôi phục dữ liệu mẫu
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            Thêm sản phẩm
          </Button>
        </Space>
      }>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Input.Search
                placeholder="Tìm tên sản phẩm"
                onSearch={val => setSearchText(val)}
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Danh mục"
                allowClear
                onChange={val => setFilterCategory(val)}
                options={CATEGORIES.map(c => ({ label: c, value: c }))}
              />
            </Col>
            <Col span={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Trạng thái"
                allowClear
                onChange={val => setFilterStatus(val)}
                options={[
                  { label: 'Còn hàng', value: 'Còn hàng' },
                  { label: 'Sắp hết', value: 'Sắp hết' },
                  { label: 'Hết hàng', value: 'Hết hàng' },
                ]}
              />
            </Col>
            <Col span={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>Giá:</span>
                <Slider
                  range
                  min={0}
                  max={100000000}
                  step={1000000}
                  value={priceRange}
                  onChange={(val: [number, number]) => setPriceRange(val)}
                  style={{ flex: 1 }}
                />
              </div>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        bodyStyle={{ borderRadius: 8, padding: 20 }}
        style={{ borderRadius: 8, overflow: 'hidden' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select options={CATEGORIES.map(c => ({ label: c, value: c }))} style={{ borderRadius: 6 }} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber style={{ width: '100%', borderRadius: 6 }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber style={{ width: '100%', borderRadius: 6 }} min={0} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8, borderRadius: 6 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ borderRadius: 6 }}>
              {isEditing ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BaiTap01;