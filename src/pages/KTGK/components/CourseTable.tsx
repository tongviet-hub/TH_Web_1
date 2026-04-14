import type { ColumnsType } from 'antd/es/table';
import { Avatar, Button, Card, Col, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { CourseItem, CourseStatus } from '@/models/courseModel';

const { Search } = Input;
const { Text } = Typography;

type CourseTableProps = {
  list: CourseItem[];
  lecturers: string[];
  statusOpt: { label: string; value: CourseStatus }[];
  statusMap: Record<CourseStatus, string>;
  searchText: string;
  setSearchText: (value: string) => void;
  gvFilter?: string;
  setGvFilter: (value: string | undefined) => void;
  stFilter?: CourseStatus;
  setStFilter: (value: CourseStatus | undefined) => void;
  onAdd: () => void;
  onView: (course: CourseItem) => void;
  onEdit: (course: CourseItem) => void;
  onRemove: (course: CourseItem) => void;
};

const CourseTable = ({
  list,
  lecturers,
  statusOpt,
  statusMap,
  setSearchText,
  setGvFilter,
  setStFilter,
  onAdd,
  onView,
  onEdit,
  onRemove,
}: CourseTableProps) => {
  const cols: ColumnsType<CourseItem> = [
    {
      title: 'ID khóa học',
      dataIndex: 'id',
      width: 120,
      render: (value: number) => <Text type="secondary">#{value}</Text>,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      render: (value: string, record) => (
        <div>
          <Text strong style={{ color: '#172033', fontSize: 14 }}>
            {value}
          </Text>
          <div style={{ marginTop: 4, color: '#8c94a6', fontSize: 12 }}>
            Mã khóa học: KH-{record.id.toString().padStart(4, '0')}
          </div>
        </div>
      ),
    },
    {
      title: 'Giảng viên',
      dataIndex: 'lecturer',
      width: 220,
      render: (value: string) => (
        <Space size={10}>
          <Avatar
            style={{
              background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {value
              .split(' ')
              .slice(-2)
              .map((item) => item.charAt(0).toUpperCase())
              .join('')}
          </Avatar>
          <Text style={{ color: '#172033' }}>{value}</Text>
        </Space>
      ),
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      width: 180,
      sorter: (a, b) => a.studentCount - b.studentCount,
      defaultSortOrder: 'descend',
      render: (value: number) => (
        <div>
          <Text strong style={{ color: '#172033' }}>
            {value.toLocaleString()}
          </Text>
          <div
            style={{
              marginTop: 6,
              width: 56,
              height: 4,
              borderRadius: 999,
              background: '#e8f1ff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.max(18, Math.min(100, (value / 40) * 100))}%`,
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #1677ff 0%, #69b1ff 100%)',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 160,
      render: (value: CourseStatus) => {
        const label = statusOpt.find((s) => s.value === value)?.label ?? value;

        return (
          <Tag color={statusMap[value]} style={{ borderRadius: 999, paddingInline: 10, fontWeight: 500 }}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 170,
      render: (_, record) => (
        <Space size={6}>
          <Button type="link" icon={<EyeOutlined />} onClick={() => onView(record)}>
            Chi tiết
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            disabled={record.studentCount > 0}
            onClick={() => onRemove(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        background: '#ffffff',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{
            borderRadius: 6,
            background: '#003a8c',
            borderColor: '#003a8c',
            color: '#ffffff',
            height: 38,
            padding: '0 20px',
            fontWeight: 600,
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
          }}
        >
          Thêm khóa học mới
        </Button>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Search
            allowClear
            placeholder="Tìm theo tên khóa học..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            onChange={(event) => setSearchText(event.target.value)}
            onSearch={(value) => setSearchText(value)}
            style={{ borderRadius: 8, height: 40 }}
            size="middle"
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            placeholder="Lọc theo giảng viên"
            style={{ width: '100%', borderRadius: 8 }}
            size="middle"
            options={lecturers.map((lecturer) => ({
              label: lecturer,
              value: lecturer,
            }))}
            onChange={(value) => setGvFilter(value)}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: '100%', borderRadius: 8 }}
            size="middle"
            options={statusOpt}
            onChange={(value) => setStFilter(value)}
          />
        </Col>
      </Row>

      <Table<CourseItem>
        rowKey="id"
        columns={cols}
        dataSource={list}
        bordered={false}
        pagination={{
          pageSize: 5,
          showTotal: (total, range) => (
            <span style={{ color: '#8c94a6' }}>
              Hiển thị <b>{range[0]}-{range[1]}</b> trên tổng số <b>{total}</b> khóa học
            </span>
          ),
          position: ['bottomRight'],
        }}
      />
    </Card>
  );
};

export default CourseTable;
