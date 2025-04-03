import { KhoaHoc } from '@/models/khoaHoc';

const STORAGE_KEY = 'khoa_hoc';

export const getKhoaHocList = (): KhoaHoc[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveKhoaHocList = (khoaHocList: KhoaHoc[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(khoaHocList));
};