import React, { useMemo } from 'react';
import { Card, Col, Empty, Row, Statistic, Timeline } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

type ChartPoint = {
  label: string;
  value: number;
};

type ChartProps = {
  data: ChartPoint[];
};

const SimpleBarChart: React.FC<ChartProps> = ({ data }) => {
  if (!data.length) return <Empty description="Không có dữ liệu" />;

  const highestValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', minHeight: 200 }}>
      {data.map((item) => (
        <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: `${Math.max((item.value / highestValue) * 160, 8)}px`,
              background: '#1890ff',
              borderRadius: 6,
            }}
          />
          <div style={{ marginTop: 8 }}>{item.label}</div>
          <div style={{ color: '#888' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

const SimpleLineChart: React.FC<ChartProps> = ({ data }) => {
  if (!data.length) return <Empty description="Không có dữ liệu" />;

  const values = data.map((item) => item.value);
  const highestValue = Math.max(...values);
  const lowestValue = Math.min(...values);
  const valueRange = Math.max(highestValue - lowestValue, 1);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', minHeight: 200 }}>
      {data.map((item) => (
        <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: `${20 + ((item.value - lowestValue) / valueRange) * 160}px`,
              width: 6,
              margin: '0 auto',
              background: '#52c41a',
              borderRadius: 4,
            }}
          />
          <div style={{ marginTop: 8 }}>{item.label}</div>
          <div style={{ color: '#888' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { workouts, healthLogs, getThisMonthWorkouts, getTotalCaloriesThisMonth, getStreak } = useModel('th08');

  const workoutsThisMonth = getThisMonthWorkouts();

  const totalWorkouts = workoutsThisMonth.length;
  const totalCalories = getTotalCaloriesThisMonth();
  const streak = getStreak();

  const goalProgress = 0; // placeholder — can be computed from goals later

  const weeklyWorkoutData = useMemo(() => {
    const countsByWeek: Record<string, number> = {};

    workoutsThisMonth.forEach((workout) => {
      const weekNumber = moment(workout.date).week();
      countsByWeek[weekNumber] = (countsByWeek[weekNumber] || 0) + 1;
    });

    return Object.keys(countsByWeek).map((weekNumber) => ({
      label: `W${weekNumber}`,
      value: countsByWeek[weekNumber],
    }));
  }, [workoutsThisMonth]);

  const weightTrendData = useMemo(() => {
    return healthLogs
      .map((log) => ({ date: log.date, weight: log.weight }))
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      .map((item) => ({ label: moment(item.date).format('DD/MM'), value: item.weight }));
  }, [healthLogs]);

  const recentWorkouts = workouts.slice(0, 5);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Buổi tập tháng" value={totalWorkouts} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Tổng calo đã đốt" value={totalCalories} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Streak (ngày)" value={streak} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Mục tiêu hoàn thành" value={`${goalProgress}%`} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Buổi tập theo tuần">
            <SimpleBarChart data={weeklyWorkoutData} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Cân nặng theo thời gian">
            <SimpleLineChart data={weightTrendData} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="5 buổi tập gần nhất">
            {recentWorkouts.length ? (
            <Timeline>
              {recentWorkouts.map((workout) => (
                <Timeline.Item key={workout.id}>
                  {moment(workout.date).format('YYYY-MM-DD')} — {workout.name} ({workout.type}) • {workout.duration} phút
                </Timeline.Item>
              ))}
            </Timeline>
            ) : (
              <Empty description="Không có dữ liệu" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

