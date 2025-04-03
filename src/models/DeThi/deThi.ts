import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuestionData } from '@/services/CauHoi';

export interface CauHoi {
  id: string;
  question: string;
  options: string[];
  answer: string;
  level: 'easy' | 'medium' | 'hard';
  type: 'basic' | 'advanced';
  monHocId: string;
  khoiKienThucId: string;
}

export interface DeThi {
  id: string;
  title: string;
  questions: CauHoi[];
  questionCount: number;
  monHocId: string;
  khoiKienThucId: string;
}

export interface DeThiFormat {
  id: string;
  monHocId: string;
  khoiKienThucId: string;
  cauHoiDe: number;
  cauHoiTrungBinh: number;
  cauHoiKho: number;
  createdAt: Date;
}

export interface DeThiChiTiet extends DeThiFormat {
  questions: QuestionData[];
  monHocName?: string;
  khoiKienThucName?: string;
}

export const getStoredDeThis = (): DeThi[] => {
  const storedDeThis = localStorage.getItem('deThis');
  return storedDeThis ? JSON.parse(storedDeThis) : [];
};

export const storeDeThis = (deThis: DeThi[]) => {
  localStorage.setItem('deThis', JSON.stringify(deThis));
};

export const createDeThi = (title: string, questions: CauHoi[], questionCount: number, monHocId: string, khoiKienThucId: string): DeThi => {
  return {
    id: uuidv4(),
    title,
    questions,
    questionCount,
    monHocId,
    khoiKienThucId,
  };
};

export const allQuestions: CauHoi[] = [
  // Toán rời rạc - Khối cơ bản
  { id: '1', question: 'Câu hỏi cơ bản 1 môn Toán rời rạc', options: [], answer: '', level: 'easy', type: 'basic', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-co-ban' },
  { id: '2', question: 'Câu hỏi cơ bản 2 môn Toán rời rạc', options: [], answer: '', level: 'easy', type: 'basic', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-co-ban' },
  { id: '3', question: 'Câu hỏi cơ bản 3 môn Toán rời rạc', options: [], answer: '', level: 'medium', type: 'basic', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-co-ban' },
  { id: '4', question: 'Câu hỏi cơ bản 4 môn Toán rời rạc', options: [], answer: '', level: 'medium', type: 'basic', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-co-ban' },
  { id: '5', question: 'Câu hỏi cơ bản 5 môn Toán rời rạc', options: [], answer: '', level: 'hard', type: 'basic', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-co-ban' },
  
  // Toán rời rạc - Khối nâng cao
  { id: '6', question: 'Câu hỏi nâng cao 1 môn Toán rời rạc', options: [], answer: '', level: 'easy', type: 'advanced', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-nang-cao' },
  { id: '7', question: 'Câu hỏi nâng cao 2 môn Toán rời rạc', options: [], answer: '', level: 'medium', type: 'advanced', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-nang-cao' },
  { id: '8', question: 'Câu hỏi nâng cao 3 môn Toán rời rạc', options: [], answer: '', level: 'hard', type: 'advanced', monHocId: 'toan-roi-rac', khoiKienThucId: 'khoi-nang-cao' },
  
  // Cấu trúc dữ liệu - Khối cơ bản
  { id: '9', question: 'Câu hỏi cơ bản 1 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'easy', type: 'basic', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-co-ban' },
  { id: '10', question: 'Câu hỏi cơ bản 2 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'medium', type: 'basic', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-co-ban' },
  { id: '11', question: 'Câu hỏi cơ bản 3 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'hard', type: 'basic', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-co-ban' },
  
  // Cấu trúc dữ liệu - Khối nâng cao
  { id: '12', question: 'Câu hỏi nâng cao 1 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'easy', type: 'advanced', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-nang-cao' },
  { id: '13', question: 'Câu hỏi nâng cao 2 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'medium', type: 'advanced', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-nang-cao' },
  { id: '14', question: 'Câu hỏi nâng cao 3 môn Cấu trúc dữ liệu', options: [], answer: '', level: 'hard', type: 'advanced', monHocId: 'cau-truc-du-lieu', khoiKienThucId: 'khoi-nang-cao' },
];

const useDeThis = () => {
  const [deThis, setDeThis] = useState<DeThi[]>([]);

  useEffect(() => {
    setDeThis(getStoredDeThis());
  }, []);

  useEffect(() => {
    storeDeThis(deThis);
  }, [deThis]);

  const getAvailableQuestions = (level: 'easy' | 'medium' | 'hard', type: 'basic' | 'advanced', monHocId: string, khoiKienThucId: string, existingQuestions: CauHoi[]) => {
    return allQuestions.filter(q => 
      q.level === level && 
      q.type === type &&
      q.monHocId === monHocId &&
      q.khoiKienThucId === khoiKienThucId &&
      !existingQuestions.includes(q)
    );
  };

  const addDeThi = (title: string, questions: CauHoi[], monHocId: string, khoiKienThucId: string): DeThi => {
    const newDeThi = createDeThi(title, questions, questions.length, monHocId, khoiKienThucId);
    setDeThis([...deThis, newDeThi]);
    return newDeThi;
  };

  const updateDeThi = (id: string, title: string, questions: CauHoi[], monHocId: string, khoiKienThucId: string) => {
    setDeThis(deThis.map((deThi: DeThi) => 
      deThi.id === id ? { ...deThi, title, questions, questionCount: questions.length, monHocId, khoiKienThucId } : deThi
    ));
  };

  const deleteDeThi = (id: string) => {
    setDeThis(deThis.filter((deThi: DeThi) => deThi.id !== id));
  };

  const changeQuestion = (deThi: DeThi, oldQuestion: CauHoi, index: number): [CauHoi | null, string] => {
    const availableQuestions = getAvailableQuestions(
      oldQuestion.level, 
      oldQuestion.type, 
      deThi.monHocId,
      deThi.khoiKienThucId,
      deThi.questions
    );
    
    if (availableQuestions.length === 0) {
      return [null, 'Không có câu hỏi thay thế phù hợp!'];
    }

    const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    return [newQuestion, ''];
  };

  const addNewQuestion = (deThi: DeThi, type: 'basic' | 'advanced', level: 'easy' | 'medium' | 'hard'): [CauHoi | null, string] => {
    const availableQuestions = getAvailableQuestions(
      level, 
      type, 
      deThi.monHocId,
      deThi.khoiKienThucId,
      deThi.questions
    );

    if (availableQuestions.length === 0) {
      return [null, 'Không có câu hỏi phù hợp để thêm!'];
    }

    const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    return [newQuestion, ''];
  };

  const generateInitialQuestions = (counts: {
    basicEasy: number;
    basicMedium: number;
    basicHard: number;
    advancedEasy: number;
    advancedMedium: number;
    advancedHard: number;
  }, monHocId: string, khoiKienThucId: string): CauHoi[] => {
    return [
      ...allQuestions.filter(q => q.level === 'easy' && q.type === 'basic' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.basicEasy),
      ...allQuestions.filter(q => q.level === 'medium' && q.type === 'basic' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.basicMedium),
      ...allQuestions.filter(q => q.level === 'hard' && q.type === 'basic' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.basicHard),
      ...allQuestions.filter(q => q.level === 'easy' && q.type === 'advanced' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.advancedEasy),
      ...allQuestions.filter(q => q.level === 'medium' && q.type === 'advanced' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.advancedMedium),
      ...allQuestions.filter(q => q.level === 'hard' && q.type === 'advanced' && q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId).slice(0, counts.advancedHard),
    ];
  };

  return {
    deThis,
    addDeThi,
    updateDeThi,
    deleteDeThi,
    changeQuestion,
    addNewQuestion,
    generateInitialQuestions,
    allQuestions,
  };
};

export default useDeThis;

// Lưu trữ đề thi vào localStorage
export const saveDeThis = (deThis: DeThiChiTiet[]) => {
  localStorage.setItem('deThis', JSON.stringify(deThis));
};

// Lấy danh sách đề thi từ localStorage
export const loadDeThis = (): DeThiChiTiet[] => {
  const data = localStorage.getItem('deThis');
  return data ? JSON.parse(data) : [];
};

// Lưu format đề thi để tái sử dụng
export const saveDeThiFormat = (format: DeThiFormat) => {
  const formats = loadDeThiFormats();
  formats.push(format);
  localStorage.setItem('deThiFormats', JSON.stringify(formats));
};

// Lấy danh sách format đề thi
export const loadDeThiFormats = (): DeThiFormat[] => {
  const data = localStorage.getItem('deThiFormats');
  return data ? JSON.parse(data) : [];
};

// Tạo đề thi chi tiết từ format và danh sách câu hỏi
export const generateDeThi = (format: DeThiFormat, questions: QuestionData[]): DeThiChiTiet => {
  return {
    ...format,
    questions
  };
};

// Random câu hỏi theo yêu cầu
export const randomQuestions = (
  allQuestions: QuestionData[],
  monHocId: string,
  khoiKienThucId: string,
  requirements: {
    easy: number;
    medium: number;
    hard: number;
  }
): QuestionData[] => {
  const filteredQuestions = allQuestions.filter(
    q => q.monHocId === monHocId && q.khoiKienThucId === khoiKienThucId
  );

  const easyQuestions = filteredQuestions.filter(q => q.difficulty === 'EASY');
  const mediumQuestions = filteredQuestions.filter(q => q.difficulty === 'MEDIUM');
  const hardQuestions = filteredQuestions.filter(q => q.difficulty === 'HARD');

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const selectedQuestions = [
    ...shuffleArray(easyQuestions).slice(0, requirements.easy),
    ...shuffleArray(mediumQuestions).slice(0, requirements.medium),
    ...shuffleArray(hardQuestions).slice(0, requirements.hard)
  ];

  return selectedQuestions;
};

// Thay thế câu hỏi trong đề thi
export const replaceQuestion = (
  deThi: DeThiChiTiet,
  questionIndex: number,
  newQuestion: QuestionData
): DeThiChiTiet => {
  const newQuestions = [...deThi.questions];
  newQuestions[questionIndex] = newQuestion;
  return {
    ...deThi,
    questions: newQuestions
  };
};
