import { Form, Modal, message } from 'antd';
import type { CourseItem, CourseStatus } from '@/models/courseModel';
import { useModel } from 'umi';
import 'react-quill/dist/quill.snow.css';
import CourseTable from './components/CourseTable';
import CourseFormModal from './components/CourseFormModal';
import CourseDetailModal from './components/CourseDetailModal';
import { useState } from 'react';

type FormData = Omit<CourseItem, 'id'>;

const statusMap: Record<CourseStatus, string> = {
  OPEN: 'green',
  CLOSED: 'default',
  PAUSED: 'orange',
};

const DanhSachKhoaHoc = () => {
  const [form] = Form.useForm<FormData>();
  const {
    courses,
    lecturers,
    statusOptions,
    addCourse,
    updateCourse,
    removeCourse,
    isCourseNameDuplicated,
  } = useModel('courseModel' as any) as {
    courses: CourseItem[];
    lecturers: string[];
    statusOptions: { label: string; value: CourseStatus }[];
    addCourse: (payload: FormData) => void;
    updateCourse: (id: number, payload: FormData) => void;
    removeCourse: (id: number) => void;
    isCourseNameDuplicated: (name: string, editingId?: number) => boolean;
  };

  const [searchText, setSearchText] = useState('');
  const [gvFilter, setGvFilter] = useState<string | undefined>();
  const [stFilter, setStFilter] = useState<CourseStatus | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [courseEdit, setCourseEdit] = useState<CourseItem | null>(null);
  const [courseView, setCourseView] = useState<CourseItem | null>(null);
  const [nameDraft, setNameDraft] = useState('');

  const q = searchText.trim().toLowerCase();
  const listShow = courses.filter((c) => {
    if (gvFilter && c.lecturer !== gvFilter) return false;
    if (stFilter && c.status !== stFilter) return false;
    if (!q) return true;
    return `${c.name || ''}`.toLowerCase().includes(q);
  });

  const normalizeForm = (raw: FormData): FormData => {
    const next = { ...raw };
    next.name = `${next.name || ''}`.trim();
    next.description = `${next.description || ''}`.trim();

    if (!next.description) {
      next.description = '<p></p>';
    }

    return next;
  };

  const onAddClick = () => {
    setCourseEdit(null);
    setNameDraft('');
    form.resetFields();
    form.setFieldsValue({
      studentCount: 0,
      status: 'OPEN',
      description: '<p></p>',
    });
    setShowForm(true);
  };

  const onEditClick = (course: CourseItem) => {
    setCourseEdit(course);
    setNameDraft(course.name);
    form.setFieldsValue(course);
    setShowForm(true);
  };

  const onViewClick = (course: CourseItem) => {
    setCourseView(course);
  };

  const closeForm = () => {
    setShowForm(false);
    setCourseEdit(null);
    setNameDraft('');
    form.resetFields();
  };

  const closeView = () => {
    setCourseView(null);
  };

  const saveForm = async (): Promise<void> => {
    try {
      const raw = await form.validateFields();
      const payload = normalizeForm(raw as FormData);
      const editId = courseEdit?.id;

      if (!payload.name) {
        message.warning('Tên khóa học không hợp lệ.');
        return;
      }

      if (editId) {
        updateCourse(editId, payload);
        message.success('Cập nhật khóa học thành công.');
      } else {
        addCourse(payload);
        message.success('Thêm mới khóa học thành công.');
      }

      closeForm();
    } catch {
      return;
    }
  };

  const onDeleteClick = (course: CourseItem) => {
    const hasStudent = course.studentCount > 0;
    if (hasStudent) {
      message.warning('Chỉ được xóa khóa học chưa có học viên.');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa khóa học',
      content: `Bạn có chắc muốn xóa khóa học "${course.name}" không?`,
      okText: 'Xóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: () => {
        removeCourse(course.id);
        message.success('Xóa khóa học thành công.');
      },
    });
  };

  return (
    <div>
      <CourseTable
        list={listShow}
        lecturers={lecturers}
        statusOpt={statusOptions}
        statusMap={statusMap}
        searchText={searchText}
        setSearchText={setSearchText}
        gvFilter={gvFilter}
        setGvFilter={setGvFilter}
        stFilter={stFilter}
        setStFilter={setStFilter}
        onAdd={onAddClick}
        onView={onViewClick}
        onEdit={onEditClick}
        onRemove={onDeleteClick}
      />

      <CourseFormModal
        open={showForm}
        form={form}
        editing={courseEdit}
        nameDraft={nameDraft}
        setNameDraft={setNameDraft}
        lecturers={lecturers}
        statusOpt={statusOptions}
        checkDupName={isCourseNameDuplicated}
        onClose={closeForm}
        onSave={saveForm}
      />

      <CourseDetailModal
        item={courseView}
        statusOpt={statusOptions}
        statusMap={statusMap}
        onCancel={closeView}
      />

      <style>{`
        .ql-toolbar.ql-snow {
          border: 1px solid #d9e2ec;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .ql-container.ql-snow {
          border: 1px solid #d9e2ec;
          border-top: 0;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          min-height: 220px;
        }

        .ql-editor {
          min-height: 220px;
          font-size: 15px;
          color: #172033;
        }
      `}</style>
    </div>
  );
};

export default DanhSachKhoaHoc;
