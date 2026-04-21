import React, { useState, useMemo } from 'react';
import { Card, Col, Row, Input, Tag, Space, Pagination, Typography, Empty } from 'antd';
import { useModel, history } from 'umi';
import debounce from 'lodash/debounce';

const { Meta } = Card;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const Home: React.FC = () => {
  const { posts } = useModel('blogModel');
  const [kw, setKw] = useState('');
  const [selTag, setSelTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const activePosts = useMemo(() => 
    posts.filter(p => p.status === 'Published'), 
  [posts]);

  const onSearch = useMemo(
    () => debounce((v: string) => {
      setKw(v);
      setPage(1);
    }, 300),
    []
  );

  React.useEffect(() => {
    return () => {
      onSearch.cancel();
    };
  }, [onSearch]);

  const filtered = useMemo(() => {
    return activePosts.filter((p) => {
      const matchKW = p.title.toLowerCase().includes(kw.toLowerCase()) ||
                      p.summary.toLowerCase().includes(kw.toLowerCase());
      const matchTag = selTag ? p.tags.includes(selTag) : true;
      return matchKW && matchTag;
    });
  }, [activePosts, kw, selTag]);

  const list = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    activePosts.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set);
  }, [activePosts]);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={2}>Khám Phá Bài Viết</Title>
        <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: '600px' }}>
          <Search
            placeholder="Tìm kiếm bài viết..."
            allowClear
            enterButton="Tìm"
            size="large"
            onChange={(e) => onSearch(e.target.value)}
          />
          <div style={{ marginTop: '12px' }}>
            <Text strong style={{ marginRight: '8px' }}>Thẻ:</Text>
            <Tag
              color={selTag === null ? 'blue' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => { setSelTag(null); setPage(1); }}
            >
              Tất cả
            </Tag>
            {tags.map(t => (
              <Tag
                key={t}
                color={selTag === t ? 'blue' : 'default'}
                style={{ cursor: 'pointer' }}
                onClick={() => { setSelTag(t); setPage(1); }}
              >
                {t}
              </Tag>
            ))}
          </div>
        </Space>
      </div>

      {list.length > 0 ? (
        <>
          <Row gutter={[24, 24]}>
            {list.map((p) => (
              <Col xs={24} sm={12} md={8} key={p.id}>
                <Card
                  hoverable
                  cover={<img alt={p.title} src={p.thumbnail} style={{ height: '200px', objectFit: 'cover' }} />}
                  onClick={() => history.push(`/TH07/post/${p.id}`)}
                >
                  <Meta
                    title={<Title level={4} style={{ marginBottom: 0 }}>{p.title}</Title>}
                    description={
                      <Space direction="vertical" size={1}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {p.author} • {p.date}
                        </Text>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0' }}>
                          {p.summary}
                        </Paragraph>
                        <div>
                          {p.tags.map(t => (
                            <Tag key={t} color="cyan">{t}</Tag>
                          ))}
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Pagination
              current={page}
              total={filtered.length}
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty description="Trống" />
      )}
    </div>
  );
};

export default Home;
