import useInitModel from "@/hooks/useInitModel";

export interface Record {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  quyetDinhId: string;
  soVanBangId: string;
  thongTinBoSung: Record<string, any>;
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
    getModel: layVanBang,
    postModel: themVanBang,
    putModel: capNhatVanBang,
    deleteModel: xoaVanBang,
  } = useInitModel<Record>('thong-tin-van-bang');

  // Lấy theo quyết định tốt nghiệp
  const layTheoQuyetDinh = (quyetDinhId: string) => {
    return danhSach.filter(vb => vb.quyetDinhId === quyetDinhId);
  };

  // Lấy theo sổ văn bằng
  const layTheoSoVanBang = (soVanBangId: string) => {
    return danhSach.filter(vb => vb.soVanBangId === soVanBangId);
  };

  // Tìm kiếm văn bằng (chức năng tra cứu)
  const timKiemVanBang = (params: {
    soHieuVanBang?: string;
    soVaoSo?: number;
    maSinhVien?: string;
    hoTen?: string;
    ngaySinh?: string;
  }) => {
    return danhSach.filter(vb => {
      const matchCount = Object.entries(params).reduce((count, [key, value]) => {
        if (!value) return count;
        return vb[key as keyof typeof vb] === value ? count + 1 : count;
      }, 0);
      return matchCount >= 2;
    });
  };

  return {
    danhSach,
    loading,
    total,
    page,
    limit,
    setPage,
    setLimit,
    layVanBang,
    themVanBang,
    capNhatVanBang,
    xoaVanBang,
    layTheoQuyetDinh,
    layTheoSoVanBang,
    timKiemVanBang
  };
};