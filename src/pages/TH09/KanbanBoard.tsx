import { AppstoreOutlined, DeleteOutlined, EditOutlined, PlusOutlined, PullRequestOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import TaskFormModal from './components/TaskFormModal';
import { BOARD_STATUSES, PRIORITY_COLOR, PRIORITY_LABEL, STATUS_LABEL } from './constants';
import type { TaskFormPayload, TaskItem, TaskStatus } from './types';
import './style.less';

const KanbanBoard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useModel('th09');
  const [visible, setVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | undefined>();

  const byStatus = useMemo(() => {
    return BOARD_STATUSES.reduce((acc, status) => {
      acc[status] = tasks
        .filter((t) => t.status === status)
        .sort((a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf());
      return acc;
    }, {} as Record<TaskStatus, TaskItem[]>);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const newStatus = result.destination?.droppableId as TaskStatus | undefined;
    if (!newStatus || !result.draggableId) return;

    const item = tasks.find((t) => t.id === result.draggableId);
    if (!item || item.status === newStatus) return;

    moveTask(result.draggableId, newStatus);
  };

  const handleSubmit = (values: TaskFormPayload) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setVisible(false);
    setEditingTask(undefined);
  };

  return (
    <div className='th09-page th09-kanban'>
      <img src='/th09-hero.svg' alt='Kanban Hero' className='th09-hero' />

      <Row justify='space-between' align='middle' className='th09-title-row'>
        <Col>
          <div className='th09-title-wrap'>
            <AppstoreOutlined className='th09-title-icon' />
            <Typography.Title level={3} className='th09-title'>
              Kanban Board
            </Typography.Title>
          </div>
          <Typography.Text className='th09-subtitle'>
            Kéo thả task giữa các cột để cập nhật trạng thái công việc.
          </Typography.Text>
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTask(undefined);
              setVisible(true);
            }}
          >
            Thêm task
          </Button>
        </Col>
      </Row>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]}>
          {BOARD_STATUSES.map((status) => (
            <Col xs={24} md={8} key={status}>
              <Card
                className='th09-board-column'
                title={
                  <Space>
                    <PullRequestOutlined />
                    <span>{`${STATUS_LABEL[status]} (${byStatus[status].length})`}</span>
                  </Space>
                }
              >
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className='th09-drop-zone'>
                      {byStatus[status].length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                      {byStatus[status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(dragProvided) => (
                            <Card
                              size='small'
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className='th09-task-card'
                              title={task.title}
                              extra={
                                <Space>
                                  <EditOutlined
                                    onClick={() => {
                                      setEditingTask(task);
                                      setVisible(true);
                                    }}
                                  />
                                  <Popconfirm
                                    title='Bạn có chắc muốn xóa task này?'
                                    onConfirm={() => deleteTask(task.id)}
                                  >
                                    <DeleteOutlined />
                                  </Popconfirm>
                                </Space>
                              }
                            >
                              <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                                {task.description || 'Không có mô tả'}
                              </Typography.Paragraph>
                              <div style={{ marginBottom: 8 }}>
                                <Tag color={PRIORITY_COLOR[task.priority]}>{PRIORITY_LABEL[task.priority]}</Tag>
                                {task.tags.map((tag) => (
                                  <Tag key={tag}>{tag}</Tag>
                                ))}
                              </div>
                              <Typography.Text type='secondary'>
                                Deadline: {moment(task.deadline).format('DD/MM/YYYY')}
                              </Typography.Text>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <TaskFormModal
        visible={visible}
        editingTask={editingTask}
        onCancel={() => {
          setVisible(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default KanbanBoard;
