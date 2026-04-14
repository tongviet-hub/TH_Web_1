import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Typography } from 'antd';
import ReactQuill from 'react-quill';
import type { FormInstance } from 'antd/es/form';
import type { CourseItem, CourseStatus } from '@/models/courseModel';

type FormData = Omit<CourseItem, 'id'>;

const { Text, Title, Paragraph } = Typography;

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link'];

type CourseFormModalProps = {
  open: boolean;
  form: FormInstance<FormData>;
  editing: CourseItem | null;
  nameDraft: string;
  setNameDraft: (value: string) => void;
  lecturers: string[];
  statusOpt: { label: string; value: CourseStatus }[];
  checkDupName: (name: string, editingId?: number) => boolean;
  onClose: () => void;
  onSave: () => void;
};

const CourseFormModal = ({
  open,
  form,
  editing,
  nameDraft,
  setNameDraft,
  lecturers,
  statusOpt,
  checkDupName,
  onClose,
  onSave,
}: CourseFormModalProps) => {
  const statusNow = Form.useWatch('status', form) || 'OPEN';
  const descNow = Form.useWatch('description', form) || '';

  const statusList = statusOpt.map((status) => ({
    ...status,
    helper:
      status.value === 'OPEN'
        ? 'Đang chấp nhận đăng ký học viên mới'
        : status.value === 'CLOSED'
        ? 'Khóa học đã kết thúc lượt đăng ký'
        : 'Tạm thời xem xét nội bộ',
  }));

  return (
    <Modal
      destroyOnClose
      visible={open}
      footer={null}
      onCancel={onClose}
      width={860}
      centered
      bodyStyle={{ background: '#f8fafc', padding: 24, borderRadius: 8 }}
      style={{ borderRadius: 8, overflow: 'hidden' }}
      title={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, color: '#1a3353', fontSize: 24, fontWeight: 700 }}>
          {editing ? 'Cập nhật khóa học' : 'Tạo khóa học mới'}
        </Title>
        <Paragraph style={{ marginTop: 6, marginBottom: 0, color: '#64748b', fontSize: 14 }}>
          {editing
            ? 'Chỉnh sửa các thông tin chi tiết bên dưới để cập nhật khóa học.'
            : 'Xác định cấu trúc thông tin cho khóa học mới của bạn.'}
        </Paragraph>
      </div>

      <Form<FormData> form={form} layout="vertical" initialValues={{ status: 'OPEN' }}>
        <Row gutter={20}>
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
                <Form.Item
                  label={<Text strong style={{ fontSize: 13, color: '#475569', letterSpacing: '0.05em' }}>TÊN KHÓA HỌC</Text>}
                  name="name"
                  rules={[
                    { required: true, whitespace: true, message: 'Vui lòng nhập tên khóa học.' },
                    { max: 100, message: 'Tên khóa học tối đa 100 ký tự.' },
                    {
                      validator: (_, value: string) => {
                        if (!value || !value.trim()) {
                          return Promise.resolve();
                        }
                        if (checkDupName(value, editing?.id)) {
                          return Promise.reject(new Error('Tên khóa học đã tồn tại.'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  extra={<div style={{ textAlign: 'right', color: '#98a2b3', fontSize: 12 }}>{nameDraft.trim().length}/100</div>}
                >
                  <Input
                    maxLength={100}
                    placeholder="Ví dụ: Lập trình Web Fullstack"
                    style={{ height: 48, borderRadius: 12, fontSize: 16 }}
                    onChange={(event) => setNameDraft(event.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label={<Text strong style={{ fontSize: 13, color: '#475569', letterSpacing: '0.05em' }}>MÔ TẢ KHÓA HỌC (NHẬP HTML)</Text>}
                  name="description"
                  rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập mô tả.' }]}
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung HTML cho khóa học..."
                    style={{ background: '#fff', borderRadius: 10 }}
                  />
                </Form.Item>
              </Card>

              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 20, color: '#1a3353', fontWeight: 600 }}>
                  Thông tin giảng dạy
                </Title>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<Text strong style={{ fontSize: 13, color: '#475569' }}>GIẢNG VIÊN PHỤ TRÁCH</Text>}
                      name="lecturer"
                      rules={[{ required: true, message: 'Vui lòng chọn giảng viên.' }]}
                    >
                      <Select
                        placeholder="Chọn giảng viên"
                        style={{ width: '100%' }}
                        size="large"
                        options={lecturers.map((lecturer) => ({
                          label: lecturer,
                          value: lecturer,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<Text strong style={{ fontSize: 13, color: '#475569' }}>SỐ LƯỢNG HỌC VIÊN TỐI ĐA</Text>}
                      name="studentCount"
                      rules={[{ required: true, message: 'Vui lòng nhập số học viên.' }]}
                    >
                      <InputNumber min={0} size="large" style={{ width: '100%', borderRadius: 8 }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
                <Text strong style={{ display: 'block', marginBottom: 16, fontSize: 13, color: '#475569' }}>
                  TRẠNG THÁI VẬN HÀNH
                </Text>
                <Form.Item name="status" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {statusList.map((status) => {
                      const active = statusNow === status.value;

                      return (
                        <div
                          key={status.value}
                          onClick={() => form.setFieldsValue({ status: status.value })}
                          style={{
                            padding: '16px',
                            borderRadius: 14,
                            border: active ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                            background: active ? '#eff6ff' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: active ? '5px solid #3b82f6' : '1px solid #cbd5e1',
                              background: '#fff',
                              marginTop: 2,
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: active ? '#1e40af' : '#1e293b' }}>{status.label}</div>
                            <div style={{ fontSize: 12, color: active ? '#60a5fa' : '#64748b', marginTop: 2 }}>
                              {status.helper}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Form.Item>
              </Card>

              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
                <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 13, color: '#475569' }}>
                  XEM NHANH
                </Text>
                <div
                  style={{
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1px solid #eef2f7',
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#172033' }}>
                    {nameDraft.trim() || 'Tên khóa học sẽ hiển thị tại đây'}
                  </div>
                  <div
                    style={{ marginTop: 8, color: '#172033', fontSize: 13, lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{
                      __html: descNow.trim() || '<span style="color:#8c94a6">Mô tả ngắn của khóa học</span>',
                    }}
                  />
                </div>
              </Card>

              <Button
                type="primary"
                onClick={onSave}
                style={{
                  height: 48,
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 15,
                  background: '#003a8c',
                  borderColor: '#003a8c',
                  boxShadow: '0 4px 14px rgba(0, 58, 140, 0.3)',
                }}
                block
              >
                {editing ? 'CẬP NHẬT NGAY' : 'LƯU KHÓA HỌC'}
              </Button>
              <Button
                onClick={onClose}
                style={{
                  height: 48,
                  borderRadius: 6,
                  fontWeight: 600,
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                }}
                block
              >
                Hủy bỏ
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CourseFormModal;
