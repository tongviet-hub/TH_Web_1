import { Tabs } from "antd";
import { useState, useEffect } from "react";
import EmployeePage from "./pages/Employees";
import ServicesPage from "./pages/Services";
import BookingPage from "./pages/Booking";
import ReviewsPage from "./pages/Reviews";
import ReportsPage from "./pages/Reports";
import { Employee, Service, Appointment, Review } from "./types/index";

const { TabPane } = Tabs;

export default function KhachHangDatLichHen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    const storedServices = localStorage.getItem("services");
    const storedAppointments = localStorage.getItem("appointments");
    const storedReviews = localStorage.getItem("reviews");

    if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
    if (storedServices) setServices(JSON.parse(storedServices));
    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedReviews) setReviews(JSON.parse(storedReviews));
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    setAppointments(prev =>
      prev.map(item => (item.id === appointment.id ? appointment : item))
    );
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(item => item.id !== id));
  };

  const handleAddReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
  };

  const handleUpdateReview = (review: Review) => {
    setReviews(prev =>
      prev.map(item => (item.id === review.id ? review : item))
    );
  };

  const handleDeleteReview = (id: number) => {
    setReviews(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateEmployee = (employee: Employee) => {
    setEmployees(prev =>
      prev.map(item => (item.id === employee.id ? employee : item))
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 24 }}>Quản lý Lịch hẹn Dịch vụ</h1>

      <Tabs type="card">
        <TabPane tab="Quản lý Nhân viên" key="employees">
          <div style={{ background: "white", padding: 16, borderRadius: 4 }}>
            <EmployeePage employees={employees} onEmployeesChange={setEmployees} />
          </div>
        </TabPane>
        <TabPane tab="Quản lý Dịch vụ" key="services">
          <div style={{ background: "white", padding: 16, borderRadius: 4 }}>
            <ServicesPage services={services} onServicesChange={setServices} />
          </div>
        </TabPane>
        <TabPane tab="Quản lý Lịch hẹn" key="bookings">
          <div style={{ background: "white", padding: 16, borderRadius: 4 }}>
            <BookingPage
              employees={employees}
              services={services}
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onUpdateAppointment={handleUpdateAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          </div>
        </TabPane>
        <TabPane tab="Đánh giá & Phản hồi" key="reviews">
          <div style={{ background: "white", padding: 16, borderRadius: 4 }}>
            <ReviewsPage
              reviews={reviews}
              appointments={appointments}
              employees={employees}
              onAddReview={handleAddReview}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
              onUpdateEmployee={handleUpdateEmployee}
            />
          </div>
        </TabPane>
        <TabPane tab="Thống kê & Báo cáo" key="reports">
          <div style={{ background: "white", padding: 16, borderRadius: 4 }}>
            <ReportsPage
              appointments={appointments}
              services={services}
              employees={employees}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
