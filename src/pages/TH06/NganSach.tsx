import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { Card, Typography, Row, Col, Statistic, Alert, Progress, InputNumber, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const NganSach: React.FC = () => {
  const { itineraries, budgetLimit, setBudgetLimit } = useModel('travelPlanner');

  const { totalCost, chartData } = useMemo(() => {
    let allCost = 0;
    let eating = 0;
    let moving = 0;
    let lodging = 0;

    itineraries.forEach((day: any) => {
      day.activities.forEach((act: any) => {
        eating += (act.costEating || 0);
        moving += (act.costMoving || 0);
        lodging += (act.costLodging || 0);
      });
    });

    allCost = eating + moving + lodging;

    const spendByType = [
      { type: 'Ăn uống', value: eating },
      { type: 'Di chuyển', value: moving },
      { type: 'Lưu trú', value: lodging },
    ].filter(d => d.value > 0);

    return { totalCost: allCost, chartData: spendByType };
  }, [itineraries]);

  const isOverBudget = totalCost > budgetLimit;
  const usedPercentStr = budgetLimit > 0 ? ((totalCost / budgetLimit) * 100).toFixed(1) : '0';
  const usedPercentNum = parseFloat(usedPercentStr);

  const pieOpt: any = {
    labels: chartData.map(d => d.type),
    legend: { 
      position: 'bottom',
      fontSize: '14px'
    },
    colors: ['#FF9F43', '#00CFE8', '#7367F0'],
    dataLabels: {
      enabled: true,
      formatter: (val: any, opts: any) => {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return `${name}: ${val.toFixed(1)}%`;
      }
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val?.toLocaleString('vi-VN')} đ`
      }
    },
    title: {
      text: 'Phân bổ chi ngân sách',
      align: 'center'
    }
  };

  const pieSeries = chartData.map(d => d.value);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2}>Quản lý ngân sách</Title>

      {isOverBudget && (
        <Alert
          message="Cảnh báo: Vượt quá ngân sách!"
          description={`Ngân sách dự kiến: ${budgetLimit.toLocaleString('vi-VN')}đ. Bạn đã chi ${totalCost.toLocaleString('vi-VN')}đ, vượt mức ${(totalCost - budgetLimit).toLocaleString('vi-VN')}đ.`}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {!isOverBudget && totalCost > 0 && (
        <Alert
          message="Trong kế hoạch"
          description={`Bạn vẫn còn dư ${(budgetLimit - totalCost).toLocaleString('vi-VN')}đ để chi tiêu.`}
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card 
            title="Cài đặt ngân sách" 
            style={{ borderRadius: 8, height: '100%' }}
          >
            <div>
              <Text type="secondary">Hạn mức chi tiêu (VNĐ):</Text>
              <div style={{ marginTop: 8, marginBottom: 24, display: 'flex', gap: 8 }}>
                <InputNumber
                  style={{ flex: 1 }}
                  min={0}
                  step={500000}
                  value={budgetLimit}
                  onChange={(val) => setBudgetLimit(val || 0)}
                  formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
                <Button type="primary" icon={<SaveOutlined />}>Lưu</Button>
              </div>
            </div>
            
            <Statistic 
              title="Tổng ngân sách tối đa" 
              value={budgetLimit} 
              suffix="đ"
            />
            <div style={{ marginTop: 24 }}>
              <Statistic 
                title="Đã chi tiêu (Dự kiến)" 
                value={totalCost} 
                suffix="đ"
                valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }} 
              />
            </div>
            
            <div style={{ marginTop: 24 }}>
              <Text type="secondary">Mức độ sử dụng ngân sách</Text>
              <Progress 
                percent={usedPercentNum > 100 ? 100 : usedPercentNum}
                status={isOverBudget ? 'exception' : 'active'}
                format={() => `${usedPercentStr}%`}
                strokeWidth={12}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 8, height: '100%', minHeight: 400 }}>
            {chartData.length > 0 ? (
              <Chart options={pieOpt} series={pieSeries} type="pie" height={380} />
            ) : (
              <div style={{ textAlign: 'center', marginTop: 100 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>Chưa có dữ liệu chi tiêu trong lịch trình.</Text>
                <br/>
                <Text type="secondary">Hãy thêm các điểm đến để xem phân bổ ngân sách.</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NganSach;
