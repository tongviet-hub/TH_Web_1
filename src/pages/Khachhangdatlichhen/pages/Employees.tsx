import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, TimePicker, Select, message } from "antd";
import { useState, useEffect } from "react";
import { Employee } from "../types/index";
import moment from "moment";

interface EmployeePageProps {
  employees: Employee[];
  onEmployeesChange: (employees: Employee[]) => void;
}

export default function EmployeePage({ employees, onEmployeesChange }: EmployeePageProps) {
  const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setEmployeeList(employees);
  }, [employees]);

  const handleSubmit = (formValues: any) => {
    const workingHours = Array.isArray(formValues.workingHours) 
      ? formValues.workingHours.map((shift: any) => ({
          dayOfWeek: shift.day || 0,
          startTime: shift.start?.format("HH:mm") || "09:00",
          endTime: shift.end?.format("HH:mm") || "17:00"
        }))
      : [];

    let nextEmployees: Employee[];
    if (editingId) {
      nextEmployees = employeeList.map(employee =>
        employee.id === editingId
          ? {
              ...employee,
              name: formValues.name,
              maxCustomersPerDay: formValues.maxCustomersPerDay,
              workingHours
            }
          : employee
      );
      message.success("Cập nhật nhân viên thành công!");
    } else {
      const newEmployee: Employee = {
        id: Date.now(),
        name: formValues.name,
        maxCustomersPerDay: formValues.maxCustomersPerDay,
        workingHours,
        averageRating: 0,
        totalReviews: 0
      };
      nextEmployees = [...employeeList, newEmployee];
      message.success("Thêm nhân viên thành công!");
    }

    setEmployeeList(nextEmployees);
    onEmployeesChange(nextEmployees);
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    form.setFieldsValue({
      name: employee.name,
      maxCustomersPerDay: employee.maxCustomersPerDay,
      workingHours: employee.workingHours.map((shift) => ({
        day: shift.dayOfWeek,
        start: moment(shift.startTime, "HH:mm"),
        end: moment(shift.endTime, "HH:mm")
      }))
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const nextEmployees = employeeList.filter(employee => employee.id !== id);
    setEmployeeList(nextEmployees);
    onEmployeesChange(nextEmployees);
    message.success("Xóa nhân viên thành công!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const dayOfWeekOptions = [
    { label: "Chủ nhật", value: 0 },
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 }
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalOpen(true);
        }}>
          Thêm nhân viên
        </Button>
      </div>

      <Table
        dataSource={employeeList}
        rowKey="id"
        columns={[
          { title: "Tên", dataIndex: "name", key: "name" },
          { title: "Số khách/ngày", dataIndex: "maxCustomersPerDay", key: "maxCustomersPerDay" },
          {
            title: "Đánh giá",
            key: "rating",
            render: (_, record: Employee) => (
              record.totalReviews > 0
                ? `${record.averageRating.toFixed(1)}/5 (${record.totalReviews} đánh giá)`
                : "Chưa có đánh giá"
            )
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record: Employee) => (
              <Space>
                <Button type="link" size="small" onClick={() => handleEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa nhân viên"
                  description="Bạn có chắc chắn muốn xóa nhân viên này?"
                  onConfirm={() => handleDelete(record.id)}
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
      />

      <Modal
        visible={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingId ? "Sửa nhân viên" : "Thêm nhân viên"}
        forceRender
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên nhân viên" 
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên" }]}
          >
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item 
            name="maxCustomersPerDay" 
            label="Số khách tối đa/ngày"
            rules={[{ required: true, message: "Vui lòng nhập số khách tối đa" }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>

          <Form.Item label="Lịch làm việc">
            <Form.List name="workingHours">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} style={{ width: "100%", marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, "day"]}
                        noStyle
                      >
                        <Select
                          style={{ width: 100 }}
                          options={dayOfWeekOptions}
                          placeholder="Ngày"
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "start"]}
                        noStyle
                      >
                        <TimePicker format="HH:mm" placeholder="Bắt đầu" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "end"]}
                        noStyle
                      >
                        <TimePicker format="HH:mm" placeholder="Kết thúc" />
                      </Form.Item>
                      <Button onClick={() => remove(field.name)} danger>
                        Xóa
                      </Button>
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    + Thêm ngày làm việc
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}