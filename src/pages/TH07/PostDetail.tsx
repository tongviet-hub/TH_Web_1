import React, { useEffect, useMemo } from 'react';
import { Typography, Tag, Divider, Row, Col, Card, Button, Space, Breadcrumb } from 'antd';
import { useParams, useModel, history } from 'umi';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MD: React.FC<{ content: string }> = ({ content }) => {
  const html = content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n/g, '<br />');

  return (
    <div 
      className="md-body"
      dangerouslySetInnerHTML={{ __html: html }} 
      style={{ fontSize: '16px', lineHeight: '1.8' }}
    />
  );
};

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, upView } = useModel('blogModel');

  const item = posts.find(p => p.id === Number(id));

  useEffect(() => {
    if (item) upView(item.id);
  }, [id]);

  const rel = useMemo(() => {
    if (!item) return [];
    return posts.filter(p => p.id !== item.id && p.status === 'Published' && p.tags.some(t => item.tags.includes(t))).slice(0, 3);
  }, [item, posts]);

  if (!item) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Title level={3}>Không tìm thấy</Title>
        <Button onClick={() => history.push('/TH07/home')}>Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item onClick={() => history.push('/TH07/home')}>
          <span style={{ cursor: 'pointer' }}>Blog</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{item.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/TH07/home')} style={{ marginBottom: '24px' }}>
        Quay lại
      </Button>

      <Card bordered={false}>
        <Title>{item.title}</Title>
        
        <Space split={<Divider type="vertical" />} style={{ marginBottom: '24px' }}>
          <Text type="secondary"><UserOutlined /> {item.author}</Text>
          <Text type="secondary"><CalendarOutlined /> {item.date}</Text>
          <Text type="secondary"><EyeOutlined /> {item.viewCount + 1} xem</Text>
        </Space>

        <div style={{ marginBottom: '24px' }}>
          {item.tags.map(t => (
            <Tag key={t} color="blue">{t}</Tag>
          ))}
        </div>

        <img src={item.thumbnail} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '32px' }} />

        <Divider />
        <MD content={item.content} />
      </Card>

      {rel.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <Title level={3}>Liên quan</Title>
          <Row gutter={[24, 24]}>
            {rel.map((p) => (
              <Col xs={24} sm={8} key={p.id}>
                <Card
                  hoverable
                  cover={<img alt={p.title} src={p.thumbnail} style={{ height: '150px', objectFit: 'cover' }} />}
                  onClick={() => history.push(`/TH07/post/${p.id}`)}
                >
                  <Card.Meta title={p.title} description={<Text type="secondary" style={{ fontSize: '12px' }}>{p.date}</Text>} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
