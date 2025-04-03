import { QuestionData } from '@/services/CauHoi';

export interface KhoiKienThucData {
  khoiKienThucId: string;
  cauHoiDe: number;
  cauHoiTrungBinh: number;
  cauHoiKho: number;
}

export interface DeThiFormData {
  monHocId: string;
  khoiKienThucs: KhoiKienThucData[];
}

export interface DeThi extends Omit<DeThiFormData, 'khoiKienThucs'> {
  id: string;
  monHocName: string;
  khoiKienThucs: (KhoiKienThucData & {
    khoiKienThucName: string;
  })[];
  questions?: QuestionData[];
  totalQuestions?: number;
  createdAt: Date;
}

export interface QuestionCount {
  easy: number;
  medium: number;
  hard: number;
} 