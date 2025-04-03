import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Form, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useKhoiKienThuc from '@/models/KhoiKienThuc/kienthuc';
import { loadLocalStorage as loadQuestions } from '@/models/cauhoi/cauHoi';
import { DifficultyLevel } from '@/services/CauHoi';
import { DeThi, DeThiFormData, QuestionCount } from './interfaces';
import CreateDeThiForm from './components/CreateDeThiForm';
import DeThiTable from './components/DeThiTable';
import ViewDeThi from './components/ViewDeThi';
import styles from './styles.less';
import useMonHocs from '@/models/monhoc/monHoc';

const DeThiPage = () => {
  const { monHocs } = useMonHocs();
  const { khoiKienThucs } = useKhoiKienThuc();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [deThis, setDeThis] = useState<DeThi[]>([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');
  const [availableQuestions, setAvailableQuestions] = useState<Map<string, QuestionCount>>(new Map());
  const [selectedDeThi, setSelectedDeThi] = useState<DeThi | null>(null);

  // Lọc khối kiến thức theo môn học
  const filteredKhoiKienThucs = useMemo(() => {
    return khoiKienThucs.filter(kkt => kkt.monHocId === selectedMonHoc);
  }, [selectedMonHoc, khoiKienThucs]);

  // Tối ưu hóa việc tính toán số câu hỏi có sẵn
  const calculateAvailableQuestions = useCallback((monHocId: string) => {
    const allQuestions = loadQuestions();
    const questionsByKhoiKienThuc = new Map<string, QuestionCount>();

    filteredKhoiKienThucs.forEach(kkt => {
      const filteredQuestions = allQuestions.filter(
        q => q.monHocId === monHocId && q.khoiKienThucId === kkt.id
      );

      questionsByKhoiKienThuc.set(kkt.id, {
        easy: filteredQuestions.filter(q => q.difficulty === DifficultyLevel.EASY).length,
        medium: filteredQuestions.filter(q => q.difficulty === DifficultyLevel.MEDIUM).length,
        hard: filteredQuestions.filter(q => q.difficulty === DifficultyLevel.HARD).length,
      });
    });

    return questionsByKhoiKienThuc;
  }, [filteredKhoiKienThucs]);

  // Cập nhật số lượng câu hỏi có sẵn khi chọn môn học
  useEffect(() => {
    if (selectedMonHoc) {
      setAvailableQuestions(calculateAvailableQuestions(selectedMonHoc));
    }
  }, [selectedMonHoc, calculateAvailableQuestions]);

  // Xử lý khi chọn môn học
  const handleMonHocChange = (value: string) => {
    setSelectedMonHoc(value);
    const currentKhoiKienThucs = form.getFieldValue('khoiKienThucs');
    if (!currentKhoiKienThucs || currentKhoiKienThucs.length === 0) {
      form.setFieldsValue({ khoiKienThucs: [{}] });
    }
  };

  // Xử lý khi chọn khối kiến thức
  const handleKhoiKienThucChange = (fieldName: number) => {
    const currentValues = form.getFieldValue('khoiKienThucs');
    currentValues[fieldName] = {
      ...currentValues[fieldName],
      cauHoiDe: 0,
      cauHoiTrungBinh: 0,
      cauHoiKho: 0
    };
    form.setFieldsValue({ khoiKienThucs: currentValues });
  };

  // Kiểm tra số lượng câu hỏi hợp lệ
  const validateQuestionCount = (values: DeThiFormData) => {
    for (const kkt of values.khoiKienThucs) {
      const available = availableQuestions.get(kkt.khoiKienThucId);
      if (!available) continue;

      if (kkt.cauHoiDe > available.easy ||
        kkt.cauHoiTrungBinh > available.medium ||
        kkt.cauHoiKho > available.hard) {
        return false;
      }
    }
    return true;
  };

  const handleCreateDeThi = async (values: DeThiFormData) => {
    try {
      if (!validateQuestionCount(values)) {
        message.error('Số lượng câu hỏi yêu cầu vượt quá số câu hỏi có sẵn!');
        return;
      }

      const newDeThi: DeThi = {
        id: Date.now().toString(),
        monHocId: values.monHocId,
        monHocName: monHocs.find(mh => mh.id === values.monHocId)?.name || '',
        khoiKienThucs: values.khoiKienThucs.map(kkt => ({
          ...kkt,
          khoiKienThucName: khoiKienThucs.find(k => k.id === kkt.khoiKienThucId)?.name || '',
        })),
        createdAt: new Date(),
      };

      setSelectedDeThi(newDeThi);
      setIsModalVisible(false);
      setIsViewModalVisible(true);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo đề thi!');
    }
  };

  const handleSaveDeThi = (deThi: DeThi) => {
    const existingIndex = deThis.findIndex(dt => dt.id === deThi.id);
    if (existingIndex >= 0) {
      const updatedDeThis = [...deThis];
      updatedDeThis[existingIndex] = deThi;
      setDeThis(updatedDeThis);
    } else {
      setDeThis([...deThis, deThi]);
    }
    setIsViewModalVisible(false);
    setSelectedDeThi(null);
    message.success('Lưu đề thi thành công!');
  };

  const handleEditDeThi = (deThi: DeThi) => {
    setSelectedDeThi(deThi);
    setIsViewModalVisible(true);
  };

  const handleDeleteDeThi = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề thi này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setDeThis(deThis.filter(dt => dt.id !== id));
        message.success('Xóa đề thi thành công!');
      },
    });
  };

  return (
    <div className={styles.container}>
      <h1>Quản lý đề thi</h1>

      <div className={styles.actionBar}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Tạo đề thi mới
        </Button>
      </div>

      <DeThiTable
        deThis={deThis}
        onEdit={handleEditDeThi}
        onDelete={handleDeleteDeThi}
      />

      <Modal
        title="Tạo đề thi mới"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedMonHoc('');
        }}
        footer={null}
        width={800}
      >
        <CreateDeThiForm
          form={form}
          monHocs={monHocs}
          filteredKhoiKienThucs={filteredKhoiKienThucs}
          selectedMonHoc={selectedMonHoc}
          availableQuestions={availableQuestions}
          onMonHocChange={handleMonHocChange}
          onKhoiKienThucChange={handleKhoiKienThucChange}
          onFinish={handleCreateDeThi}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setSelectedMonHoc('');
          }}
        />
      </Modal>

      <ViewDeThi
        visible={isViewModalVisible}
        deThi={selectedDeThi || {
          id: '',
          monHocId: '',
          monHocName: '',
          khoiKienThucs: []
        }}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedDeThi(null);
        }}
        onSave={handleSaveDeThi}
      />
    </div>
  );
};

export default DeThiPage;