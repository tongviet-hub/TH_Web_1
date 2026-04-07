import React from 'react';
import { useModel } from 'umi';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Typography, Button, Space, Result, Timeline, Popconfirm, Tag, Row, Col, Tooltip, DatePicker } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, DollarOutlined, EnvironmentOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const LichTrinh: React.FC = () => {
  const { itineraries, setItineraries } = useModel('travelPlanner');

  const onDropDone = (rs: DropResult) => {
    const { source, destination } = rs;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const srcDayIdx = itineraries.findIndex((d: any) => `day-${d.dayId}` === source.droppableId);
    const dstDayIdx = itineraries.findIndex((d: any) => `day-${d.dayId}` === destination.droppableId);

    if (srcDayIdx === -1 || dstDayIdx === -1) return;

    setItineraries((prev: any) => {
      const copied = JSON.parse(JSON.stringify(prev));
      
      const sourceDay = copied[srcDayIdx];
      const destDay = copied[dstDayIdx];

      const [picked] = sourceDay.activities.splice(source.index, 1);
      
      destDay.activities.splice(destination.index, 0, picked);

      return copied;
    });
  };

  const removeAct = (dayIndex: number, actIndex: number) => {
    setItineraries((prev: any) => {
      const copied = [...prev];
      copied[dayIndex].activities.splice(actIndex, 1);
      return copied;
    });
  };

  const addMoreDay = () => {
    setItineraries((prev: any) => {
      const last = prev[prev.length - 1];
      let nextDate = moment();
      if (last && last.actualDate) {
        nextDate = moment(last.actualDate).add(1, 'day');
      }

      return [...prev, {
        dayId: Date.now(),
        date: `Ngày ${prev.length + 1}`,
        actualDate: nextDate.toISOString(),
        activities: []
      }];
    });
  };

  const setDayDate = (dayId: number, dateStr: string) => {
    setItineraries((prev: any) => {
      return prev.map((d: any) => d.dayId === dayId ? { ...d, actualDate: dateStr } : d);
    });
  };

  const deleteDay = (dayId: number) => {
    setItineraries((prev: any) => prev.filter((d: any) => d.dayId !== dayId));
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Lịch trình chi tiết</Title>
          <Text type="secondary">Chọn ngày cụ thể và sắp xếp các hoạt động tham quan</Text>
        </div>
        <Button type="primary" size="large" onClick={addMoreDay} style={{ borderRadius: 6 }} icon={<CalendarOutlined />}>
          Thêm ngày mới
        </Button>
      </div>

      <DragDropContext onDragEnd={onDropDone}>
        <Row gutter={[24, 24]}>
          {itineraries.map((day: any, idxDay: number) => {
            const totalHours = day.activities.reduce((sum: number, a: any) => sum + (a.timeCost || 0), 0);
            const totalCost = day.activities.reduce((sum: number, a: any) => {
              return sum + (a.costEating || 0) + (a.costMoving || 0) + (a.costLodging || 0);
            }, 0);
            const overLimit = totalHours > 24;

            return (
              <Col xs={24} lg={12} key={day.dayId}>
                <Card 
                  title={
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{day.date}</Text>
                        <DatePicker 
                          bordered={false} 
                          value={day.actualDate ? moment(day.actualDate) : null} 
                          onChange={(date) => setDayDate(day.dayId, date ? date.toISOString() : '')}
                          format="DD/MM/YYYY"
                          allowClear={false}
                          style={{ padding: 0, fontWeight: 'bold', fontSize: 14 }}
                        />
                      </Space>
                      <Space size="middle" wrap>
                        <Tooltip title={`Tổng ${totalHours} giờ tham quan`}>
                          <Tag icon={<ClockCircleOutlined />} color="processing" style={{ borderRadius: 4 }}>{totalHours}h</Tag>
                        </Tooltip>
                        <Tag icon={<DollarOutlined />} color="error" style={{ borderRadius: 4 }}>{totalCost.toLocaleString('vi-VN')} đ</Tag>
                        {itineraries.length > 1 && (
                          <Popconfirm title="Xóa cả ngày này?" onConfirm={() => deleteDay(day.dayId)}>
                            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                          </Popconfirm>
                        )}
                      </Space>
                    </Space>
                  }
                  style={{ borderRadius: 12, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  headStyle={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
                >
                  {overLimit && (
                    <Text type="danger" style={{ display: 'block', marginBottom: 12, fontWeight: 600 }}>
                      Note đỏ: Tổng thời gian trong ngày đang vượt 24 giờ, vui lòng bớt hoạt động.
                    </Text>
                  )}

                  <Droppable droppableId={`day-${day.dayId}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ minHeight: 150 }}
                      >
                        {day.activities.length === 0 ? (
                          <Result
                            icon={<EnvironmentOutlined style={{ color: '#d9d9d9', fontSize: 40 }} />}
                            title={<span style={{ color: '#bfbfbf' }}>Trống</span>}
                            subTitle="Kéo thả điểm đến vào đây"
                            style={{ padding: '20px 0' }}
                          />
                        ) : (
                          <Timeline style={{ marginTop: 16 }}>
                            {day.activities.map((act: any, actIdx: number) => {
                              const actTotal = (act.costEating || 0) + (act.costMoving || 0) + (act.costLodging || 0);
                              return (
                                <Draggable key={act.id} draggableId={act.id} index={actIdx}>
                                  {(prov, snapshot) => (
                                    <Timeline.Item color="blue">
                                      <div
                                        ref={prov.innerRef}
                                        {...prov.draggableProps}
                                        {...prov.dragHandleProps}
                                        style={{
                                          ...prov.draggableProps.style,
                                          userSelect: 'none',
                                          padding: 14,
                                          margin: '0 0 12px 0',
                                          backgroundColor: snapshot.isDragging ? '#f0faff' : '#ffffff',
                                          border: snapshot.isDragging ? '1px dashed #1890ff' : '1px solid #f0f0f0',
                                          borderRadius: 8,
                                          boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 4,
                                        }}
                                      >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Text strong>{act.name}</Text>
                                          <Space>
                                             <Tooltip title={`Ăn: ${act.costEating?.toLocaleString()}đ | Di chuyển: ${act.costMoving?.toLocaleString()}đ | Lưu trú: ${act.costLodging?.toLocaleString()}đ`}>
                                                <InfoCircleOutlined style={{ color: '#bfbfbf' }} />
                                             </Tooltip>
                                               <Button
                                              type="text" 
                                              danger 
                                              icon={<DeleteOutlined />} 
                                              size="small" 
                                                onClick={() => removeAct(idxDay, actIdx)}
                                            />
                                          </Space>
                                        </div>
                                        <Space wrap size={4}>
                                          <Text type="secondary" style={{ fontSize: 12 }}>{act.timeCost}h</Text>
                                          <Text type="danger" style={{ fontSize: 12, fontWeight: 'bold' }}>{actTotal.toLocaleString('vi-VN')}đ</Text>
                                        </Space>
                                      </div>
                                    </Timeline.Item>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </Timeline>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </Col>
            );
          })}
        </Row>
      </DragDropContext>
    </div>
  );
};

export default LichTrinh;
