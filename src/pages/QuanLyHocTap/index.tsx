import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Typography, Row, Col, InputNumber, notification, Progress } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const App = () => {
    const [subjects, setSubjects] = useState<string[]>(() => {
        const saved = localStorage.getItem('subjects');

        return saved ? JSON.parse(saved) : ['Toán', 'Văn', 'Anh'];
    });

    const [logs, setLogs] = useState<any[]>(() => {
        const saved = localStorage.getItem('logs');

        return saved ? JSON.parse(saved) : [];
    });
    const [monthlyGoal, setMonthlyGoal] = useState<number>(() => {
        const saved = localStorage.getItem('monthlyGoal');

        return saved ? Number(saved) : 0;

    });
    const [subjectGoals, setSubjectGoals] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem('subjectGoals');
        return saved ? JSON.parse(saved) : {};
    });

    const [newSubject, setNewSubject] = useState('');

    const [newLog, setNewLog] = useState({ subject: 'Toán', date: '', duration: 0, content: '' });
    const [editingLogId, setEditingLogId] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('subjects', JSON.stringify(subjects));
        localStorage.setItem('logs', JSON.stringify(logs));
        localStorage.setItem('subjectGoals', JSON.stringify(subjectGoals));
    }, [subjects, logs, subjectGoals]);

    const handleAddSubject = () => {
        if (!newSubject) return;
        if (!subjects.includes(newSubject)) {
            setSubjects([...subjects, newSubject]);
            notification.success({ message: 'Đã thêm môn học!' });
        }
        setNewSubject('');
    };

    const handleDeleteSubject = (subjectToDelete: string) => {
        setSubjects(subjects.filter((s) => s !== subjectToDelete));
        const newGoals = { ...subjectGoals };
        delete newGoals[subjectToDelete];
        setSubjectGoals(newGoals);
    };

    const handleSaveLog = () => {
        if (!newLog.date || !newLog.duration) return notification.error({ message: 'Vui lòng nhập đủ thông tin (Ngày, Thời lượng)!' });

        if (editingLogId) {
            setLogs(logs.map(log => log.id === editingLogId ? { ...newLog, id: editingLogId } : log));
            notification.success({ message: 'Đã cập nhật nhật ký!' });
            setEditingLogId(null);
        } else {
            setLogs([...logs, { ...newLog, id: Date.now() }]);
            notification.success({ message: 'Đã thêm nhật ký!' });
        }
        setNewLog({ ...newLog, duration: 0, content: '' });
    };

    const handleEditLog = (record: any) => {
        setNewLog({ subject: record.subject, date: record.date, duration: record.duration, content: record.content });
        setEditingLogId(record.id);
    };

    const handleCancelEdit = () => {
        setEditingLogId(null);
        setNewLog({ subject: subjects[0] || '', date: '', duration: 0, content: '' });
    };

    const handleSubjectGoalChange = (subject: string, value: number | null) => {
        setSubjectGoals({ ...subjectGoals, [subject]: value || 0 });
    };

    const columns = [
        { title: 'Môn', dataIndex: 'subject', key: 'subject' },
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration' },
        { title: 'Nội dung', dataIndex: 'content', key: 'content' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEditLog(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => setLogs(logs.filter(l => l.id !== record.id))} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '40px', background: '#f0f2f5', minHeight: '10vh' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Quản Lý Học Tập</Title>

            <Row gutter={[20, 20]}>
                <Col xs={24} md={8}>
                    <Card title="Danh mục môn học" style={{ height: "40%" }}>
                        { }
                        <div style={{ display: "flex", gap: 8, marginBottom: 15 }}>
                            <Input
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                placeholder="Tên môn mới..."
                                onPressEnter={handleAddSubject}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddSubject}
                            >
                                Thêm
                            </Button>
                        </div>

                        { }
                        <div>
                            {subjects.length === 0 ? (
                                <Text type="secondary">Chưa có môn học nào</Text>
                            ) : (
                                subjects.map((subject) => (
                                    <Tag
                                        key={subject}
                                        color="blue"
                                        closable
                                        onClose={() => handleDeleteSubject(subject)}
                                        style={{ marginBottom: 8 }}
                                    >
                                        {subject}
                                    </Tag>
                                ))
                            )}
                        </div>
                    </Card>
                    { }
                    <Card title="Danh mục môn học & Mục tiêu" style={{ height: '100%' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: 15 }}>
                            <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Tên môn mới..." onPressEnter={handleAddSubject} />
                            <Button type="primary" onClick={handleAddSubject} icon={<PlusOutlined />}>Thêm</Button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {subjects.map((subject) => {
                                const subjectLogs = logs.filter(l => l.subject === subject);
                                const currentDuration = subjectLogs.reduce((sum, log) => sum + Number(log.duration), 0);
                                const goal = subjectGoals[subject] || 0;
                                const percent = goal > 0 ? Math.min(Math.round((currentDuration / goal) * 100), 100) : 0;

                                return (
                                    <Card size="small" type="inner" title={<Tag closable onClose={() => handleDeleteSubject(subject)} color="blue">{subject}</Tag>} style={{ marginBottom: '15px' }} key={subject}>
                                        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text>Mục tiêu (phút):</Text>
                                            <InputNumber
                                                min={0}
                                                value={goal}
                                                onChange={(val) => handleSubjectGoalChange(subject, val)}
                                            />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <Text type="secondary">Tiến độ:</Text>
                                                <Text strong>{currentDuration} / {goal > 0 ? goal : '?'} phút</Text>
                                            </div>
                                            <Progress percent={percent} status={currentDuration >= goal && goal > 0 ? "success" : "normal"} />
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Nhật ký học tập">
                        <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d9d9d9' }}>
                            <Title level={5} style={{ marginTop: 0 }}>{editingLogId ? 'Sửa nhật ký' : 'Thêm nhật ký mới'}</Title>
                            <Row gutter={[10, 10]} align="middle">
                                <Col xs={24} sm={12} md={6}>
                                    <Select
                                        value={newLog.subject}
                                        style={{ width: '100%' }}
                                        onChange={v => setNewLog({ ...newLog, subject: v })}
                                        options={subjects.map(s => ({ label: s, value: s }))}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Input type="date" value={newLog.date} onChange={e => setNewLog({ ...newLog, date: e.target.value })} style={{ width: '100%' }} />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <InputNumber value={newLog.duration} onChange={v => setNewLog({ ...newLog, duration: v ?? 0 })} addonAfter="phút" style={{ width: '100%' }} />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Input value={newLog.content} onChange={e => setNewLog({ ...newLog, content: e.target.value })} placeholder="Nội dung bài học" style={{ width: '100%' }} />
                                </Col>
                                <Col xs={24}>
                                    <Space>
                                        <Button type="primary" onClick={handleSaveLog}>
                                            {editingLogId ? 'Cập nhật' : 'Lưu'}
                                        </Button>
                                        {editingLogId && (
                                            <Button onClick={handleCancelEdit}>Hủy</Button>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        </div>
                        <Table dataSource={logs} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default App;