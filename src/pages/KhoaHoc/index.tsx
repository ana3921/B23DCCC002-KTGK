import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, message } from 'antd';
import { KhoaHoc } from '@/models/khoaHoc';
import { getKhoaHocList, saveKhoaHocList } from '@/services/khoaHocService';
import KhoaHocTable from './components/KhoaHocTable';
import KhoaHocForm from './components/KhoaHocForm';

const QuanLyKhoaHoc: React.FC = () => {
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  const [editingKhoaHoc, setEditingKhoaHoc] = useState<KhoaHoc | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy danh sách khóa học từ localStorage khi component được mount
  useEffect(() => {
    setKhoaHocList(getKhoaHocList());
  }, []);

  // Hàm đóng modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingKhoaHoc(null);
  }, []);

  // Hàm lưu khóa học
  const handleSave = useCallback(
    (khoaHoc: KhoaHoc) => {
      // Kiểm tra tên khóa học không được trùng
      const isDuplicate = khoaHocList.some(
        (kh) => kh.tenKhoaHoc === khoaHoc.tenKhoaHoc && kh.id !== editingKhoaHoc?.id
      );
      if (isDuplicate) {
        message.error('Tên khóa học đã tồn tại!');
        return;
      }

      // Cập nhật danh sách khóa học
      const updatedList = editingKhoaHoc
        ? khoaHocList.map((kh) => (kh.id === editingKhoaHoc.id ? { ...khoaHoc, id: kh.id } : kh))
        : [...khoaHocList, { ...khoaHoc, id: Date.now() }];

      setKhoaHocList(updatedList);
      saveKhoaHocList(updatedList);
      closeModal();
      message.success(editingKhoaHoc ? 'Cập nhật khóa học thành công!' : 'Thêm khóa học thành công!');
    },
    [khoaHocList, editingKhoaHoc, closeModal]
  );

  // Hàm xóa khóa học
  const handleDelete = useCallback(
    (id: number) => {
      const khoaHoc = khoaHocList.find((kh) => kh.id === id);
      if (!khoaHoc) {
        message.error('Không tìm thấy khóa học!');
        return;
      }

      const updatedList = khoaHocList.filter((kh) => kh.id !== id);
      setKhoaHocList(updatedList);
      saveKhoaHocList(updatedList);
      message.success('Xóa khóa học thành công!');
    },
    [khoaHocList]
  );

  return (
    <Card title="Quản lý khóa học">
      <Button
        type="primary"
        onClick={() => {
          setEditingKhoaHoc(null);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm khóa học
      </Button>
      <KhoaHocTable
        khoaHocList={khoaHocList}
        onEdit={(khoaHoc) => {
          setEditingKhoaHoc(khoaHoc);
          setModalVisible(true);
        }}
        onDelete={handleDelete}
      />
      <Modal
        title={editingKhoaHoc ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <KhoaHocForm khoaHoc={editingKhoaHoc} onSave={handleSave} />
      </Modal>
    </Card>
  );
};

export default QuanLyKhoaHoc;