import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface MonHoc {
  id: string;
  name: string;
  description: string;
  credits: number;
}

export interface KhoiKienThuc {
  id: string;
  name: string;
  monHocId: string;
  isRequired: boolean;
  createdAt: string;
}

export default function useKhoiKienThuc() {
  const [khoiKienThucs, setKhoiKienThucs] = useState<KhoiKienThuc[]>([]);
  const [monHocs, setMonHocs] = useState<MonHoc[]>([]);

  useEffect(() => {
    try {
      const storedKhoiKienThucs = localStorage.getItem('khoiKienThucs');
      const storedMonHocs = localStorage.getItem('monHocs');
      
      if (storedKhoiKienThucs) {
        setKhoiKienThucs(JSON.parse(storedKhoiKienThucs));
      }
      if (storedMonHocs) {
        setMonHocs(JSON.parse(storedMonHocs));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('khoiKienThucs', JSON.stringify(khoiKienThucs));
  }, [khoiKienThucs]);

  const getKhoiKienThucsByMonHoc = (monHocId: string) => {
    return khoiKienThucs.filter(kkt => kkt.monHocId === monHocId);
  };

  const addKhoiKienThuc = (khoiKienThuc: Omit<KhoiKienThuc, 'id' | 'createdAt'>) => {
    const newKhoiKienThuc: KhoiKienThuc = {
      ...khoiKienThuc,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setKhoiKienThucs(prev => [...prev, newKhoiKienThuc]);
  };

  const updateKhoiKienThuc = (id: string, khoiKienThuc: Partial<KhoiKienThuc>) => {
    setKhoiKienThucs(prev => 
      prev.map(kkt => 
        kkt.id === id 
          ? { ...kkt, ...khoiKienThuc }
          : kkt
      )
    );
  };

  const deleteKhoiKienThuc = (id: string) => {
    setKhoiKienThucs(prev => prev.filter(kkt => kkt.id !== id));
  };

  return {
    khoiKienThucs,
    monHocs,
    getKhoiKienThucsByMonHoc,
    addKhoiKienThuc,
    updateKhoiKienThuc,
    deleteKhoiKienThuc
  };
}
