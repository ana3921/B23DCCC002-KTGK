import { QuestionData, DifficultyLevel, validateQuestion } from '@/services/CauHoi';

// Lấy dữ liệu từ localStorage
export interface QuestionFilter {
    subject?: string;
    difficulty?: DifficultyLevel;
    knowledgeArea?: string;
}
// Lưu dữ liệu vào localStorage
const STORAGE_KEY = 'questions_data';

// Hàm loadLocalStorage để lấy dữ liệu từ localStorage
export const loadLocalStorage = (): QuestionData[] => {
    try {
        // Lấy dữ liệu từ localStorage
        const data = localStorage.getItem(STORAGE_KEY);
        // Kiểm tra dữ liệu có tồn tại không
        if (data) {
            // Chuyển dữ liệu từ chuỗi JSON sang mảng dữ liệu
            const questions = JSON.parse(data) as QuestionData[];
            return questions;
        }
    } catch (error) {
        console.log('Lỗi khi tải dữ liệu từ localStorage:', error);
    }
    return [];
};
// Hàm saveLocalStorage để lưu dữ liệu vào localStorage
export const saveLocalStorage = (questions: QuestionData[]) => {
    try {
        // Lưu dữ liệu vào localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (error) {
        console.log('Lỗi khi lưu dữ liệu vào localStorage:', error);
    }
};
// Khởi tạo mảng câu hỏi
let questions: QuestionData[] = loadLocalStorage();

// Hàm addQuestion để thêm câu hỏi mới
export const addQuestion = (question: QuestionData): QuestionData => {
    try {
        // Kiểm tra câu hỏi có hợp lệ không
        validateQuestion(question);
        // Kiểm tra câu hỏi đã tồn tại chưa
        if (questions.some(q => q.id === question.id)) {
            // Nếu câu hỏi đã tồn tại thì thông báo lỗi
            throw new Error(`Câu hỏi với mã ${question.id} đã tồn tại`);
        }
        // Thêm câu hỏi vào mảng câu hỏi
        questions = [...questions, question];
        // Lưu dữ liệu vào localStorage
        saveLocalStorage(questions);
        // Trả về câu hỏi vừa thêm
        return question;
    } catch (error) {
        throw error;
    }
};
// Hàm updateQuestion để cập nhật câu hỏi
export const updateQuestion = (id: string, updatedData: Partial<QuestionData>): QuestionData => {
    // Tìm câu hỏi theo mã
    const index = questions.findIndex(q => q.id === id);
    // Kiểm tra câu hỏi có tồn tại không
    if (index === -1) {
        // Nếu không tìm thấy câu hỏi thì thông báo lỗi
        throw new Error(`Không tìm thấy câu hỏi với mã ${id}`);
    }
    // Cập nhật dữ liệu câu hỏi
    const updatedQuestion = {
        ...questions[index],
        ...updatedData
    };
    // Kiểm tra câu hỏi có hợp lệ không
    validateQuestion(updatedQuestion);
    // Cập nhật câu hỏi
    questions = [
        ...questions.slice(0, index),
        updatedQuestion,
        ...questions.slice(index + 1)
    ];
    // Lưu dữ liệu vào localStorage
    saveLocalStorage(questions);
    // Trả về câu hỏi đã cập nhật
    return updatedQuestion;
};
// Hàm deleteQuestion để xóa câu hỏi
export const deleteQuestion = (id: string): boolean => {
    // Lấy số lượng câu hỏi ban đầu
    const initialLength = questions.length;
    // Lọc câu hỏi theo mã
    questions = questions.filter(q => q.id !== id);
    // Kiểm tra số lượng câu hỏi sau khi xóa
    if (questions.length === initialLength) {
        return false;
    }
    // Lưu dữ liệu vào localStorage
    saveLocalStorage(questions);
    return true;
};
// Hàm getQuestionById để lấy câu hỏi theo mã
export const getQuestionById = (id: string): QuestionData | undefined => {
    // Tìm câu hỏi theo mã
    return questions.find(q => q.id === id);
};
// Hàm getAllQuestions để lấy tất cả câu hỏi
export const getAllQuestions = (): QuestionData[] => {
    return [...questions];
};
// Hàm searchQuestions để tìm kiếm câu hỏi
export const searchQuestions = (filter: QuestionFilter): QuestionData[] => {
    // Lọc câu hỏi theo điều kiện
    return questions.filter(question => {
        // Mặc định là true
        let match = true;
        // Kiểm tra điều kiện
        if (filter.subject && question.subject !== filter.subject) {
            match = false;
        }
        // Kiểm tra điều kiện
        if (filter.difficulty && question.difficulty !== filter.difficulty) {
            match = false;
        }
        // Kiểm tra điều kiện
        if (filter.knowledgeArea && question.knowledgeArea !== filter.knowledgeArea) {
            match = false;
        }
        return match;
    });
};
// Hàm getUniqueSubjects để lấy danh sách môn học
export const getUniqueSubjects = (): string[] => {
    const subjects = new Set<string>();
    questions.forEach(q => subjects.add(q.subject));
    return Array.from(subjects);
};
// Hàm getUniqueKnowledgeAreas để lấy danh sách khối kiến thức
export const getUniqueKnowledgeAreas = (): string[] => {
    // Khởi tạo mảng khối kiến thức
    const areas = new Set<string>();
    // Duyệt qua mảng câu hỏi
    questions.forEach(q => areas.add(q.knowledgeArea));
    //  Trả về mảng khối kiến thức
    return Array.from(areas);
};
// Hàm refreshQuestions để cập nhật lại dữ liệu câu hỏi
export const refreshQuestions = (): void => {
    questions = loadLocalStorage();
};
