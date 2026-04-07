import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Typography, Table, Button, Space, Popconfirm, Modal, Form, Input, InputNumber, Select, Row, Col, Statistic, message, Rate } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DollarOutlined, FireOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;
const { Option } = Select;

const Admin: React.FC = () => {
  const { destinations, setDestinations, resetData, itineraries } = useModel('travelPlanner');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const aliveRef = React.useRef(true);
  const [form] = Form.useForm();

  React.useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const openAddModal = () => {
    setEditingRow(null);
    form.resetFields();
    if (aliveRef.current) setModalOpen(true);
  };

  const openEditModal = (row: any) => {
    setEditingRow(row);
    form.setFieldsValue(row);
    setModalOpen(true);
  };

  const removeDestination = (id: number) => {
    setDestinations((oldList: any) => oldList.filter((x: any) => x.id !== id));
  };

  const submitModal = () => {
    form.validateFields()
      .then(formValues => {
        if (editingRow) {
          setDestinations((oldList: any) => oldList.map((x: any) => x.id === editingRow.id ? { ...x, ...formValues } : x));
          message.success(`Cập nhật ${formValues.name} thành công!`);
        } else {
          const insertRow = {
            ...formValues,
            id: Date.now(), 
            bookingsCount: 0,
            rating: formValues.rating || 5,
            image: formValues.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
          };
          setDestinations((oldList: any) => [...oldList, insertRow]);
          message.success(`Thêm mới ${formValues.name} thành công!`);
        }
        if (aliveRef.current) {
          setModalOpen(false);
          form.resetFields();
        }
      })
      .catch(err => {
        console.log('Validate Failed:', err);
        if (aliveRef.current) message.error('Vui lòng kiểm tra lại các trường thông tin!');
      });
  };

  const tableCols = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => <img src={text} alt="img" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4 }} />
    },
    {
      title: 'Tên Điểm đến',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tổng chi phí',
      key: 'totalPrice',
      render: (_: any, record: any) => {
        const total = (record.costEating || 0) + (record.costMoving || 0) + (record.costLodging || 0);
        return <Text strong>{total.toLocaleString('vi-VN')} đ</Text>;
      }
    },
    {
      title: 'Lượt chọn',
      dataIndex: 'bookingsCount',
      key: 'bookingsCount',
      sorter: (a: any, b: any) => a.bookingsCount - b.bookingsCount,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Xoá địa điểm này?" onConfirm={() => removeDestination(record.id)}>
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dashboardStat = useMemo(() => {
    const pickedMap: Record<number, number> = {};
    itineraries.forEach(day => {
      day.activities?.forEach((act: any) => {
        if (act.destId) {
          pickedMap[act.destId] = (pickedMap[act.destId] || 0) + 1;
        }
      });
    });

    const lines = destinations.map(d => {
      const liveCount = pickedMap[d.id] || 0;
      const totalPrice = (d.costEating || 0) + (d.costMoving || 0) + (d.costLodging || 0);
      return {
        ...d,
        liveCount,
        liveRev: liveCount * totalPrice
      };
    });

    const totalRev = lines.reduce((sum, d) => sum + d.liveRev, 0);

    const popularityData = [...lines]
      .sort((a, b) => b.liveCount - a.liveCount)
      .slice(0, 5);

    return { totalRev, popularityData };
  }, [destinations, itineraries]);

  const monthAct = useMemo(() => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const list: { month: string, value: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const tmp = new Date();
      tmp.setMonth(tmp.getMonth() - i);
      list.push({ month: months[tmp.getMonth()], value: 0 });
    }

    itineraries.forEach((day: any) => {
      if (day.actualDate) {
        const tmp = new Date(day.actualDate);
        const mLabel = months[tmp.getMonth()];
        const target = list.find(item => item.month === mLabel);
        if (target) {
          target.value += (day.activities?.length || 0);
        }
      }
    });

    return list;
  }, [itineraries]);

  const barOpts: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: monthAct.map((x: any) => x.month) },
    colors: ['#1890ff'],
    dataLabels: { enabled: true },
    title: { text: 'Số lượng hoạt động theo tháng', align: 'center' }
  };

  const hotOpts: any = {
    chart: { type: 'bar' },
    plotOptions: { bar: { horizontal: true } },
    xaxis: { categories: dashboardStat.popularityData.map((x: any) => x.name) },
    colors: ['#52c41a'],
    dataLabels: { enabled: true },
    title: { text: 'Địa điểm phổ biến nhất (Sổ hành trình)', align: 'center' }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic 
              title="Tổng doanh thu ước tính" 
              value={dashboardStat.totalRev} 
              prefix={<DollarOutlined />} 
              suffix="đ"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: 8 }}>
            <Statistic 
              title="Địa điểm đang hot" 
              value={dashboardStat.popularityData[0]?.name || 'N/A'}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#cf1322', fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
            <Card style={{ borderRadius: 8 }}>
              <Chart options={barOpts} series={[{ name: 'Hoạt động', data: monthAct.map(x => x.value) }]} type="bar" height={150} />
            </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card title="Phân tích độ phổ biến" style={{ borderRadius: 8, height: '100%' }}>
            {dashboardStat.popularityData.some(x => x.liveCount > 0) ? (
              <Chart options={hotOpts} series={[{ name: 'Lượt chọn', data: dashboardStat.popularityData.map((x: any) => x.liveCount) }]} type="bar" height={400} />
            ) : (
              <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Text type="secondary">Chưa có dữ liệu phổ biến. Hãy bắt đầu thêm địa điểm vào lịch trình!</Text>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={14}>
          <Card 
            title="Quản lý dữ liệu Điểm đến" 
            style={{ borderRadius: 8 }} 
            extra={
              <Space>
                <Popconfirm title="Tất cả dữ liệu đã thêm sẽ bị mất và quay về mặc định. Chắc chắn không?" onConfirm={() => resetData()}>
                  <Button danger>Reset Cấu hình</Button>
                </Popconfirm>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Thêm điểm đến</Button>
              </Space>
            }
          >
            <Table 
              columns={tableCols} 
              dataSource={destinations} 
              rowKey="id" 
              pagination={{ pageSize: 5 }} 
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal 
        title={editingRow ? "Sửa điểm đến" : "Thêm điểm đến"} 
        visible={modalOpen} 
        onOk={submitModal} 
        onCancel={() => setModalOpen(false)} 
        okText="Lưu" 
        cancelText="Hủy" 
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Vịnh Hạ Long" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
                <Input placeholder="Quảng Ninh" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                <Select placeholder="Chọn loại hình">
                  <Option value="Sea">Biển</Option>
                  <Option value="Mountain">Núi</Option>
                  <Option value="City">Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="timeCost" label="Thời gian tham quan (Giờ)" rules={[{ required: true, message: 'Nhập số giờ' }]}>
                <InputNumber style={{ width: '100%' }} min={0.5} step={0.5} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} style={{ marginBottom: 16 }}>Phân bổ chi phí (VNĐ)</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="costEating" label="Ăn uống" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costMoving" label="Di chuyển" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="costLodging" label="Lưu trú" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="image" label="Ảnh URL" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rating" label="Đánh giá" initialValue={5}>
                <Rate allowHalf style={{ fontSize: 16 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả sơ lược về điểm đến..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
