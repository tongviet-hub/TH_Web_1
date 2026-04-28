import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Empty, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Tag } from 'antd';
import { useModel } from 'umi';
import { DIFFICULTY_OPTIONS, MUSCLE_GROUP_OPTIONS } from './constants';

type ExerciseRow = {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  caloriesPerHour?: number;
};

type ExerciseFormValues = {
  name: string;
  muscleGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  caloriesPerHour?: number;
};

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const difficultyColorMap = {
  Easy: 'green',
  Medium: 'gold',
  Hard: 'red',
} as const;

const Exercises: React.FC = () => {
  const { exercises, addExercise, updateExercise, deleteExercise } = useModel('th08');
  const [searchText, setSearchText] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState<string | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRow | null>(null);
  const [form] = Form.useForm<ExerciseFormValues>();

  const openEditor = (exercise?: ExerciseRow) => {
    setSelectedExercise(exercise ?? null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedExercise(null);
  };

  const filtered = useMemo(() => exercises.filter(e => {
    const matchKW = e.name.toLowerCase().includes(searchText.toLowerCase());
    const matchMuscle = muscleFilter ? e.muscleGroup === muscleFilter : true;
    const matchDiff = difficultyFilter ? e.difficulty === difficultyFilter : true;
    return matchKW && matchMuscle && matchDiff;
  }), [difficultyFilter, exercises, muscleFilter, searchText]);

  useEffect(() => {
    if (!isEditorOpen) return;

    form.setFieldsValue(
      selectedExercise
        ? {
            name: selectedExercise.name,
            muscleGroup: selectedExercise.muscleGroup,
            difficulty: selectedExercise.difficulty,
            description: selectedExercise.description,
            caloriesPerHour: selectedExercise.caloriesPerHour,
          }
        : {
            name: '',
            muscleGroup: MUSCLE_GROUP_OPTIONS[0],
            difficulty: 'Easy',
          },
    );
  }, [form, isEditorOpen, selectedExercise]);

  const handleSubmit = (values: ExerciseFormValues) => {
    const payload = {
      id: selectedExercise?.id || createId(),
      ...values,
    };

    if (selectedExercise) {
      updateExercise(payload);
    } else {
      addExercise(payload);
    }

    closeEditor();
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <Input.Search placeholder="Tìm bài tập" onSearch={(value) => setSearchText(value)} style={{ width: 240, marginRight: 8 }} allowClear />
        <Select placeholder="Nhóm cơ" style={{ width: 160, marginRight: 8 }} allowClear value={muscleFilter} onChange={(value) => setMuscleFilter(value)}>
          {MUSCLE_GROUP_OPTIONS.map((group) => (
            <Select.Option key={group} value={group}>
              {group}
            </Select.Option>
          ))}
        </Select>
        <Select placeholder="Mức độ" style={{ width: 140, marginRight: 8 }} allowClear value={difficultyFilter} onChange={(value) => setDifficultyFilter(value)}>
          {DIFFICULTY_OPTIONS.map((level) => (
            <Select.Option key={level} value={level}>
              {level === 'Easy' ? 'Dễ' : level === 'Medium' ? 'Trung bình' : 'Khó'}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={() => openEditor()}>Thêm bài tập</Button>
      </div>

      {filtered.length ? (
        <Row gutter={[16, 16]}>
          {filtered.map((exercise: ExerciseRow) => (
            <Col xs={24} sm={12} md={8} key={exercise.id}>
              <Card
                hoverable
                actions={[
                  <span key="edit" onClick={() => openEditor(exercise)}>Sửa</span>,
                  <Popconfirm key="delete" title="Xóa bài tập?" onConfirm={() => deleteExercise(exercise.id)}>
                    <span>Xóa</span>
                  </Popconfirm>,
                ]}
                onClick={() => openEditor(exercise)}
              >
                <Card.Meta
                  title={exercise.name}
                  description={
                    <div>
                      <div>Nhóm cơ: {exercise.muscleGroup}</div>
                      <div>
                        Mức độ: <Tag color={difficultyColorMap[exercise.difficulty]}>{exercise.difficulty}</Tag>
                      </div>
                      <div>{exercise.description}</div>
                      <div>Calo/giờ: {exercise.caloriesPerHour || '-'}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Không có bài tập" />
      )}

      <Modal title={selectedExercise ? 'Sửa bài tập' : 'Thêm bài tập'} visible={isEditorOpen} onCancel={closeEditor} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
            <Select>
              {MUSCLE_GROUP_OPTIONS.map((group) => (
                <Select.Option key={group} value={group}>
                  {group}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}>
            <Select>
              {DIFFICULTY_OPTIONS.map((level) => (
                <Select.Option key={level} value={level}>
                  {level === 'Easy' ? 'Dễ' : level === 'Medium' ? 'Trung bình' : 'Khó'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="caloriesPerHour" label="Calo/giờ">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={closeEditor}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Exercises;
