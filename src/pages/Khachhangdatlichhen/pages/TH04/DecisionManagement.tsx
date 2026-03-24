import type { Dispatch, SetStateAction } from 'react';
import { Button, Form, Input, Select, Space, Table, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BookItem, DecisionItem } from './types';

interface DecisionFormValues {
  decisionNumber: string;
  issuedDate: { format: (formatText: string) => string };
  excerpt: string;
  bookId: number;
}

interface DecisionManagementProps {
  books: BookItem[];
  decisions: DecisionItem[];
  setDecisions: Dispatch<SetStateAction<DecisionItem[]>>;
}

const DecisionManagement = ({ books, decisions, setDecisions }: DecisionManagementProps) => {
  const [decisionForm] = Form.useForm();

  const handleCreateDecision = (formData: DecisionFormValues): void => {
    const hasDuplicateDecision = decisions.find(
      (decisionRow) => decisionRow.decisionNumber.trim() === formData.decisionNumber.trim(),
    );
    if (hasDuplicateDecision) {
      message.error('Số quyết định đã tồn tại.');
      return;
    }

    const decisionToCreate: DecisionItem = {
      id: Date.now(),
      decisionNumber: formData.decisionNumber.trim(),
      issuedDate: formData.issuedDate.format('YYYY-MM-DD'),
      excerpt: formData.excerpt.trim(),
      bookId: formData.bookId,
      lookupCount: 0,
    };

    setDecisions((currentList) => [...currentList, decisionToCreate]);
    decisionForm.resetFields();
    message.success('Đã thêm quyết định tốt nghiệp.');
  };

  const handleRemoveDecision = (decisionId: number): void => {
    setDecisions((currentList) => currentList.filter((decisionRow) => decisionRow.id !== decisionId));
  };

  const columns: ColumnsType<DecisionItem> = [
    { title: 'Số QĐ', dataIndex: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'issuedDate' },
    { title: 'Trích yếu', dataIndex: 'excerpt' },
    {
      title: 'Sổ văn bằng',
      render: (_, row) => books.find((book) => book.id === row.bookId)?.title || `Sổ ${row.bookId}`,
    },
    { title: 'Lượt tra cứu', dataIndex: 'lookupCount' },
    {
      title: 'Hành động',
      render: (_, row) => (
        <Button danger size="small" onClick={() => handleRemoveDecision(row.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Form form={decisionForm} layout="vertical" onFinish={handleCreateDecision}>
        <Space align="start" wrap>
          <Form.Item
            name="decisionNumber"
            label="Số quyết định"
            rules={[{ required: true, message: 'Nhập số quyết định' }]}
          >
            <Input placeholder="VD: 15/QD-DH" />
          </Form.Item>
          <Form.Item
            name="issuedDate"
            label="Ngày ban hành"
            rules={[{ required: true, message: 'Chọn ngày ban hành' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="bookId"
            label="Sổ văn bằng"
            rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}
          >
            <Select
              style={{ width: 220 }}
              options={books.map((book) => ({ label: `${book.title} (${book.year})`, value: book.id }))}
            />
          </Form.Item>
          <Form.Item
            name="excerpt"
            label="Trích yếu"
            rules={[{ required: true, message: 'Nhập trích yếu' }]}
          >
            <Input style={{ width: 320 }} placeholder="Ví dụ: Công nhận tốt nghiệp đợt tháng 6" />
          </Form.Item>
          <Form.Item label=" ">
            <Button type="primary" htmlType="submit" disabled={books.length === 0}>
              Thêm quyết định
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <Table<DecisionItem>
        rowKey="id"
        dataSource={decisions}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default DecisionManagement;
