import { useState, useMemo } from 'react';

export type ArticleStatus = 'Draft' | 'Published';

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  thumbnail: string;
  author: string;
  date: string;
  tags: string[];
  viewCount: number;
  status: ArticleStatus;
}

export interface Tag {
  name: string;
}

const INIT_POSTS: Article[] = [
  {
    id: 1,
    title: 'Học React cho người mới bắt đầu',
    slug: 'hoc-react-cho-nguoi-moi',
    content: `
# Chào mừng đến với React
React là một thư viện JavaScript để xây dựng giao diện người dùng.
- **Dễ học**: Nếu bạn biết JS, bạn có thể học React.
- **Component-based**: Xây dựng UI từ các mảnh nhỏ.
- **Phổ biến**: Cộng đồng lớn mạnh.
`,
    summary: 'Hướng dẫn cơ bản về React nâng cao kiến thức lập trình frontend của bạn.',
    thumbnail: 'https://img.freepik.com/free-vector/react-concept-illustration_114360-3855.jpg',
    author: 'Nguyễn Văn A',
    date: '2024-04-20',
    tags: ['React', 'Frontend', 'JavaScript'],
    viewCount: 120,
    status: 'Published',
  },
  {
    id: 2,
    title: 'Làm chủ TypeScript trong 30 ngày',
    slug: 'ts-30-ngay',
    content: `
# Tại sao nên dùng TypeScript?
TypeScript giúp bạn bắt lỗi ngay khi code.
1. Khai báo kiểu dữ liệu.
2. Interface và Type.
3. Generics.
`,
    summary: 'Lộ trình học TypeScript từ con số 0 đến nâng cao cực kỳ hiệu quả.',
    thumbnail: 'https://img.freepik.com/free-vector/hand-drawn-web-development-concept_23-2148810373.jpg',
    author: 'Trần Thị B',
    date: '2024-04-18',
    tags: ['TypeScript', 'Programming'],
    viewCount: 85,
    status: 'Published',
  },
  {
    id: 3,
    title: 'Thiết kế UI/UX với Ant Design',
    slug: 'antd-design-tips',
    content: `
# Ant Design Tips
Sử dụng các component có sẵn để đẩy nhanh tiến độ dự án.
- Grid system.
- Form validation.
- Theme customization.
`,
    summary: 'Cách tạo ra giao diện đẹp và chuyên nghiệp với Ant Design trong nháy mắt.',
    thumbnail: 'https://img.freepik.com/free-vector/ui-ux-design-consept-illustration_114360-345.jpg',
    author: 'Lê Văn C',
    date: '2024-04-15',
    tags: ['Ant Design', 'UI/UX', 'CSS'],
    viewCount: 200,
    status: 'Published',
  },
];

const INIT_TAGS: Tag[] = [
  { name: 'React' }, { name: 'Frontend' }, { name: 'JavaScript' },
  { name: 'TypeScript' }, { name: 'Programming' }, { name: 'Ant Design' },
  { name: 'UI/UX' }, { name: 'CSS' }, { name: 'Performance' }, { name: 'Web' },
];

export default function useBlog() {
  const [posts, setPosts] = useState<Article[]>(INIT_POSTS);
  const [tags, setTags] = useState<Tag[]>(INIT_TAGS);

  const addPost = (data: Omit<Article, 'id' | 'viewCount' | 'date'>) => {
    const newItem: Article = {
      ...data,
      id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
      viewCount: 0,
      date: new Date().toISOString().split('T')[0],
    };
    setPosts([...posts, newItem]);
  };

  const editPost = (id: number, val: Partial<Article>) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...val } : p)));
  };

  const delPost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const upView = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p))
    );
  };

  const addTag = (name: string) => {
    if (!tags.some((t) => t.name === name)) setTags([...tags, { name }]);
  };

  const editTag = (oldName: string, newName: string) => {
    setTags(tags.map((t) => (t.name === oldName ? { name: newName } : t)));
    setPosts(posts.map((p) => ({
      ...p,
      tags: p.tags.map((tag) => (tag === oldName ? newName : tag)),
    })));
  };

  const delTag = (name: string) => {
    setTags(tags.filter((t) => t.name !== name));
    setPosts(posts.map((p) => ({
      ...p,
      tags: p.tags.filter((tag) => tag !== name),
    })));
  };

  const tagList = useMemo(() => {
    return tags.map((t) => ({
      ...t,
      count: posts.filter((p) => p.tags.includes(t.name)).length,
    }));
  }, [tags, posts]);

  return {
    posts,
    tags: tagList,
    addPost,
    editPost,
    delPost,
    upView,
    addTag,
    editTag,
    delTag,
  };
}
