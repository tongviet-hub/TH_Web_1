import { Form, Input, Button, Table, message } from 'antd';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { BookItem, DecisionItem, DiplomaItem } from './types';

interface DiplomaSearchResult extends DiplomaItem {
  decisionNumber: string;
  issuedDate: string;
  excerpt: string;
  bookTitle: string;
}

interface DiplomaSearchProps {
  diplomas: DiplomaItem[];
  books: BookItem[];
  decisions: DecisionItem[];
  setDecisions: Dispatch<SetStateAction<DecisionItem[]>>;
}

interface SearchValues {
  serialNumber?: string;
  bookNumber?: string;
  studentId?: string;
  fullName?: string;
  dateOfBirth?: string;
}

const DiplomaSearch = ({ diplomas, books, decisions, setDecisions }: DiplomaSearchProps) => {
  const [searchResults, setSearchResults] = useState<DiplomaSearchResult[]>([]);

  const handleSearchDiploma = (searchForm: SearchValues): void => {
    const filledCriteria = (Object.keys(searchForm) as (keyof SearchValues)[]).filter((key) => searchForm[key]);
    if (filledCriteria.length < 2) {
      message.warning('Yêu cầu nhập ít nhất 2 tham số tra cứu!');
      return;
    }

    const normalizedCriteria = {
      serialNumber: searchForm.serialNumber?.trim().toLowerCase() || '',
      bookNumber: searchForm.bookNumber?.trim().toLowerCase() || '',
      studentId: searchForm.studentId?.trim().toLowerCase() || '',
      fullName: searchForm.fullName?.trim().toLowerCase() || '',
      dateOfBirth: searchForm.dateOfBirth?.trim().toLowerCase() || '',
    };

    const matchedDiplomas = diplomas.filter((diploma) => {
      const matchMap: Record<keyof SearchValues, boolean> = {
        serialNumber: diploma.serialNumber.toLowerCase().includes(normalizedCriteria.serialNumber),
        bookNumber: diploma.bookNumber.toLowerCase().includes(normalizedCriteria.bookNumber),
        studentId: diploma.studentId.toLowerCase().includes(normalizedCriteria.studentId),
        fullName: diploma.fullName.toLowerCase().includes(normalizedCriteria.fullName),
        dateOfBirth: diploma.dateOfBirth.toLowerCase().includes(normalizedCriteria.dateOfBirth),
      };
      return filledCriteria.every((fieldKey) => matchMap[fieldKey]);
    });

    const matchedDecisionIds = new Set(matchedDiplomas.map((diploma) => diploma.decisionId));
    if (matchedDecisionIds.size > 0) {
      setDecisions((currentList) =>
        currentList.map((decision) =>
          matchedDecisionIds.has(decision.id)
            ? { ...decision, lookupCount: decision.lookupCount + 1 }
            : decision,
        ),
      );
    }

    const viewRows = matchedDiplomas.map((diploma) => {
      const linkedDecision = decisions.find((decision) => decision.id === diploma.decisionId);
      const linkedBook = books.find((book) => book.id === diploma.bookId);
      return {
        ...diploma,
        decisionNumber: linkedDecision?.decisionNumber || '',
        issuedDate: linkedDecision?.issuedDate || '',
        excerpt: linkedDecision?.excerpt || '',
        bookTitle: linkedBook?.title || '',
      };
    });

    message.success(`Tìm thấy ${viewRows.length} văn bằng phù hợp.`);
    setSearchResults(viewRows);
  };

  const columns: ColumnsType<DiplomaSearchResult> = [
    { title: 'Số hiệu văn bằng', dataIndex: 'serialNumber' },
    { title: 'Số vào sổ', dataIndex: 'bookNumber' },
    { title: 'MSV', dataIndex: 'studentId' },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'dateOfBirth' },
    { title: 'Số QĐ', dataIndex: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'issuedDate' },
  ];

  const renderDetailRow = (row: DiplomaSearchResult) => {
    const dynamicFieldRows = Object.entries(row.dynamicData || {});
    return (
      <div style={{ paddingLeft: 8 }}>
        <p>
          <strong>Sổ văn bằng:</strong> {row.bookTitle}
        </p>
        <p>
          <strong>Trích yếu quyết định:</strong> {row.excerpt}
        </p>
        {dynamicFieldRows.length > 0 && (
          <div>
            <strong>Thông tin mở rộng:</strong>
            <ul style={{ marginTop: 8 }}>
              {dynamicFieldRows.map(([key, value]) => (
                <li key={key}>
                  {key}: {value === null ? '-' : String(value)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Form layout="inline" onFinish={handleSearchDiploma} style={{ marginBottom: 20 }}>
        <Form.Item name="serialNumber"><Input placeholder="Số hiệu văn bằng" /></Form.Item>
        <Form.Item name="bookNumber"><Input placeholder="Số vào sổ" /></Form.Item>
        <Form.Item name="studentId"><Input placeholder="Mã sinh viên" /></Form.Item>
        <Form.Item name="fullName"><Input placeholder="Họ tên" /></Form.Item>
        <Form.Item name="dateOfBirth"><Input placeholder="Ngày sinh (YYYY-MM-DD)" /></Form.Item>
        <Button type="primary" htmlType="submit">Tra cứu</Button>
      </Form>
      <Table<DiplomaSearchResult>
        rowKey="id"
        dataSource={searchResults}
        columns={columns}
        expandable={{ expandedRowRender: renderDetailRow }}
      />
    </div>
  );
};

export default DiplomaSearch;