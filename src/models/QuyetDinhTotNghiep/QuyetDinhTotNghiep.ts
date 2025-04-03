import useInitModel from "@/hooks/useInitModel";

export interface Record {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: string; 
  trichYeu: string;
  soVanBangId: string;
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
    getModel: layQuyetDinh,
    postModel: themQuyetDinh,
    putModel: capNhatQuyetDinh,
    deleteModel: xoaQuyetDinh,
  } = useInitModel<Record>('quyet-dinh-tot-nghiep');

  // Lấy quyết định theo sổ văn bằng
  const layTheoSoVanBang = (soVanBangId: string) => {
    return danhSach.filter(qd => qd.soVanBangId === soVanBangId);
  };

  return {
    danhSach,
    loading,
    total,
    page,
    limit,
    setPage,
    setLimit,
    layQuyetDinh,
    themQuyetDinh, 
    capNhatQuyetDinh,
    xoaQuyetDinh,
    layTheoSoVanBang
  };
};