import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Tag,
    Space,
    Card,
    notification,
    InputNumber,
    Layout,
    Menu,
} from 'antd';
import {
    PlusOutlined,
    ThunderboltOutlined,
    BookOutlined,
    AppstoreOutlined,
    ReadOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Header, Content } = Layout;
const { Option } = Select;

interface Subject {
    id: string;
    name: string;
    credits: number;
}

interface Question {
    id: number;
    subjectId: string;
    content: string;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
    block: string;
}

interface Exam {
    id: string;
    subjectId: string;
    questions: Question[];
    createdAt: string;
}

const BankManagement: React.FC = () => {
    const [tabActive, setTabActive] = useState('1');

    const [danhSachMonHoc, setDanhSachMonHoc] = useState<Subject[]>([
        { id: 'IT01', name: 'Lập trình React', credits: 3 },
    ]);

    const [danhSachKhoiKienThuc, setDanhSachKhoiKienThuc] = useState<string[]>([
        'Tổng quan',
        'Chuyên sâu',
    ]);

    const [danhSachCauHoi, setDanhSachCauHoi] = useState<Question[]>([]);
    const [danhSachDeThi, setDanhSachDeThi] = useState<Exam[]>([]);

    const [showModalMonHoc, setShowModalMonHoc] = useState(false);
    const [showModalKhoi, setShowModalKhoi] = useState(false);
    const [showModalCauHoi, setShowModalCauHoi] = useState(false);
    const [showModalTaoDe, setShowModalTaoDe] = useState(false);

    const [form] = Form.useForm();

    const handleThemMonHoc = (values: Subject) => {
        setDanhSachMonHoc([...danhSachMonHoc, values]);
        setShowModalMonHoc(false);
        form.resetFields();
    };

    const handleThemKhoi = (values: { name: string }) => {
        setDanhSachKhoiKienThuc([...danhSachKhoiKienThuc, values.name]);
        setShowModalKhoi(false);
        form.resetFields();
    };

    const handleThemCauHoi = (values: Question) => {
        setDanhSachCauHoi([...danhSachCauHoi, { ...values, id: Date.now() }]);
        setShowModalCauHoi(false);
        form.resetFields();
    };

    const handleTaoDeThiTuDong = (values: any) => {
        const { monHocId, soCauDe, soCauTrungBinh, soCauKho, soCauRatKho } = values;

        const cauHoiCuaMon = danhSachCauHoi.filter((q) => q.subjectId === monHocId);

        const layNgauNhien = (danhSach: Question[], soLuong: number) =>
            [...danhSach].sort(() => 0.5 - Math.random()).slice(0, soLuong);

        const nhomTheoDoKho = {
            'Dễ': cauHoiCuaMon.filter((q) => q.difficulty === 'Dễ'),
            'Trung bình': cauHoiCuaMon.filter((q) => q.difficulty === 'Trung bình'),
            'Khó': cauHoiCuaMon.filter((q) => q.difficulty === 'Khó'),
            'Rất khó': cauHoiCuaMon.filter((q) => q.difficulty === 'Rất khó'),
        };

        if (
            nhomTheoDoKho['Dễ'].length < soCauDe ||
            nhomTheoDoKho['Trung bình'].length < soCauTrungBinh ||
            nhomTheoDoKho['Khó'].length < soCauKho ||
            nhomTheoDoKho['Rất khó'].length < soCauRatKho
        ) {
            return notification.error({
                message: 'Lỗi',
                description: 'Không đủ câu hỏi trong ngân hàng để tạo đề!',
            });
        }

        const cauHoiDaChon = [
            ...layNgauNhien(nhomTheoDoKho['Dễ'], soCauDe),
            ...layNgauNhien(nhomTheoDoKho['Trung bình'], soCauTrungBinh),
            ...layNgauNhien(nhomTheoDoKho['Khó'], soCauKho),
            ...layNgauNhien(nhomTheoDoKho['Rất khó'], soCauRatKho),
        ];

        setDanhSachDeThi([
            ...danhSachDeThi,
            {
                id: `DE-${Date.now()}`,
                subjectId: monHocId,
                questions: cauHoiDaChon,
                createdAt: new Date().toLocaleString(),
            },
        ]);

        setShowModalTaoDe(false);
        notification.success({ message: 'Tạo đề thi thành công!' });
    };


    const renderTabKhoiKienThuc = () => (
        <Card
            title="Danh mục khối kiến thức"
            extra={
                <Button icon={<PlusOutlined />} onClick={() => setShowModalKhoi(true)}>
                    Thêm khối
                </Button>
            }
        >
            <Table
                dataSource={danhSachKhoiKienThuc.map((ten, index) => ({ key: index, ten }))}
                columns={[{ title: 'Tên khối', dataIndex: 'ten' }]}
                pagination={false}
            />
        </Card>
    );

    const renderTabMonHoc = () => (
        <Card
            title="Danh mục môn học"
            extra={
                <Button icon={<PlusOutlined />} onClick={() => setShowModalMonHoc(true)}>
                    Thêm môn học
                </Button>
            }
        >
            <Table
                dataSource={danhSachMonHoc}
                rowKey="id"
                columns={[
                    { title: 'Mã môn', dataIndex: 'id' },
                    { title: 'Tên môn', dataIndex: 'name' },
                    { title: 'Số tín chỉ', dataIndex: 'credits' },
                ]}
                pagination={false}
            />
        </Card>
    );

    const renderTabNganHangCauHoi = () => (
        <Card
            title="Ngân hàng câu hỏi"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModalCauHoi(true)}>
                    Thêm câu hỏi
                </Button>
            }
        >
            <Table
                dataSource={danhSachCauHoi}
                rowKey="id"
                columns={[
                    { title: 'Nội dung', dataIndex: 'content', ellipsis: true },
                    { title: 'Môn học', dataIndex: 'subjectId' },
                    {
                        title: 'Độ khó',
                        dataIndex: 'difficulty',
                        render: (text) => <Tag color="blue">{text}</Tag>,
                    },
                    { title: 'Khối kiến thức', dataIndex: 'block' },
                ]}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );

    const renderTabDeThi = () => (
        <Card
            title="Quản lý đề thi"
            extra={
                <Button
                    type="primary"
                    danger
                    icon={<ThunderboltOutlined />}
                    onClick={() => setShowModalTaoDe(true)}
                >
                    Tạo đề tự động
                </Button>
            }
        >
            <Table
                dataSource={danhSachDeThi}
                rowKey="id"
                columns={[
                    { title: 'Mã đề', dataIndex: 'id' },
                    { title: 'Môn học', dataIndex: 'subjectId' },
                    { title: 'Số câu', render: (_, record) => record.questions.length },
                    { title: 'Ngày tạo', dataIndex: 'createdAt' },
                ]}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
                <div style={{ color: 'white', fontWeight: 'bold', marginRight: 40 }}>
                    BANK-EXAM SYSTEM
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[tabActive]}
                    onClick={(e) => setTabActive(e.key)}
                    items={[
                        { key: '1', icon: <AppstoreOutlined />, label: 'Khối kiến thức' },
                        { key: '2', icon: <ReadOutlined />, label: 'Môn học' },
                        { key: '3', icon: <BookOutlined />, label: 'Câu hỏi' },
                        { key: '4', icon: <FileTextOutlined />, label: 'Đề thi' },
                    ]}
                />
            </Header>

            <Content style={{ padding: '24px' }}>
                {tabActive === '1' && renderTabKhoiKienThuc()}
                {tabActive === '2' && renderTabMonHoc()}
                {tabActive === '3' && renderTabNganHangCauHoi()}
                {tabActive === '4' && renderTabDeThi()}
            </Content>

            <Modal
                title="Thêm môn học"
                visible={showModalMonHoc}
                onCancel={() => setShowModalMonHoc(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleThemMonHoc} layout="vertical">
                    <Form.Item name="id" label="Mã môn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm khối kiến thức"
                visible={showModalKhoi}
                onCancel={() => setShowModalKhoi(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleThemKhoi} layout="vertical">
                    <Form.Item name="name" label="Tên khối" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm câu hỏi"
                visible={showModalCauHoi}
                onCancel={() => setShowModalCauHoi(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleThemCauHoi} layout="vertical">
                    <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
                        <Select placeholder="Chọn môn học">
                            {danhSachMonHoc.map((mon) => (
                                <Option key={mon.id} value={mon.id}>
                                    {mon.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Dễ">Dễ</Option>
                            <Option value="Trung bình">Trung bình</Option>
                            <Option value="Khó">Khó</Option>
                            <Option value="Rất khó">Rất khó</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="block" label="Khối kiến thức" rules={[{ required: true }]}>
                        <Select placeholder="Chọn khối">
                            {danhSachKhoiKienThuc.map((khoi) => (
                                <Option key={khoi} value={khoi}>
                                    {khoi}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Cấu trúc đề thi tự động"
                visible={showModalTaoDe}
                onCancel={() => setShowModalTaoDe(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleTaoDeThiTuDong} layout="vertical">
                    <Form.Item name="monHocId" label="Môn học" rules={[{ required: true }]}>
                        <Select placeholder="Chọn môn học">
                            {danhSachMonHoc.map((mon) => (
                                <Option key={mon.id} value={mon.id}>
                                    {mon.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Space wrap>
                        <Form.Item name="soCauDe" label="Dễ" initialValue={0}>
                            <InputNumber min={0} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item name="soCauTrungBinh" label="TB" initialValue={0}>
                            <InputNumber min={0} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item name="soCauKho" label="Khó" initialValue={0}>
                            <InputNumber min={0} style={{ width: 80 }} />
                        </Form.Item>
                        <Form.Item name="soCauRatKho" label="Rất khó" initialValue={0}>
                            <InputNumber min={0} style={{ width: 100 }} />
                        </Form.Item>
                    </Space>
                </Form>
            </Modal>
        </Layout>
    );
};

export default BankManagement;