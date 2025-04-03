import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import {
	addQuestion,
	updateQuestion,
	deleteQuestion,
	searchQuestions,
	getUniqueSubjects,
	getUniqueKnowledgeAreas,
	loadLocalStorage,
	saveLocalStorage,
} from '@/models/cauhoi/cauHoi';
import { QuestionData, DifficultyLevel } from '@/services/CauHoi';

const CauHoiPage = () => {
	// Khai báo state questions để lưu danh sách câu hỏi
	const [questions, setQuestions] = useState<QuestionData[]>([]);
	// Khai báo state searchFilter để lưu thông tin tìm kiếm
	const [searchFilter, setSearchFilter] = useState<{ subject: string; difficulty: DifficultyLevel | undefined; knowledgeArea: string }>({ subject: '', difficulty: undefined, knowledgeArea: '' });
	// Khai báo state newQuestion để lưu thông tin câu hỏi mới
	const [newQuestion, setNewQuestion] = useState<QuestionData>({
		id: '',
		monHocId: '',
		content: '',
		difficulty: DifficultyLevel.EASY,
		khoiKienThucId: '',
		createdAt: new Date(),
	});
	// Khai báo state isModalOpen để kiểm tra trạng thái mở modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Khai báo state isEditing để kiểm tra trạng thái sửa câu hỏi
	const [isEditing, setIsEditing] = useState(false);
	// Khai báo state editQuestionId để lưu mã câu hỏi cần sửa
	const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
	// Khởi tạo danh sách câu hỏi từ localStorage
	useEffect(() => {
		const loadedQuestions = loadLocalStorage();
		setQuestions(loadedQuestions);
	}, []);
	// Reset thông tin câu hỏi khi đóng modal
	useEffect(() => {
		if (!isModalOpen) {
			setNewQuestion({
				id: '',
				monHocId: '',
				content: '',
				difficulty: DifficultyLevel.EASY,
				khoiKienThucId: '',
				createdAt: new Date(),
			});
		}
	}, [isModalOpen]);

	// Xử lý tìm kiếm câu hỏi
	const handleSearch = () => {
		const results = searchQuestions(searchFilter);
		setQuestions(results);
	};
	// Xử lý thêm câu hỏi
	const handleAddQuestion = () => {
		try {
			const addedQuestion = addQuestion(newQuestion);
			const updatedQuestions = [...questions, addedQuestion];
			setQuestions(updatedQuestions);
			saveLocalStorage(updatedQuestions);
			setNewQuestion({
				id: '',
				monHocId: '',
				content: '',
				difficulty: DifficultyLevel.EASY,
				khoiKienThucId: '',
				createdAt: new Date(),
			});
			setIsModalOpen(false);
		} catch (error) {
			console.error(error);
		}
	};
	// Xử lý cập nhật câu hỏi
	const handleUpdateQuestion = () => {
		if (editQuestionId) {
			try {
				const updatedQuestion = updateQuestion(editQuestionId, newQuestion);
				const updatedQuestions = questions.map(q => q.id === editQuestionId ? updatedQuestion : q);
				setQuestions(updatedQuestions);
				saveLocalStorage(updatedQuestions);
				setNewQuestion({
					id: '',
					monHocId: '',
					content: '',
					difficulty: DifficultyLevel.EASY,
					khoiKienThucId: '',
					createdAt: new Date(),
				});
				setIsModalOpen(false);
				setIsEditing(false);
				setEditQuestionId(null);
			} catch (error) {
				console.error(error);
			}
		}
	};
	// Xử lý xóa câu hỏi
	const handleDeleteQuestion = (id: string) => {
		const isDeleted = deleteQuestion(id);
		if (isDeleted) {
			const updatedQuestions = questions.filter(q => q.id !== id);
			setQuestions(updatedQuestions);
			saveLocalStorage(updatedQuestions);
		}
	};
	// Mở modal sửa câu hỏi
	const openEditModal = (question: QuestionData) => {
		setNewQuestion(question);
		setIsEditing(true);
		setEditQuestionId(question.id);
		setIsModalOpen(true);
	};

	return (
		<div className={styles.container}>
			<h1>Hệ thống quản lý câu hỏi tự luận</h1>
			<div className={styles.formRow}>
				<form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
					<select value={searchFilter.subject}
						onChange={(e) => setSearchFilter({ ...searchFilter, subject: e.target.value })}>
						<option value="">Chọn môn học</option>
						{getUniqueSubjects().map(subject => <option key={subject} value={subject}>{subject}</option>)}
					</select>
					<select value={searchFilter.difficulty}
						onChange={(e) => setSearchFilter({ ...searchFilter, difficulty: e.target.value as DifficultyLevel })}>
						<option value="">Chọn mức độ khó</option>
						{Object.values(DifficultyLevel).map(level => (
							<option key={level} value={level}>{level}</option>
						))}
					</select>
					<select value={searchFilter.knowledgeArea}
						onChange={(e) => setSearchFilter({ ...searchFilter, knowledgeArea: e.target.value })}>
						<option value="">Chọn khối kiến thức</option>
						{getUniqueKnowledgeAreas().map(area => <option key={area} value={area}>{area}</option>)}
					</select>
					<button type="submit">Tìm kiếm</button>
				</form>
				<button className={styles.addButton} onClick={() => setIsModalOpen(true)}>Thêm câu hỏi</button>
			</div>

			<div id="addQuestionModal" className={styles.modal} style={{ display: isModalOpen ? 'block' : 'none' }}>
				<div className={styles.modalContent}>
					<span className={styles.closeButton} onClick={() => { setIsModalOpen(false); setIsEditing(false); setEditQuestionId(null); }}>&times;</span>
					<h2>{isEditing ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}</h2>
					<form onSubmit={(e) => { e.preventDefault(); if (isEditing) { handleUpdateQuestion(); } else { handleAddQuestion(); } }}>
						<input type="text" placeholder="Mã câu hỏi" value={newQuestion.id}
							onChange={(e) => setNewQuestion({ ...newQuestion, id: e.target.value })} required />
						<input type="text" placeholder="Môn học" value={newQuestion.monHocId}
							onChange={(e) => setNewQuestion({ ...newQuestion, monHocId: e.target.value })} required />
						<textarea placeholder="Nội dung câu hỏi" value={newQuestion.content}
							onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })} required />
						<select value={newQuestion.difficulty}
							onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as DifficultyLevel })}>
							{Object.values(DifficultyLevel).map(level => (
								<option key={level} value={level}>{level}</option>
							))}
						</select>
						<input type="text" placeholder="Khối kiến thức" value={newQuestion.khoiKienThucId}
							onChange={(e) => setNewQuestion({ ...newQuestion, khoiKienThucId: e.target.value })} required />
						<button type="submit">{isEditing ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}</button>
					</form>
				</div>
			</div>

			<h2>Danh sách câu hỏi</h2>
			<ul className={styles.questionList}>
				{questions.map(question => (
					<li key={question.id}>
						<p><strong>Mã câu hỏi:</strong> {question.id}</p>
						<p><strong>Môn học:</strong> {question.monHocId}</p>
						<p><strong>Nội dung:</strong> {question.content}</p>
						<p><strong>Mức độ khó:</strong> {question.difficulty}</p>
						<p><strong>Khối kiến thức:</strong> {question.khoiKienThucId}</p>
						<div className={styles.buttonGroup}>
							<button className={styles.editButton} onClick={() => openEditModal(question)}>Sửa</button>
							<button className={styles.deleteButton} onClick={() => handleDeleteQuestion(question.id)}>Xóa</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CauHoiPage;
