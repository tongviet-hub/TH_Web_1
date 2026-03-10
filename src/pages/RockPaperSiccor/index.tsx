import { useState } from 'react';
import { Card, Typography, Space, Row, Col, Tag, Divider } from 'antd';

const { Title, Text } = Typography;

function App() {
    const [nguoichoi, setNguoiChoi] = useState<string>('');
    const [maytinh, setMayTinh] = useState<string>('');
    const [ketqua, setKetQua] = useState<string>('');

    function taoKQ(nc: string, mt: string) {
        if (nc === mt) return 'Hoà';
        if (
            (nc === 'Kéo' && mt === 'Giấy') ||
            (nc === 'Búa' && mt === 'Kéo') ||
            (nc === 'Giấy' && mt === 'Búa')
        ) return 'Thắng';
        return 'Thua';
    }

    function choiGame(choice: string) {
        const options = ['Kéo', 'Búa', 'Giấy'];
        const computerChoice = options[Math.floor(Math.random() * 3)];
        setNguoiChoi(choice);
        setMayTinh(computerChoice);
        setKetQua(taoKQ(choice, computerChoice));
    }

    const getEmoji = (choice: string) => {
        switch (choice) {
            case 'Kéo': return '✌️';
            case 'Búa': return '✊';
            case 'Giấy': return '✋';
            default: return '❓';
        }
    };

    const getColor = (kq: string) => {
        if (kq === 'Thắng') return 'success';
        if (kq === 'Thua') return 'error';
        return 'processing';
    };

    const btnBase: React.CSSProperties = {
        width: 80,
        height: 80,
        fontSize: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2a2a2a',
        border: '2px solid #3d3d3d',
        color: '#fff',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 560,
                    borderRadius: 20,
                    background: '#1c1c1c',
                    border: '1px solid #2e2e2e',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
                }}
                bodyStyle={{ textAlign: 'center', padding: '40px 32px' }}
                bordered={false}
            >
                <Title level={2} style={{ marginBottom: 4, color: '#60a5fa', letterSpacing: 2 }}>
                    ✊ Oẳn Tù Tì ✌️
                </Title>
                <Text style={{ fontSize: 15, color: '#666' }}>
                    Thử thách nhân phẩm với máy tính!
                </Text>

                <Divider style={{ borderColor: '#2e2e2e', margin: '24px 0' }} />

                <Space size="large" style={{ marginBottom: 32 }}>
                    {[
                        { label: '✊', choice: 'Búa' },
                        { label: '✋', choice: 'Giấy' },
                        { label: '✌️', choice: 'Kéo' },
                    ].map(({ label, choice }) => (
                        <button
                            key={choice}
                            onClick={() => choiGame(choice)}
                            title={choice}
                            style={btnBase}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLButtonElement;
                                el.style.background = '#3b82f6';
                                el.style.borderColor = '#3b82f6';
                                el.style.transform = 'scale(1.14)';
                                el.style.boxShadow = '0 8px 24px rgba(59,130,246,0.5)';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLButtonElement;
                                el.style.background = '#2a2a2a';
                                el.style.borderColor = '#3d3d3d';
                                el.style.transform = 'scale(1)';
                                el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5)';
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </Space>

                {ketqua && (
                    <div style={{
                        background: '#141414',
                        border: '1px solid #2e2e2e',
                        padding: 28,
                        borderRadius: 16,
                    }}>
                        <Row gutter={16} align="middle" justify="center">
                            <Col span={8}>
                                <Text style={{ color: '#888', fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>BẠN</Text>
                                <div style={{ fontSize: 52, margin: '12px 0' }}>{getEmoji(nguoichoi)}</div>
                                <Tag color="blue" style={{ fontSize: 13, padding: '3px 12px', borderRadius: 20 }}>{nguoichoi}</Tag>
                            </Col>
                            <Col span={8}>
                                <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444', fontStyle: 'italic', textShadow: '0 0 12px rgba(239,68,68,0.5)' }}>VS</div>
                            </Col>
                            <Col span={8}>
                                <Text style={{ color: '#888', fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>MÁY TÍNH</Text>
                                <div style={{ fontSize: 52, margin: '12px 0' }}>{getEmoji(maytinh)}</div>
                                <Tag color="purple" style={{ fontSize: 13, padding: '3px 12px', borderRadius: 20 }}>{maytinh}</Tag>
                            </Col>
                        </Row>

                        <div style={{ marginTop: 28 }}>
                            <Tag
                                color={getColor(ketqua)}
                                style={{ fontSize: 22, padding: '8px 36px', borderRadius: 999, fontWeight: 'bold', letterSpacing: 1 }}
                            >
                                {ketqua === 'Hoà' ? '🤝 HOÀ NHAU!' : ketqua === 'Thắng' ? '🎉 BẠN THẮNG!' : '😢 BẠN THUA!'}
                            </Tag>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default App;
