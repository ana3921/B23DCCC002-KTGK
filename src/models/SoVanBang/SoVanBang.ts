import useInitModel from "@/hooks/useInitModel";

export interface Record {
  id: string;
  nam: number;
  soHienTai: number;
  trangThai: boolean;
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
    getModel: laySoVanBang,
    postModel: themSoVanBang, 
    putModel: capNhatSoVanBang,
    deleteModel: xoaSoVanBang,
  } = useInitModel<Record>('so-van-bang');

  // Tạo sổ mới cho năm hiện tại
  const taoSoMoi = async () => {
    const namHienTai = new Date().getFullYear();
    
    try {
      // Vô hiệu hóa tất cả sổ cũ
      const soVanBangCu = danhSach.filter(so => so.trangThai);
      for (const so of soVanBangCu) {
        await capNhatSoVanBang(so.id, {
          ...so,
          trangThai: false
        });
      }

      // Tạo sổ mới
      await themSoVanBang({
        nam: namHienTai,
        soHienTai: 1,
        trangThai: true
      });

      // Refresh danh sách
      await laySoVanBang();
    } catch (error) {
      console.error('Lỗi khi tạo sổ mới:', error);
      throw error;
    }
  };

  // Lấy sổ đang hoạt động
  const laySoHienTai = () => {
    return danhSach.find(so => so.trangThai);
  };

  // Tăng số hiện tại
  const tangSoHienTai = async (id: string) => {
    const soVanBang = danhSach.find(so => so.id === id);
    if (soVanBang) {
      await capNhatSoVanBang(id, {
        ...soVanBang,
        soHienTai: soVanBang.soHienTai + 1
      });
      await laySoVanBang();
    }
  };

  return {
    danhSach,
    loading,
    total,
    page,
    limit,
    setPage,
    setLimit,
    laySoVanBang,
    themSoVanBang,
    capNhatSoVanBang,
    xoaSoVanBang,
    taoSoMoi,
    laySoHienTai,
    tangSoHienTai
  };
};