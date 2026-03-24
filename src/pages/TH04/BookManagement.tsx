import type { Dispatch, SetStateAction } from 'react';
import { Table, Button, Form, Input, InputNumber, message } from 'antd';
import { BookItem } from './types';

interface BookFormValues {
  year: number;
  title: string;
}

interface BookManagerProps {
  books: BookItem[];
  setBooks: Dispatch<SetStateAction<BookItem[]>>;
}

const BookManager = ({ books, setBooks }: BookManagerProps) => {
  const [bookForm] = Form.useForm();

  const handleCreateBook = (formData: BookFormValues): void => {
    if (books.find((book) => book.year === formData.year)) {
      message.error('Sổ cho năm này đã tồn tại!');
      return;
    }

    const bookToCreate = {
      id: Date.now(),
      year: formData.year,
      title: formData.title,
      lastIndex: 0,
    };

    setBooks([...books, bookToCreate]);
    message.success(`Đã mở sổ văn bằng năm ${formData.year}`);
    bookForm.resetFields();
  };

  return (
    <div>
      <h3>Mở sổ văn bằng mới</h3>
      <Form form={bookForm} layout="inline" onFinish={handleCreateBook} style={{ marginBottom: 20 }}>
        <Form.Item name="year" rules={[{ required: true }]}><InputNumber placeholder="Năm (VD: 2026)" /></Form.Item>
        <Form.Item name="title" rules={[{ required: true }]}><Input placeholder="Tên sổ" /></Form.Item>
        <Button type="primary" htmlType="submit">Tạo sổ mới</Button>
      </Form>

      <Table 
        dataSource={books} 
        rowKey="id"
        columns={[
          { title: 'Năm', dataIndex: 'year' },
          { title: 'Tên sổ', dataIndex: 'title' },
          { title: 'Số lượng đã cấp', dataIndex: 'lastIndex' },
          { 
            title: 'Trạng thái', 
            render: () => <span style={{ color: 'green' }}>Đang sử dụng</span> 
          }
        ]} 
      />
    </div>
  );
};

export default BookManager;