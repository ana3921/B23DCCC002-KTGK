import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, List, Tag, Select, message } from 'antd';
import { QuestionData, DifficultyLevel } from '@/services/CauHoi';
import { loadLocalStorage as loadQuestions } from '@/models/cauhoi/cauHoi';
import styles from './ViewDeThi.less';

const { Option } = Select;

interface KhoiKienThucDeThi {
  khoiKienThucId: string;
  khoiKienThucName: string;
  cauHoiDe: number;
  cauHoiTrungBinh: number;
  cauHoiKho: number;
}

interface ViewDeThiProps {
  visible: boolean;
  deThi: {
    id: string;
    monHocId: string;
    monHocName: string;
    khoiKienThucs: KhoiKienThucDeThi[];
  };
  onCancel: () => void;
  onSave: (deThi: any) => void;
}

const ViewDeThi: React.FC<ViewDeThiProps> = ({
  visible,
  deThi,
  onCancel,
  onSave,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionData[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionData[]>([]);

  // Load tất cả câu hỏi có sẵn khi mở modal
  useEffect(() => {
    if (visible && deThi) {
      const allQuestions = loadQuestions();
      // Lọc câu hỏi theo môn học
      const filtered = allQuestions.filter(q => q.monHocId === deThi.monHocId);
      setAvailableQuestions(filtered);
    }
  }, [visible, deThi]);

  // Tự động gen câu hỏi khi mở modal
  useEffect(() => {
    if (visible && deThi && availableQuestions.length > 0) {
      const genQuestions = generateQuestions();
      setSelectedQuestions(genQuestions);
    }
  }, [visible, deThi, availableQuestions]);

  // Hàm gen câu hỏi tự động
  const generateQuestions = () => {
    const questions: QuestionData[] = [];
    
    // Lặp qua từng khối kiến thức
    deThi.khoiKienThucs.forEach((kkt: KhoiKienThucDeThi) => {
      const khoiQuestions = availableQuestions.filter(
        q => q.khoiKienThucId === kkt.khoiKienThucId
      );

      // Gen câu hỏi dễ
      const easyQuestions = shuffleArray(
        khoiQuestions.filter(q => q.difficulty === DifficultyLevel.EASY)
      ).slice(0, kkt.cauHoiDe);

      // Gen câu hỏi trung bình
      const mediumQuestions = shuffleArray(
        khoiQuestions.filter(q => q.difficulty === DifficultyLevel.MEDIUM)
      ).slice(0, kkt.cauHoiTrungBinh);

      // Gen câu hỏi khó
      const hardQuestions = shuffleArray(
        khoiQuestions.filter(q => q.difficulty === DifficultyLevel.HARD)
      ).slice(0, kkt.cauHoiKho);

      questions.push(...easyQuestions, ...mediumQuestions, ...hardQuestions);
    });

    return questions;
  };

  // Hàm thay đổi câu hỏi
  const handleChangeQuestion = (oldQuestion: QuestionData, newQuestionId: string) => {
    const newQuestion = availableQuestions.find(q => q.id === newQuestionId);
    if (!newQuestion) return;

    const newQuestions = selectedQuestions.map(q =>
      q.id === oldQuestion.id ? newQuestion : q
    );
    setSelectedQuestions(newQuestions);
  };

  // Lấy danh sách câu hỏi có thể thay thế
  const getAvailableReplacements = (question: QuestionData) => {
    return availableQuestions.filter(
      q => !selectedQuestions.find(sq => sq.id === q.id)
    );
  };

  // Lưu đề thi
  const handleSave = () => {
    const updatedDeThi = {
      ...deThi,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length
    };
    onSave(updatedDeThi);
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

  return (
    <Modal
      title="Chi tiết đề thi"
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu đề thi
        </Button>
      ]}
    >
      {deThi && (
        <div className={styles.deThiDetail}>
          <div className={styles.header}>
            <h2>{deThi.monHocName}</h2>
            <div className={styles.khoiKienThucs}>
              {deThi.khoiKienThucs.map((kkt: KhoiKienThucDeThi, index: number) => (
                <div key={index} className={styles.khoiKienThuc}>
                  <h3>{kkt.khoiKienThucName}</h3>
                  <div className={styles.stats}>
                    <Tag color="success">Dễ: {kkt.cauHoiDe}</Tag>
                    <Tag color="warning">Trung bình: {kkt.cauHoiTrungBinh}</Tag>
                    <Tag color="error">Khó: {kkt.cauHoiKho}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <List
            className={styles.questionList}
            dataSource={selectedQuestions}
            renderItem={(question, index) => (
              <List.Item
                key={question.id}
                className={styles.questionItem}
              >
                <div className={styles.questionContent}>
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>Câu {index + 1}</span>
                    <Tag color={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Tag>
                    <Tag color="processing">
                      {deThi.khoiKienThucs.find((kkt: KhoiKienThucDeThi) => kkt.khoiKienThucId === question.khoiKienThucId)?.khoiKienThucName}
                    </Tag>
                  </div>
                  <div className={styles.questionText}>{question.content}</div>
                </div>
                <div className={styles.questionActions}>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Đổi câu hỏi"
                    onChange={(value) => handleChangeQuestion(question, value)}
                  >
                    {getAvailableReplacements(question).map(q => (
                      <Option key={q.id} value={q.id}>
                        {q.content.substring(0, 50)}...
                      </Option>
                    ))}
                  </Select>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default ViewDeThi; 