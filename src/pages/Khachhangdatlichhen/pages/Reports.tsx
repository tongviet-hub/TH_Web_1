import { Table, Card, Row, Col, Statistic, DatePicker, Select, Button } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Appointment, Service, Employee } from "../types/index";

interface ReportsPageProps {
  appointments: Appointment[];
  services: Service[];
  employees: Employee[];
}

export default function ReportsPage({ appointments, services, employees }: ReportsPageProps) {
  const [reportType, setReportType] = useState<"daily" | "monthly">("daily");
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  const completedAppointments = appointments.filter(appointment => appointment.status === "completed");

  const getDailyStats = (date: string) => {
    const appointmentsInDay = completedAppointments.filter(appointment => appointment.date === date);
    const revenue = appointmentsInDay.reduce((sum, appointment) => sum + (appointment.estimatedCost || 0), 0);
    return {
      date,
      count: appointmentsInDay.length,
      revenue
    };
  };

  const getMonthlyStats = (month: Dayjs) => {
    const monthKey = month.format("YYYY-MM");
    const appointmentsInMonth = completedAppointments.filter(appointment => appointment.date.startsWith(monthKey));
    const revenue = appointmentsInMonth.reduce((sum, appointment) => sum + (appointment.estimatedCost || 0), 0);
    return {
      month: monthKey,
      count: appointmentsInMonth.length,
      revenue
    };
  };

  const getServiceRevenueReport = () => {
    return services.map(service => {
      const serviceAppointments = completedAppointments.filter(appointment => appointment.serviceId === service.id);
      const revenue = serviceAppointments.reduce((sum, appointment) => sum + (appointment.estimatedCost || 0), 0);
      return {
        serviceId: service.id,
        serviceName: service.name,
        appointmentCount: serviceAppointments.length,
        totalRevenue: revenue,
        averagePerAppointment: serviceAppointments.length > 0 ? revenue / serviceAppointments.length : 0
      };
    });
  };

  const getEmployeePerformanceReport = () => {
    return employees.map(employee => {
      const employeeAppointments = completedAppointments.filter(appointment => appointment.employeeId === employee.id);
      const revenue = employeeAppointments.reduce((sum, appointment) => sum + (appointment.estimatedCost || 0), 0);
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        appointmentCount: employeeAppointments.length,
        totalRevenue: revenue,
        averageRating: employee.averageRating,
        totalReviews: employee.totalReviews
      };
    });
  };

  const serviceRevenueData = getServiceRevenueReport();
  const employeePerformanceData = getEmployeePerformanceReport();
  const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + (appointment.estimatedCost || 0), 0);
  const totalAppointments = completedAppointments.length;

  return (
    <div style={{ paddingBottom: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={totalAppointments}
              suffix="lịch"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              suffix="VND"
              valueStyle={{ fontSize: 14 }}
              formatter={(value) => {
                const num = value as number;
                return num.toLocaleString();
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Dịch vụ"
              value={services.length}
              suffix="dịch vụ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Nhân viên"
              value={employees.length}
              suffix="nhân viên"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Báo cáo doanh thu theo dịch vụ"
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={[
            { title: "Dịch vụ", dataIndex: "serviceName", key: "serviceName" },
            {
              title: "Số lịch hẹn",
              dataIndex: "appointmentCount",
              key: "appointmentCount",
              sorter: (a, b) => a.appointmentCount - b.appointmentCount
            },
            {
              title: "Tổng doanh thu (VND)",
              key: "totalRevenue",
              render: (_, record) => record.totalRevenue.toLocaleString(),
              sorter: (a, b) => a.totalRevenue - b.totalRevenue
            },
            {
              title: "Trung bình/lịch (VND)",
              key: "average",
              render: (_, record) => record.averagePerAppointment.toLocaleString(),
              sorter: (a, b) => a.averagePerAppointment - b.averagePerAppointment
            }
          ]}
          dataSource={serviceRevenueData.filter(item => item.appointmentCount > 0)}
          rowKey="serviceId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card
        title="Báo cáo hiệu suất nhân viên"
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={[
            { title: "Nhân viên", dataIndex: "employeeName", key: "employeeName" },
            {
              title: "Số lịch hẹn",
              dataIndex: "appointmentCount",
              key: "appointmentCount",
              sorter: (a, b) => a.appointmentCount - b.appointmentCount
            },
            {
              title: "Doanh thu (VND)",
              key: "totalRevenue",
              render: (_, record) => record.totalRevenue.toLocaleString(),
              sorter: (a, b) => a.totalRevenue - b.totalRevenue
            },
            {
              title: "Đánh giá",
              key: "rating",
              render: (_, record) => (
                record.totalReviews > 0
                  ? `${record.averageRating.toFixed(1)}/5 (${record.totalReviews})`
                  : "Chưa có"
              ),
              sorter: (a, b) => a.averageRating - b.averageRating
            }
          ]}
          dataSource={employeePerformanceData}
          rowKey="employeeId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {reportType === "daily" && (
        <Card title="Thống kê theo ngày">
          <Table
            columns={[
              { title: "Ngày", dataIndex: "date", key: "date" },
              { title: "Số lịch hẹn", dataIndex: "count", key: "count" },
              {
                title: "Doanh thu (VND)",
                key: "revenue",
                render: (_, record) => record.revenue.toLocaleString()
              }
            ]}
            dataSource={[
              ...Array.from(
                {
                  length: dayjs().diff(
                    completedAppointments.length > 0
                      ? dayjs(Math.min(...completedAppointments.map(appointment => new Date(appointment.date).getTime())))
                      : dayjs(),
                    "day"
                  ) + 1
                },
                (_, i) => {
                  const date = dayjs(
                    completedAppointments.length > 0
                      ? Math.min(...completedAppointments.map(appointment => new Date(appointment.date).getTime()))
                      : dayjs()
                  )
                    .add(i, "day")
                    .format("YYYY-MM-DD");
                  return getDailyStats(date);
                }
              )
            ].filter(item => item.count > 0)}
            rowKey="date"
            pagination={{ pageSize: 15 }}
          />
        </Card>
      )}
    </div>
  );
}
