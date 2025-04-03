import React, { useState, useMemo } from 'react';
import { Modal, List, Button, Select, Tag, message } from 'antd';
import { DeThiChiTiet } from '@/models/DeThi/deThi';
import { QuestionData, DifficultyLevel } from '@/services/CauHoi';
import { loadLocalStorage as loadQuestions } from '@/models/cauhoi/cauHoi';
import styles from './DeThiDetail.less';

const { Option } = Select;

interface DeThiDetailProps {
  deThi: DeThiChiTiet | null;
  visible: boolean;
  onCancel: () => void;
  onSave: (deThi: DeThiChiTiet) => void;
}

const DeThiDetail: React.FC<DeThiDetailProps> = ({
  deThi,
  visible,
  onCancel,
  onSave,
}) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number>(-1);
  const allQuestions = loadQuestions();

  const availableQuestions = useMemo(() => {
    if (!deThi) return [];
    return allQuestions.filter(
      q => q.monHocId === deThi.monHocId && 
           q.khoiKienThucId === deThi.khoiKienThucId &&
           q.difficulty === (editingQuestionIndex >= 0 ? deThi.questions[editingQuestionIndex].difficulty : undefined)
    );
  }, [deThi, editingQuestionIndex, allQuestions]);

  const handleChangeQuestion = (questionId: string) => {
    if (!deThi || editingQuestionIndex === -1) return;

    const newQuestion = availableQuestions.find(q => q.id === questionId);
    if (!newQuestion) return;

    const newQuestions = [...deThi.questions];
    newQuestions[editingQuestionIndex] = newQuestion;

    onSave({
      ...deThi,
      questions: newQuestions
    });

    setEditingQuestionIndex(-1);
    message.success('Thay đổi câu hỏi thành công!');
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return 'success';
      case DifficultyLevel.MEDIUM:
        return 'warning';
      case DifficultyLevel.HARD:
        return 'error';
      default:
        return 'default';
    }
  };

  if (!deThi) return null;

  return (
    <Modal
      title="Chi tiết đề thi"
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>
      ]}
    >
      <div className={styles.deThiInfo}>
        <p><strong>Môn học:</strong> {deThi.monHocName}</p>
        <p><strong>Khối kiến thức:</strong> {deThi.khoiKienThucName}</p>
        <p>
          <strong>Số câu hỏi:</strong>{' '}
          <Tag color="success">Dễ: {deThi.cauHoiDe}</Tag>
          <Tag color="warning">Trung bình: {deThi.cauHoiTrungBinh}</Tag>
          <Tag color="error">Khó: {deThi.cauHoiKho}</Tag>
        </p>
      </div>

      <List
        className={styles.questionList}
        dataSource={deThi.questions}
        renderItem={(question, index) => (
          <List.Item
            actions={[
              editingQuestionIndex === index ? (
                <Select
                  style={{ width: 300 }}
                  placeholder="Chọn câu hỏi thay thế"
                  onChange={handleChangeQuestion}
                >
                  {availableQuestions.map(q => (
                    <Option key={q.id} value={q.id}>
                      {q.content}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Button 
                  type="link" 
                  onClick={() => setEditingQuestionIndex(index)}
                >
                  Đổi câu hỏi
                </Button>
              )
            ]}
          >
            <List.Item.Meta
              title={
                <div className={styles.questionTitle}>
                  <span>Câu {index + 1}:</span>
                  <Tag color={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Tag>
                </div>
              }
              description={question.content}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default DeThiDetail; 