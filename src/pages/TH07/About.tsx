import React from 'react';
import { Card, Avatar, Typography, Row, Col, Tag, Space, Divider, List, Timeline } from 'antd';
import { 
  GithubOutlined, 
  LinkedinOutlined, 
  TwitterOutlined, 
  MailOutlined,
  BookOutlined,
  CodeOutlined,
  RocketOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  const info = {
    name: 'Nguyễn Văn A',
    pos: 'Fullstack Developer & Tech Blogger',
    img: '/maid_avatar.png',
    bio: 'Chào mọi người! Mình là A, một lập trình viên có niềm đam mê mãnh liệt với việc xây dựng các ứng dụng web tối ưu và chia sẻ kiến thức công nghệ đến cộng đồng. Với kinh nghiệm làm việc qua nhiều dự án lớn nhỏ, mình luôn tìm kiếm sự cân bằng giữa tính thẩm mỹ và hiệu năng trong từng dòng code.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Ant Design', 'Next.js'],
    links: [
      { icon: <GithubOutlined />, url: 'https://github.com', tip: 'GitHub' },
      { icon: <LinkedinOutlined />, url: 'https://linkedin.com', tip: 'LinkedIn' },
      { icon: <TwitterOutlined />, url: 'https://twitter.com', tip: 'Twitter' },
      { icon: <MailOutlined />, url: 'mailto:contact@example.com', tip: 'Email' },
    ]
  };

  const edu = [
    { year: '2019 - 2023', school: 'Đại học Bách Khoa', major: 'Công nghệ thông tin' },
    { year: '2023 - Nay', school: 'Khóa học AWS Certified', major: 'Solutions Architect' },
  ];

  const projs = [
    { name: 'Ecommerce Platform', desc: 'Hệ thống bán hàng trực tuyến với hơn 10k users.', tech: 'NestJS, React' },
    { name: 'Task Management', desc: 'Ứng dụng quản lý công việc nhóm thời gian thực.', tech: 'Socket.io, Redux' },
    { name: 'Travel Planner', desc: 'Công cụ lên kế hoạch du lịch thông minh.', tech: 'React, Google Maps API' },
  ];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: '20px', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              textAlign: 'center',
              position: 'sticky',
              top: '24px'
            }}
          >
            <Avatar 
              size={160} 
              src={info.img} 
              style={{ 
                border: '4px solid #1890ff', 
                backgroundColor: '#f0f2f5',
                marginBottom: '20px'
              }} 
            />
            <Title level={2} style={{ marginBottom: '4px' }}>{info.name}</Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>{info.pos}</Text>
            
            <Space size="large" style={{ marginBottom: '24px' }}>
              {info.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: '24px', color: '#1890ff' }}>
                  {l.icon}
                </a>
              ))}
            </Space>

            <Divider />

            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong><MailOutlined /> Email</Text>
                <div style={{ color: '#595959' }}>contact@example.com</div>
              </div>
              <div>
                <Text strong><CodeOutlined /> Location</Text>
                <div style={{ color: '#595959' }}>Hanoi, Vietnam</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <section style={{ marginBottom: '40px' }}>
            <Title level={3}><RocketOutlined /> Giới thiệu</Title>
            <Paragraph style={{ fontSize: '17px', lineHeight: '1.8', color: '#434343' }}>
              {info.bio}
            </Paragraph>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <Title level={3}><CodeOutlined /> Kỹ năng chuyên môn</Title>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              {info.tags.map(t => (
                <Tag 
                  key={t} 
                  color="blue" 
                  style={{ fontSize: '14px', marginBottom: '12px', padding: '6px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#e6f7ff', color: '#1890ff' }}
                >
                  {t}
                </Tag>
              ))}
            </div>
          </section>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <section>
                <Title level={3}><BookOutlined /> Học vấn</Title>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Timeline mode="left">
                    {edu.map((e, idx) => (
                      <Timeline.Item key={idx} label={e.year}>
                        <Text strong style={{ display: 'block' }}>{e.school}</Text>
                        <Text type="secondary">{e.major}</Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </section>
            </Col>

            <Col xs={24} md={12}>
              <section>
                <Title level={3}><HeartOutlined /> Sở thích</Title>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <List
                    split={false}
                    dataSource={['Đọc sách công nghệ', 'Du lịch khám phá', 'Chơi Guitar', 'Chụp ảnh đường phố']}
                    renderItem={item => (
                      <List.Item style={{ padding: '8px 0' }}>
                        <Text><Tag color="orange" style={{ borderRadius: '50%', width: '8px', height: '8px', padding: 0, border: 'none', marginRight: '10px' }} /> {item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              </section>
            </Col>
          </Row>

          <section style={{ marginTop: '40px' }}>
            <Title level={3}><RocketOutlined /> Dự án nổi bật</Title>
            <Row gutter={[16, 16]}>
              {projs.map((p, i) => (
                <Col xs={24} sm={12} key={i}>
                  <Card 
                    hoverable 
                    style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Title level={5}>{p.name}</Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }}>{p.desc}</Paragraph>
                    <Tag color="purple">{p.tech}</Tag>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default About;
