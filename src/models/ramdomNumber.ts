import { GetRamdomNumber, ValidateRamdomNumber } from '@/services/RandomNumber';
import { useState, useEffect } from 'react';

export const useRandomNumberModel = () => {
    // Lưu số ngẫu nhiên
    const [targetNumber, setTargetNumber] = useState<number | null>(null);
    // Lưu số lần đoán còn lại
    const [numberOfEntries, setNumberOfEntries] = useState(10);
    // Lưu giá trị người chơi đoán
    const [guess, setGuess] = useState('');
    // Lưu thông báo kết quả
    const [ramdomResult, setRamdomResult] = useState('');
    // Lưu phản hồi đoán cao/thấp
    const [feedback, setFeedback] = useState('');
    // Lưu trạng thái kết thúc game
    const [isNumberOver, setIsNumberOver] = useState(false);
    // Lưu số máy đoán khi hết lượt
    const [machineGuess, setMachineGuess] = useState<number | null>(null);

    // Khởi tạo số ngẫu nhiên khi component mount
    useEffect(() => {
        setTargetNumber(GetRamdomNumber().number);
    }, []);

    const handleGuess = () => {
        // Kiểm tra nhập liệu người dùng khi đoán số
        if (!guess.trim()) return;
        // Chuyển giá trị nhập vào thành kiểu number
        const guessNumber = parseInt(guess);

        // Kiểm tra nhập số hợp lệ
        if (!ValidateRamdomNumber(guess.trim())) {
            // thông báo lỗi khi nhập số không hợp lệ
            setRamdomResult('Vui lòng nhập số hợp lệ từ 1 đến 100');
            // xóa giá trị nhập
            setFeedback('');
            return;
        }

        if (targetNumber === null) return;

        // Giảm số lần đoán
        const newAttemptsLeft = numberOfEntries - 1;

        if (guessNumber === targetNumber) {
            // nếu đoán đúng thì thông báo chúc mừng bạn đoán đúng
            setFeedback('Chúc mừng! Bạn đã đoán đúng!');
            // cập nhật trạng thái kết thúc phần đoán sốsố
            setIsNumberOver(true);
            // cập nhập số máy đoán
            setRamdomResult(`Số đúng là: ${targetNumber}`);
        } else if (newAttemptsLeft === 0) {
            // nếu hết lượt đoán thì thông báo số đúng và số máy đoán
            setFeedback(`Hết lượt! Số đúng là ${targetNumber}.`);
            // cập nhật trạng thái kết thúc phần đoán số
            setIsNumberOver(true);
            // cập nhập số máy đoán
            setMachineGuess(targetNumber);
        } else if (guessNumber > targetNumber) {
            // nếu đoán số lớn hơn số ngẫu nhiên thì thông báo số đoán quá cao
            setFeedback('Bạn đoán số quá cao!');
        } else {
            // nếu đoán số nhỏ hơn số ngẫu nhiên thì thông báo số đoán quá thấp
            setFeedback('Bạn đoán số quá thấp!');
        }

        // Cập nhật số lượt đoán
        setNumberOfEntries(newAttemptsLeft);
        setGuess('');
        setRamdomResult('');
    };

    const handleNewRamdomNumber = () => {
        // Khởi tạo lại giá trị
        setTargetNumber(GetRamdomNumber().number);
        // Cập nhật lại giá trị
        setGuess('');
        // Cập nhật lại số lượt đoán
        setNumberOfEntries(10);
        // Cập nhật lại trạng thái kết thúc
        setIsNumberOver(false);
        // Cập nhật lại giá trị máy đoán
        setFeedback('');
        // Cập nhật lại giá trị người dùng
        setMachineGuess(null);
        // Cập nhật lại thông báo kết quả
        setRamdomResult('');
    };

    return {
        targetNumber,
        numberOfEntries,
        guess,
        ramdomResult,
        isNumberOver,
        setGuess,
        handleGuess,
        handleNewRamdomNumber,
        machineGuess,
        feedback
    };
};
