import { useState } from 'react';
import { Tabs, Card } from 'antd';
import BookManager from './BookManagement';
import FieldConfig from './FieldConfig';
import DiplomaEntry from './DiplomaEntry';
import DiplomaSearch from './DiplomaSearch';
import DecisionManagement from './DecisionManagement';
import { BookItem, DecisionItem, DiplomaItem, FieldItem } from './types';

const DiplomaSystem = () => {
  const [bookList, setBookList] = useState<BookItem[]>([{ id: 1, year: 2024, title: 'Sổ năm 2024', lastIndex: 0 }]);
  const [fieldList, setFieldList] = useState<FieldItem[]>([
    { id: 1, name: 'Dân tộc', type: 'String' },
    { id: 2, name: 'Điểm trung bình', type: 'Number' }
  ]);
  const [decisionList, setDecisionList] = useState<DecisionItem[]>([]);
  const [diplomaList, setDiplomaList] = useState<DiplomaItem[]>([]);

  return (
    <Card title="Hệ thống Quản lý Văn bằng">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Cấu hình Biểu mẫu" key="1">
          <FieldConfig fields={fieldList} setFields={setFieldList} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản lý Sổ" key="2">
          <BookManager books={bookList} setBooks={setBookList} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quyết định tốt nghiệp" key="3">
          <DecisionManagement books={bookList} decisions={decisionList} setDecisions={setDecisionList} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Nhập Văn bằng" key="4">
          <DiplomaEntry 
            fields={fieldList} 
            books={bookList} 
            decisions={decisionList}
            diplomas={diplomaList}
            setBooks={setBookList}
            setDiplomas={setDiplomaList} 
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tra cứu" key="5">
          <DiplomaSearch diplomas={diplomaList} books={bookList} decisions={decisionList} setDecisions={setDecisionList} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default DiplomaSystem;