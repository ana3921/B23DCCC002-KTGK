// Định  nghĩa hàm getRamdomNumber để tạo ra số ngẫu nhiên từ 1 đến 100 và trả về đối tựng RamdomNumber
export const GetRamdomNumber = (): RamdomNumber => ({
    // Trả về 1 đối tượng có thuộc tính number để tạo ra số ngẫu nhiên từ 1 đến 100
    number: Math.floor(Math.random() * 100) + 1
});
// Định nghĩa hàm ValidateRamdomNumber để kiểm tra xem giá trị nhập vào có phải là số từ 1 đến 100 không
export const ValidateRamdomNumber = (guess: string) => {
    // Chuyển giá trị nhập vào thành kiểu number
    const guessNumber = parseInt(guess);
    // Kiểm tra xem giá trị nhập vào có phải là số từ 1 đ
    return !isNaN(guessNumber) && guessNumber >= 1 && guessNumber <= 100;
};

// Định nghĩa kiểu dữ liệu (type) có tên là RamdomNumber
export type RamdomNumber = {
    // Thuộc tính number kiểu number
    number: number;
};
