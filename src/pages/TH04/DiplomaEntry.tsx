import type { Dispatch, SetStateAction } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Select, message } from 'antd';
import { useEffect, useMemo } from 'react';
import { BookItem, DecisionItem, DiplomaItem, DynamicFieldValue, FieldItem } from './types';

interface DiplomaFormValues {
  bookId: number;
  decisionId: number;
  serialNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: { format: (formatText: string) => string };
  [key: string]: unknown;
}

interface DiplomaEntryProps {
  fields: FieldItem[];
  books: BookItem[];
  decisions: DecisionItem[];
  diplomas: DiplomaItem[];
  setBooks: Dispatch<SetStateAction<BookItem[]>>;
  setDiplomas: Dispatch<SetStateAction<DiplomaItem[]>>;
}

const DiplomaEntry = ({ fields, books, decisions, diplomas, setBooks, setDiplomas }: DiplomaEntryProps) => {
  const [diplomaForm] = Form.useForm();
  const activeBookId: number | undefined = Form.useWatch('bookId', diplomaForm);

  const getDynamicFieldInputId = (fieldId: number): string => `diploma_dynamic_${fieldId}`;

  const renderDynamicControl = (field: FieldItem) => {
    const inputId = getDynamicFieldInputId(field.id);
    if (field.type === 'Number') {
      return <InputNumber id={inputId} name={inputId} style={{ width: '100%' }} />;
    }
    if (field.type === 'Date') {
      return <DatePicker id={inputId} style={{ width: '100%' }} format="DD/MM/YYYY" />;
    }
    return <Input id={inputId} name={inputId} />;
  };

  const activeBook = useMemo(() => books.find((book) => book.id === activeBookId), [books, activeBookId]);
  const upcomingBookNumber = useMemo(() => {
    if (!activeBook) {
      return '';
    }
    return `${activeBook.year}-${activeBook.lastIndex + 1}`;
  }, [activeBook]);

  useEffect(() => {
    diplomaForm.setFieldsValue({ bookNumberPreview: upcomingBookNumber });
  }, [diplomaForm, upcomingBookNumber]);

  const availableDecisionOptions = useMemo(
    () =>
      decisions
        .filter((decision) => (activeBookId ? decision.bookId === activeBookId : true))
        .map((decision) => ({
          label: `${decision.decisionNumber} - ${decision.issuedDate}`,
          value: decision.id,
        })),
    [decisions, activeBookId],
  );

  const handleSubmitDiploma = (formData: DiplomaFormValues): void => {
    const selectedBook = books.find((book) => book.id === formData.bookId);
    if (!selectedBook) {
      message.error('Không tìm thấy sổ văn bằng.');
      return;
    }

    const selectedDecision = decisions.find((decision) => decision.id === formData.decisionId);
    if (!selectedDecision) {
      message.error('Không tìm thấy quyết định tốt nghiệp.');
      return;
    }

    if (selectedDecision.bookId !== formData.bookId) {
      message.error('Quyết định không thuộc sổ văn bằng đã chọn.');
      return;
    }

    const serialExists = diplomas.some(
      (diploma) => diploma.serialNumber.trim().toLowerCase() === formData.serialNumber.trim().toLowerCase(),
    );
    if (serialExists) {
      message.error('Số hiệu văn bằng đã tồn tại.');
      return;
    }

    const nextIndex = selectedBook.lastIndex + 1;
    const generatedBookNumber = `${selectedBook.year}-${nextIndex}`;
    const normalizedDynamicData = fields.reduce<Record<string, DynamicFieldValue>>((result, field) => {
      const rawInput = formData[`dynamic_${field.id}`];
      if (field.type === 'Date' && rawInput && typeof rawInput === 'object' && 'format' in rawInput) {
        result[field.name] = (rawInput as { format: (formatText: string) => string }).format('YYYY-MM-DD');
      } else if (field.type === 'Number') {
        result[field.name] = typeof rawInput === 'number' ? rawInput : null;
      } else {
        result[field.name] = typeof rawInput === 'string' ? rawInput.trim() : null;
      }
      return result;
    }, {});

    const diplomaToCreate: DiplomaItem = {
      id: Date.now(),
      bookId: formData.bookId,
      decisionId: formData.decisionId,
      bookNumber: generatedBookNumber,
      serialNumber: formData.serialNumber.trim(),
      studentId: formData.studentId.trim(),
      fullName: formData.fullName.trim(),
      dateOfBirth: formData.dateOfBirth.format('YYYY-MM-DD'),
      dynamicData: normalizedDynamicData,
    };

    const bookListAfterIssue = books.map((bookRow) =>
      bookRow.id === formData.bookId ? { ...bookRow, lastIndex: nextIndex } : bookRow
    );
    
    setBooks(bookListAfterIssue);
    setDiplomas((currentList) => [...currentList, diplomaToCreate]);
    message.success(`Đã cấp văn bằng. Số vào sổ: ${diplomaToCreate.bookNumber}`);
    diplomaForm.resetFields();
  };

  return (
    <Form form={diplomaForm} layout="vertical" onFinish={handleSubmitDiploma}>
      <Form.Item
        name="bookId"
        label="Sổ văn bằng"
        htmlFor="diploma_bookId"
        rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}
      >
        <Select
          id="diploma_bookId"
          options={books.map((book) => ({ label: `${book.title} (${book.year})`, value: book.id }))}
        />
      </Form.Item>

      <Form.Item
        name="decisionId"
        label="Quyết định tốt nghiệp"
        htmlFor="diploma_decisionId"
        rules={[{ required: true, message: 'Chọn quyết định tốt nghiệp' }]}
      >
        <Select
          id="diploma_decisionId"
          options={availableDecisionOptions}
          placeholder="Chọn quyết định theo sổ"
          disabled={!activeBookId}
        />
      </Form.Item>

      <Form.Item name="bookNumberPreview" label="Số vào sổ (tự động)">
        <Input
          id="diploma_bookNumberPreview"
          name="bookNumberPreview"
          readOnly
          placeholder="Chọn sổ để tự động sinh số vào sổ"
        />
      </Form.Item>

      <Form.Item
        name="serialNumber"
        label="Số hiệu văn bằng"
        htmlFor="diploma_serialNumber"
        rules={[{ required: true, message: 'Nhập số hiệu văn bằng' }]}
      >
        <Input id="diploma_serialNumber" name="serialNumber" placeholder="VD: VB-2026-0001" />
      </Form.Item>
      
      <Form.Item
        name="studentId"
        label="Mã sinh viên"
        htmlFor="diploma_studentId"
        rules={[{ required: true, message: 'Nhập mã sinh viên' }]}
      >
        <Input id="diploma_studentId" name="studentId" />
      </Form.Item>
      <Form.Item
        name="fullName"
        label="Họ tên"
        htmlFor="diploma_fullName"
        rules={[{ required: true, message: 'Nhập họ tên' }]}
      >
        <Input id="diploma_fullName" name="fullName" />
      </Form.Item>
      <Form.Item
        name="dateOfBirth"
        label="Ngày sinh"
        htmlFor="diploma_dateOfBirth"
        rules={[{ required: true, message: 'Chọn ngày sinh' }]}
      >
        <DatePicker id="diploma_dateOfBirth" style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      {fields.map((field) => (
        <Form.Item
          key={field.id}
          name={`dynamic_${field.id}`}
          label={field.name}
          htmlFor={getDynamicFieldInputId(field.id)}
          rules={[{ required: true, message: `Nhập ${field.name}` }]}
        >
          {renderDynamicControl(field)}
        </Form.Item>
      ))}

      <Button type="primary" htmlType="submit" disabled={books.length === 0 || decisions.length === 0}>
        Lưu văn bằng
      </Button>
    </Form>
  );
};

export default DiplomaEntry;