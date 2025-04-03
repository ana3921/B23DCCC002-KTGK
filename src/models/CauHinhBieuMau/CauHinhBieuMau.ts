import useInitModel from "@/hooks/useInitModel";

export interface Record {
  id: string;
  ten: string;
  kieuDuLieu: 'string' | 'number' | 'date';
  macDinh: boolean;
  thuTu: number;
  createdAt?: string;
  updatedAt?: string;
}

export default () => {
  const {
    danhSach,
    loading,
    total,
    page,
    limit,
    setPage,
    setLimit,
    getModel: layTruong,
    postModel: themTruong,
    putModel: capNhatTruong,
    deleteModel: xoaTruong,
  } = useInitModel<Record>('cau-hinh-bieu-mau');

  // Lấy danh sách trường theo kiểu dữ liệu
  const layTheoKieuDuLieu = (kieuDuLieu: Record['kieuDuLieu']) => {
    return danhSach.filter(truong => truong.kieuDuLieu === kieuDuLieu);
  };

  // Lấy danh sách đã sắp xếp theo thứ tự
  const layDanhSachSapXep = () => {
    return [...danhSach].sort((a, b) => a.thuTu - b.thuTu);
  };

  return {
    danhSach,
    loading,
    total,
    page,
    limit,
    setPage,
    setLimit,
    layTruong,
    themTruong,
    capNhatTruong,
    xoaTruong,
    layTheoKieuDuLieu,
    layDanhSachSapXep
  };
};