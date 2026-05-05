import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import type { TaskFormPayload, TaskItem } from '../types';
import { PRIORITY_LABEL } from '../constants';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: TaskFormPayload) => void;
  editingTask?: TaskItem;
};

const TAG_SUGGESTIONS = ['Học tập', 'Báo cáo', 'Urgent', 'Cá nhân', 'Team'];

const TaskFormModal: React.FC<Props> = ({ visible, onCancel, onSubmit, editingTask }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={editingTask ? 'Chỉnh sửa task' : 'Thêm task mới'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          title: editingTask?.title,
          description: editingTask?.description,
          deadline: editingTask?.deadline ? moment(editingTask.deadline) : undefined,
          priority: editingTask?.priority || 'MEDIUM',
          tags: editingTask?.tags || [],
        }}
        onFinish={(values) => {
          onSubmit({
            title: values.title,
            description: values.description,
            deadline: values.deadline.toISOString(),
            priority: values.priority,
            tags: values.tags || [],
          });
          form.resetFields();
        }}
      >
        <Form.Item
          label='Tên task'
          name='title'
          rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
        >
          <Input placeholder='Nhập tên task...' />
        </Form.Item>

        <Form.Item label='Mô tả' name='description'>
          <Input.TextArea rows={3} placeholder='Mô tả ngắn cho task' />
        </Form.Item>

        <Form.Item
          label='Deadline'
          name='deadline'
          rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item
          label='Mức độ ưu tiên'
          name='priority'
          rules={[{ required: true, message: 'Vui lòng chọn mức ưu tiên' }]}
        >
          <Select>
            {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='Tag (gõ rồi nhấn Enter)'
          name='tags'
          extra='Bạn có thể nhập tag mới hoặc chọn từ danh sách gợi ý.'
        >
          <Select
            mode='tags'
            tokenSeparators={[',']}
            placeholder='Ví dụ: học tập, urgent'
            maxTagCount='responsive'
          >
            {[...TAG_SUGGESTIONS, ...(editingTask?.tags || [])].map((tag) => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type='primary' htmlType='submit' block>
          {editingTask ? 'Cập nhật task' : 'Tạo task'}
        </Button>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
