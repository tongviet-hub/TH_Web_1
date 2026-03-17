import { Table, Button, Modal, Form, Input, Rate, Space, Popconfirm, message, Tag, Select } from "antd";
import { useState } from "react";
import { Review, Appointment, Employee } from "../types/index";

interface ReviewsPageProps {
  reviews: Review[];
  appointments: Appointment[];
  employees: Employee[];
  onAddReview: (review: Review) => void;
  onUpdateReview: (review: Review) => void;
  onDeleteReview: (id: number) => void;
  onUpdateEmployee: (employee: Employee) => void;
}

export default function ReviewsPage({
  reviews,
  appointments,
  employees,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onUpdateEmployee
}: ReviewsPageProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseForm] = Form.useForm();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleSubmit = (formValues: any) => {
    const finishedAppointments = appointments.filter(appointment => appointment.status === "completed");

    if (editingId) {
      const currentReview = reviews.find(review => review.id === editingId);
      if (currentReview) {
        const nextReview: Review = {
          ...currentReview,
          rating: formValues.rating,
          comment: formValues.comment
        };
        onUpdateReview(nextReview);
        message.success("Cập nhật đánh giá thành công!");
      }
    } else {
      if (!formValues.appointmentId) {
        message.error("Vui lòng chọn lịch hẹn!");
        return;
      }

      const currentAppointment = finishedAppointments.find(
        appointment => appointment.id === formValues.appointmentId
      );
      if (!currentAppointment) {
        message.error("Lịch hẹn không tồn tại hoặc chưa hoàn thành!");
        return;
      }

      const createdReview: Review = {
        id: Date.now(),
        appointmentId: formValues.appointmentId,
        employeeId: currentAppointment.employeeId,
        rating: formValues.rating,
        comment: formValues.comment,
        createdAt: new Date().toISOString(),
        isServiceReview: formValues.isServiceReview !== undefined ? formValues.isServiceReview : false
      };

      onAddReview(createdReview);

      const reviewList = reviews.filter(review => review.employeeId === currentAppointment.employeeId);
      const totalScore = reviewList.reduce((sum, review) => sum + review.rating, 0) + formValues.rating;
      const totalReviews = reviewList.length + 1;
      const averageRating = totalScore / totalReviews;

      const employee = employees.find(item => item.id === currentAppointment.employeeId);
      if (employee) {
        onUpdateEmployee({
          ...employee,
          averageRating,
          totalReviews
        });
      }

      message.success("Thêm đánh giá thành công!");
    }

    setIsReviewModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleResponseSubmit = (formValues: any) => {
    if (selectedReview) {
      const nextReview: Review = {
        ...selectedReview,
        employeeResponse: formValues.response
      };
      onUpdateReview(nextReview);
      message.success("Phản hồi thành công!");
    }

    setIsResponseModalOpen(false);
    setSelectedReview(null);
    responseForm.resetFields();
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment,
      isServiceReview: review.isServiceReview
    });
    setIsReviewModalOpen(true);
  };

  const handleDelete = (id: number) => {
    onDeleteReview(id);
    message.success("Xóa đánh giá thành công!");
  };

  const finishedAppointments = appointments.filter(appointment => appointment.status === "completed");

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsReviewModalOpen(true);
        }}>
          Thêm đánh giá
        </Button>
      </div>

      <Table
        columns={[
          {
            title: "Khách hàng",
            key: "customer",
            render: (_, record: Review) => {
              const appointment = appointments.find(item => item.id === record.appointmentId);
              return appointment?.customerName || "-";
            }
          },
          {
            title: "Nhân viên",
            key: "employee",
            render: (_, record: Review) => {
              const employee = employees.find(item => item.id === record.employeeId);
              return employee?.name || "-";
            }
          },
          {
            title: "Loại",
            key: "type",
            render: (_, record: Review) => (
              <Tag color={record.isServiceReview ? "blue" : "green"}>
                {record.isServiceReview ? "Dịch vụ" : "Nhân viên"}
              </Tag>
            )
          },
          {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => <Rate disabled value={rating} />
          },
          {
            title: "Nhận xét",
            dataIndex: "comment",
            key: "comment",
            render: (comment) => <span>{comment?.substring(0, 50)}...</span>
          },
          {
            title: "Phản hồi",
            key: "response",
            render: (_, record: Review) => (
              record.employeeResponse ? (
                <span style={{ color: "gold" }}>{record.employeeResponse.substring(0, 30)}...</span>
              ) : (
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setSelectedReview(record);
                    setIsResponseModalOpen(true);
                  }}
                >
                  Phản hồi
                </Button>
              )
            )
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record: Review) => (
              <Space>
                <Button type="link" size="small" onClick={() => handleEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa đánh giá này?"
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
        dataSource={reviews}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        visible={isReviewModalOpen}
        onCancel={() => {
          setIsReviewModalOpen(false);
          setEditingId(null);
          form.resetFields();
        }}
        footer={null}
        title={editingId ? "Sửa đánh giá" : "Thêm đánh giá"}
        forceRender
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {!editingId && (
            <Form.Item
              name="appointmentId"
              label="Chọn lịch hẹn"
              rules={[{ required: true, message: "Vui lòng chọn lịch hẹn" }]}
            >
              <Select
                placeholder="-- Chọn lịch hẹn --"
                options={finishedAppointments.map(appointment => ({
                  label: `${appointment.customerName} - ${appointment.date}`,
                  value: appointment.id
                }))}
              />
            </Form.Item>
          )}

          <Form.Item
            name="isServiceReview"
            label="Loại"
            rules={[{ required: true, message: "Vui lòng chọn loại đánh giá" }]}
          >
            <Select
              placeholder="-- Chọn loại --"
              options={[
                { label: "Đánh giá nhân viên", value: false },
                { label: "Đánh giá dịch vụ", value: true }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Điểm đánh giá"
            rules={[{ required: true, message: "Vui lòng chọn điểm đánh giá" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: "Vui lòng nhập nhận xét" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nhận xét của bạn..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isResponseModalOpen}
        onCancel={() => {
          setIsResponseModalOpen(false);
          setSelectedReview(null);
          responseForm.resetFields();
        }}
        footer={null}
        title="Phản hồi đánh giá"
        forceRender
      >
        <Form form={responseForm} onFinish={handleResponseSubmit} layout="vertical">
          <Form.Item
            name="response"
            label="Nội dung phản hồi"
            rules={[{ required: true, message: "Vui lòng nhập phản hồi" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
