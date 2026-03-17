import { DatePicker, TimePicker, Select, Button, message, Table, Modal, Form, Input, Space, Popconfirm, Tag } from "antd";
import { useState } from "react";
import moment, { Moment } from "moment";
import { Appointment, Employee, Service } from "../types/index";
import { isConflict } from "../utils/checkConflict";

interface BookingPageProps {
  employees: Employee[];
  services: Service[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: number) => void;
}

export default function BookingPage({
  employees,
  services,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>();
  const [selectedServiceId, setSelectedServiceId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);

  const selectedService = services.find(service => service.id === selectedServiceId);
  const statusOptions = [
    { label: "Chờ duyệt", value: "pending" },
    { label: "Xác nhận", value: "confirmed" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Hủy", value: "cancelled" }
  ];

  const handleSubmit = (formValues: any) => {
    if (!selectedEmployeeId || !selectedServiceId || !selectedDate || !startTime || !endTime) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const appointmentPayload: Appointment = {
      id: editingAppointmentId || Date.now(),
      customerName: formValues.customerName,
      customerPhone: formValues.customerPhone,
      employeeId: selectedEmployeeId,
      serviceId: selectedServiceId,
      date: selectedDate.format("YYYY-MM-DD"),
      start: startTime.format("HH:mm"),
      end: endTime.format("HH:mm"),
      status: formValues.status || "pending",
      estimatedCost: selectedService?.price
    };

    const comparedAppointments = editingAppointmentId 
      ? appointments.filter(appointment => appointment.id !== editingAppointmentId)
      : appointments;

    if (isConflict(appointmentPayload, comparedAppointments)) {
      message.error("Trùng lịch! Vui lòng chọn thời gian khác.");
      return;
    }

    if (editingAppointmentId) {
      onUpdateAppointment(appointmentPayload);
      message.success("Cập nhật lịch hẹn thành công!");
    } else {
      onAddAppointment(appointmentPayload);
      message.success("Đặt lịch hẹn thành công!");
    }

    handleCloseModal();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setSelectedEmployeeId(appointment.employeeId);
    setSelectedServiceId(appointment.serviceId);
    setSelectedDate(moment(appointment.date, "YYYY-MM-DD"));
    setStartTime(moment(appointment.start, "HH:mm"));
    setEndTime(moment(appointment.end, "HH:mm"));
    form.setFieldsValue({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      status: appointment.status
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointmentId(null);
    setSelectedDate(null);
    setStartTime(null);
    setEndTime(null);
    setSelectedEmployeeId(undefined);
    setSelectedServiceId(undefined);
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: "orange",
      confirmed: "blue",
      completed: "green",
      cancelled: "red"
    };
    const labelMap: { [key: string]: string } = {
      pending: "Chờ duyệt",
      confirmed: "Xác nhận",
      completed: "Hoàn thành",
      cancelled: "Hủy"
    };
    return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Button type="primary" onClick={() => {
          setEditingAppointmentId(null);
          form.resetFields();
          form.setFieldsValue({ status: "pending" });
          setSelectedDate(null);
          setStartTime(null);
          setEndTime(null);
          setSelectedEmployeeId(undefined);
          setSelectedServiceId(undefined);
          setIsModalOpen(true);
        }}>
          Đặt lịch hẹn
        </Button>
      </div>

      <Table
        columns={[
          { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
          { title: "SĐT", dataIndex: "customerPhone", key: "customerPhone" },
          {
            title: "Nhân viên",
            key: "employeeId",
            render: (_, record: Appointment) => {
              const employee = employees.find(item => item.id === record.employeeId);
              return employee?.name || "-";
            }
          },
          {
            title: "Dịch vụ",
            key: "serviceId",
            render: (_, record: Appointment) => {
              const service = services.find(item => item.id === record.serviceId);
              return service?.name || "-";
            }
          },
          { title: "Ngày", dataIndex: "date", key: "date" },
          { title: "Giờ", key: "time", render: (_, record: Appointment) => `${record.start} - ${record.end}` },
          {
            title: "Giá (VND)",
            key: "price",
            render: (_, record: Appointment) => `${record.estimatedCost?.toLocaleString() || 0}`
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusColor(status)
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record: Appointment) => (
              <Space>
                <Button type="link" size="small" onClick={() => handleEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa lịch hẹn"
                  description="Bạn có chắc chắn muốn xóa lịch hẹn này?"
                  onConfirm={() => {
                    onDeleteAppointment(record.id);
                    message.success("Xóa lịch hẹn thành công!");
                  }}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" danger size="small">
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
        dataSource={appointments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingAppointmentId ? "Sửa lịch hẹn" : "Đặt lịch hẹn"}
        width={600}
        forceRender
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Nhân viên" required>
            <Select
              value={selectedEmployeeId}
              onChange={setSelectedEmployeeId}
              placeholder="Chọn nhân viên"
              options={employees.map(employee => ({ label: employee.name, value: employee.id }))}
            />
          </Form.Item>

          <Form.Item label="Dịch vụ" required>
            <Select
              value={selectedServiceId}
              onChange={setSelectedServiceId}
              placeholder="Chọn dịch vụ"
              options={services.map(service => ({
                label: `${service.name} - ${service.price.toLocaleString()} VND (${service.duration} phút)`,
                value: service.id
              }))}
            />
          </Form.Item>

          <Form.Item label="Ngày" required>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current < moment().startOf("day")}
            />
          </Form.Item>

          <Form.Item label="Giờ bắt đầu" required>
            <TimePicker
              value={startTime}
              onChange={(time) => {
                setStartTime(time);
                if (time && selectedService) {
                  const suggestedEndTime = time.add(selectedService.duration, "minutes");
                  setEndTime(suggestedEndTime);
                }
              }}
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item label="Giờ kết thúc" required>
            <TimePicker
              value={endTime}
              onChange={setEndTime}
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="pending"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={statusOptions}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingAppointmentId ? "Cập nhật" : "Đặt lịch"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}