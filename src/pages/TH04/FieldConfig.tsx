import type { Dispatch, SetStateAction } from 'react';
import { Table, Button, Form, Input, Select, Popconfirm, Space, message } from 'antd';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { FieldItem, FieldType } from './types';

interface FieldFormValues {
  fieldName: string;
  dataType: FieldType;
}

interface FieldConfigProps {
  fields: FieldItem[];
  setFields: Dispatch<SetStateAction<FieldItem[]>>;
}

const FieldConfig = ({ fields, setFields }: FieldConfigProps) => {
  const [createFieldForm] = Form.useForm();
  const [updateFieldForm] = Form.useForm();
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  const handleAddField = (formData: FieldFormValues) => {
    const hasDuplicateName = fields.some(
      (fieldRow) => fieldRow.name.trim().toLowerCase() === formData.fieldName.trim().toLowerCase(),
    );
    if (hasDuplicateName) {
      message.error('Tên trường đã tồn tại.');
      return;
    }

    const fieldToCreate = {
      id: Date.now(),
      name: formData.fieldName.trim(),
      type: formData.dataType,
    };
    setFields([...fields, fieldToCreate]);
    createFieldForm.resetFields();
  };

  const handleDeleteField = (fieldId: number) => {
    setFields(fields.filter((fieldRow) => fieldRow.id !== fieldId));
  };

  const beginEditField = (fieldRow: FieldItem): void => {
    setEditingFieldId(fieldRow.id);
    updateFieldForm.setFieldsValue({
      fieldName: fieldRow.name,
      dataType: fieldRow.type,
    });
  };

  const handleSaveField = (formData: FieldFormValues): void => {
    if (editingFieldId === null) {
      return;
    }

    const hasDuplicateName = fields.some(
      (fieldRow) =>
        fieldRow.id !== editingFieldId &&
        fieldRow.name.trim().toLowerCase() === formData.fieldName.trim().toLowerCase(),
    );
    if (hasDuplicateName) {
      message.error('Tên trường đã tồn tại.');
      return;
    }

    setFields((currentList) =>
      currentList.map((fieldRow) =>
        fieldRow.id === editingFieldId
          ? {
              ...fieldRow,
              name: formData.fieldName.trim(),
              type: formData.dataType,
            }
          : fieldRow,
      ),
    );

    setEditingFieldId(null);
    updateFieldForm.resetFields();
  };

  const columns: ColumnsType<FieldItem> = [
    { title: 'Tên trường', dataIndex: 'name' },
    { title: 'Kiểu dữ liệu', dataIndex: 'type' },
    {
      title: 'Hành động',
      render: (_: unknown, record: FieldItem) => (
        <Space>
          <Button size="small" onClick={() => beginEditField(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa trường này?" onConfirm={() => handleDeleteField(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={createFieldForm} layout="inline" onFinish={handleAddField} style={{ marginBottom: 20 }}>
        <Form.Item name="fieldName" rules={[{ required: true, message: 'Nhập tên trường' }]}>
          <Input placeholder="Tên trường (VD: Nơi sinh)" />
        </Form.Item>
        <Form.Item name="dataType" initialValue="String">
          <Select style={{ width: 120 }}>
            <Select.Option value="String">Chữ (String)</Select.Option>
            <Select.Option value="Number">Số (Number)</Select.Option>
            <Select.Option value="Date">Ngày (Date)</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">Thêm trường</Button>
      </Form>

      {editingFieldId !== null && (
        <Form form={updateFieldForm} layout="inline" onFinish={handleSaveField} style={{ marginBottom: 20 }}>
          <Form.Item name="fieldName" rules={[{ required: true, message: 'Nhập tên trường' }]}>
            <Input placeholder="Tên trường" />
          </Form.Item>
          <Form.Item name="dataType" rules={[{ required: true }]}>
            <Select style={{ width: 120 }}>
              <Select.Option value="String">Chữ (String)</Select.Option>
              <Select.Option value="Number">Số (Number)</Select.Option>
              <Select.Option value="Date">Ngày (Date)</Select.Option>
            </Select>
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button
              onClick={() => {
                setEditingFieldId(null);
                updateFieldForm.resetFields();
              }}
            >
              Hủy
            </Button>
          </Space>
        </Form>
      )}

      <Table<FieldItem>
        dataSource={fields}
        rowKey="id"
        columns={columns}
      />
    </div>
  );
};

export default FieldConfig;