export interface KhoaHoc {
    id: number;
    tenKhoaHoc: string;
    giangVien: string;
    soLuongHocVien: number;
    trangThai: 'DangMo' | 'DaKetThuc' | 'TamDung';
    moTa: string;
  }