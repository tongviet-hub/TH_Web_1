import { Card, Descriptions, Modal, Space, Tag, Typography } from 'antd';
import type { CourseItem, CourseStatus } from '@/models/courseModel';

const { Text } = Typography;

type CourseDetailModalProps = {
  item: CourseItem | null;
  statusOpt: { label: string; value: CourseStatus }[];
  statusMap: Record<CourseStatus, string>;
  onCancel: () => void;
};

const CourseDetailModal = ({ item, statusOpt, statusMap, onCancel }: CourseDetailModalProps) => {
  return (
    <Modal
      visible={!!item}
      onCancel={onCancel}
      footer={null}
      width={760}
      centered
      title="Chi tiết khóa học"
      bodyStyle={{ background: '#f8fafc', padding: 20, borderRadius: 8 }}
      style={{ borderRadius: 8, overflow: 'hidden' }}
    >
      {item && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
            <Descriptions column={1} size="small" labelStyle={{ color: '#64748b', fontWeight: 600 }}>
              <Descriptions.Item label="Tên khóa học">{item.name}</Descriptions.Item>
              <Descriptions.Item label="Mã khóa học">KH-{item.id.toString().padStart(4, '0')}</Descriptions.Item>
              <Descriptions.Item label="Giảng viên">{item.lecturer}</Descriptions.Item>
              <Descriptions.Item label="Số lượng học viên">{item.studentCount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusMap[item.status]} style={{ borderRadius: 999, paddingInline: 10, fontWeight: 500 }}>
                  {statusOpt.find((status) => status.value === item.status)?.label ?? item.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 20 }}>
            <Text strong style={{ display: 'block', marginBottom: 12, color: '#475569' }}>
              Mô tả khóa học
            </Text>
            <div
              style={{
                background: '#fff',
                border: '1px solid #eef2f7',
                borderRadius: 10,
                padding: 14,
                color: '#172033',
                lineHeight: 1.7,
              }}
              dangerouslySetInnerHTML={{ __html: item.description || '<p></p>' }}
            />
          </Card>
        </Space>
      )}
    </Modal>
  );
};

export default CourseDetailModal;
