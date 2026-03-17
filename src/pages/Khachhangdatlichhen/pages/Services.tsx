import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import { Service } from "../types/index";

interface ServicesPageProps {
  services: Service[];
  onServicesChange: (services: Service[]) => void;
}

export default function ServicesPage({ services, onServicesChange }: ServicesPageProps) {
  const [serviceList, setServiceList] = useState<Service[]>(services);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setServiceList(services);
  }, [services]);

  const handleSubmit = (formValues: any) => {
    let nextServices: Service[];
    if (editingId) {
      nextServices = serviceList.map(service =>
        service.id === editingId
          ? {
              ...service,
              name: formValues.name,
              price: formValues.price,
              duration: formValues.duration,
              description: formValues.description
            }
          : service
      );
      message.success("Cập nhật dịch vụ thành công!");
    } else {
      const createdService: Service = {
        id: Date.now(),
        name: formValues.name,
        price: formValues.price,
        duration: formValues.duration,
        description: formValues.description
      };
      nextServices = [...serviceList, createdService];
      message.success("Thêm dịch vụ thành công!");
    }

    setServiceList(nextServices);
    onServicesChange(nextServices);
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    form.setFieldsValue({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const nextServices = serviceList.filter(service => service.id !== id);
    setServiceList(nextServices);
    onServicesChange(nextServices);
    message.success("Xóa dịch vụ thành công!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalOpen(true);
        }}>
          Thêm dịch vụ
        </Button>
      </div>

      <Table
        dataSource={serviceList}
        rowKey="id"
        columns={[
          { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
          { 
            title: "Giá (VND)", 
            dataIndex: "price", 
            key: "price",
            render: (price) => `${price?.toLocaleString() || 0}`
          },
          { 
            title: "Thời gian (phút)", 
            dataIndex: "duration", 
            key: "duration" 
          },
          {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (description) => description || "-"
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record: Service) => (
              <Space>
                <Button type="link" size="small" onClick={() => handleEdit(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa dịch vụ"
                  description="Bạn có chắc chắn muốn xóa dịch vụ này?"
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
        title={editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}
        forceRender
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên dịch vụ" 
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
          >
            <Input placeholder="Ví dụ: Cắt tóc, Spa, Khám bệnh..." />
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Giá (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ" }]}
          >
            <InputNumber min={0} placeholder="Nhập giá" />
          </Form.Item>

          <Form.Item 
            name="duration" 
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời gian thực hiện" }]}
          >
            <InputNumber min={5} max={480} placeholder="Nhập thời gian (phút)" />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết về dịch vụ..." />
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
