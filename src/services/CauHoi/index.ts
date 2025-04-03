export enum DifficultyLevel {
    EASY = 'Dễ',
    MEDIUM = 'Trung bình',
    HARD = 'Khó',
    VERY_HARD = 'Rất khó'
  }

export interface QuestionData {
    id: string;
    monHocId: string;
    khoiKienThucId: string;
    content: string;
    difficulty: DifficultyLevel;
    createdAt: Date;
  }

export const validateQuestion = (question: QuestionData): boolean => {
    if (!question.id || typeof question.id !== 'string') {
      throw new Error('Mã câu hỏi không hợp lệ');
    }
    
    if (!question.monHocId || typeof question.monHocId !== 'string') {
      throw new Error('Môn học không hợp lệ');
    }
    
    if (!question.khoiKienThucId || typeof question.khoiKienThucId !== 'string') {
      throw new Error('Khối kiến thức không hợp lệ');
    }
    
    if (!question.content || typeof question.content !== 'string') {
      throw new Error('Nội dung câu hỏi không hợp lệ');
    }
    
    const validDifficulties = Object.values(DifficultyLevel);
    if (!validDifficulties.includes(question.difficulty)) {
      throw new Error('Mức độ khó không hợp lệ. Phải là một trong: Dễ, Trung bình, Khó, Rất khó');
    }
    
    return true;
  };

  export const createQuestion = (
    id: string,
    monHocId: string,
    khoiKienThucId: string,
    content: string,
    difficulty: DifficultyLevel
  ): QuestionData => {
    const question: QuestionData = {
      id,
      monHocId,
      khoiKienThucId,
      content,
      difficulty,
      createdAt: new Date()
    };
    
    validateQuestion(question);
    return question;
  };