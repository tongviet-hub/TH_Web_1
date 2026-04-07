import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Rate, Tag, Button, Select, Slider, Space, message, Input } from 'antd';
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const KhamPha: React.FC = () => {
  const { destinations, setItineraries } = useModel('travelPlanner');

  const [kindFilter, setKindFilter] = useState<string>('All');
  const [priceCeil, setPriceCeil] = useState<number | undefined>(undefined);
  const [sortMode, setSortMode] = useState<string>('rating');
  const [kw, setKw] = useState<string>('');

  const topPrice = useMemo(() => {
    const highestPrice = destinations.reduce((max, d) => {
      const total = (d.costEating || 0) + (d.costMoving || 0) + (d.costLodging || 0);
      return Math.max(max, total);
    }, 0);
    return Math.max(10000000, highestPrice);
  }, [destinations]);

  React.useEffect(() => {
    console.log('--- KHAM PHA SYNC CHECK ---');
    console.log('Total destinations in model:', destinations.length);
    console.log('Destinations:', destinations);
    console.log('---------------------------');
  }, [destinations]);

  const displayList = useMemo(() => {
    let tempList = destinations.map(d => ({
      ...d,
      totalPrice: (d.costEating || 0) + (d.costMoving || 0) + (d.costLodging || 0)
    }));

    if (kw) {
      const lowerSearch = kw.toLowerCase();
      tempList = tempList.filter(
        d => d.name.toLowerCase().includes(lowerSearch) || d.location.toLowerCase().includes(lowerSearch)
      );
    }
    if (kindFilter !== 'All') {
      tempList = tempList.filter(d => d.type === kindFilter);
    }
    if (typeof priceCeil === 'number') {
      tempList = tempList.filter(d => d.totalPrice <= priceCeil);
    }

    if (sortMode === 'price_asc') {
      tempList.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
    } else if (sortMode === 'price_desc') {
      tempList.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
    } else if (sortMode === 'rating') {
      tempList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return tempList;
  }, [destinations, kindFilter, priceCeil, sortMode, kw]);

  const pushToPlan = (dest: any) => {
    setItineraries((prev: any) => {
      const next = [...prev];
      if (next.length === 0) {
        next.push({ dayId: 1, date: 'Ngày 1', activities: [] });
      }
      const today = next[0];
      today.activities.push({
        id: Math.random().toString(36).substring(7),
        destId: dest.id,
        name: dest.name,
        timeCost: dest.timeCost,
        costEating: dest.costEating,
        costMoving: dest.costMoving,
        costLodging: dest.costLodging
      });
      return next;
    });
    message.success(`Đã thêm ${dest.name} vào lịch trình!`);
  };

  const renderTag = (type: string) => {
    if (type === 'Sea') return <Tag color="blue">Biển</Tag>;
    if (type === 'Mountain') return <Tag color="green">Núi</Tag>;
    if (type === 'City') return <Tag color="magenta">Thành phố</Tag>;
    return null;
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Khám phá Điểm đến</Title>
        <Tag color="blue" style={{ fontSize: 14 }}>
          {displayList.length} / {destinations.length} địa điểm
        </Tag>
      </div>
      
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Space size="large" wrap>
          <div style={{ width: 220 }}>
            <Text strong>Tìm kiếm:</Text>
            <Input 
              placeholder="Tên địa điểm..." 
              value={kw}
              onChange={e => setKw(e.target.value)}
              style={{ marginLeft: 8, width: 140 }}
            />
          </div>
          <div>
            <Text strong>Loại hình:</Text>
            <Select style={{ width: 150, marginLeft: 8 }} value={kindFilter} onChange={setKindFilter}>
              <Option value="All">Tất cả</Option>
              <Option value="Sea">Biển</Option>
              <Option value="Mountain">Núi</Option>
              <Option value="City">Thành phố</Option>
            </Select>
          </div>
          <div style={{ width: 250 }}>
            <Text strong>Giá tối đa:</Text>
            <Slider
              min={0}
              max={topPrice}
              step={100000}
              value={priceCeil ?? topPrice}
              onChange={(value) => setPriceCeil(value)}
              tipFormatter={val => `${val?.toLocaleString('vi-VN')} đ`}
            />
          </div>
          <div>
            <Text strong>Sắp xếp:</Text>
            <Select style={{ width: 180, marginLeft: 8 }} value={sortMode} onChange={setSortMode}>
              <Option value="rating">Đánh giá cao nhất</Option>
              <Option value="price_asc">Giá (Thấp - Cao)</Option>
              <Option value="price_desc">Giá (Cao - Thấp)</Option>
            </Select>
          </div>
          <Button onClick={() => { setKindFilter('All'); setPriceCeil(undefined); setSortMode('rating'); setKw(''); }}>
            Xóa bộ lọc
          </Button>
        </Space>
      </Card>

      <Row gutter={[24, 24]}>
        {displayList.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              style={{ borderRadius: 8, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              cover={
                <img 
                  alt={item.name} 
                  src={item.image} 
                  style={{ height: 180, objectFit: 'cover' }}
                />
              }
              actions={[
                <Button type="primary" icon={<PlusOutlined />} onClick={() => pushToPlan(item)}>
                  Thêm vào lịch
                </Button>
              ]}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Title level={4} style={{ margin: 0 }}>{item.name}</Title>
                {renderTag(item.type)}
              </div>
              
              <div style={{ marginTop: 8, color: '#595959' }}>
                <EnvironmentOutlined /> {item.location}
              </div>
              
              <div style={{ marginTop: 8 }}>
                <Rate disabled allowHalf defaultValue={item.rating} style={{ fontSize: 13 }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>({item.rating})</Text>
              </div>

              <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 12, fontSize: 13, color: '#8c8c8c' }}>
                {item.description}
              </Paragraph>

              <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                <div style={{ fontSize: 13, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Ăn uống:</Text>
                  <Text>{(item.costEating || 0).toLocaleString('vi-VN')} đ</Text>
                </div>
                <div style={{ fontSize: 13, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Di chuyển:</Text>
                  <Text>{(item.costMoving || 0).toLocaleString('vi-VN')} đ</Text>
                </div>
                <div style={{ fontSize: 13, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Lưu trú:</Text>
                  <Text>{(item.costLodging || 0).toLocaleString('vi-VN')} đ</Text>
                </div>
                <div style={{ borderTop: '1px dashed #d9d9d9', paddingTop: 8, marginTop: 8 }}>
                  <Text strong style={{ fontSize: 14 }}>Tổng dự kiến:</Text>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#f5222d', textAlign: 'right' }}>
                    {item.totalPrice.toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default KhamPha;
