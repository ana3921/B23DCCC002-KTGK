import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { DeThi } from '@/models/DeThi/deThi';
import { MonHoc } from '@/models/Monhoc/monHoc';
import { KhoiKienThuc } from '@/models/KhoiKienThuc/kienthuc';

const { Option } = Select;

interface AddEditModalProps {
  visible: boolean;
  editingDeThi: DeThi | null;
  monHocs: MonHoc[];
  khoiKienThucs: KhoiKienThuc[];
  form: any;
  onCancel: () => void;
  onSave: (values: any) => void;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
  visible,
  editingDeThi,
  monHocs,
  khoiKienThucs,
  form,
  onCancel,
  onSave,
}) => {
  useEffect(() => {
    if (visible && editingDeThi) {
      form.setFieldsValue({
        title: editingDeThi.title,
        monHocId: editingDeThi.monHocId,
        khoiKienThucId: editingDeThi.khoiKienThucId,
        basicEasyCount: 0,
        basicMediumCount: 0,
        basicHardCount: 0,
        advancedEasyCount: 0,
        advancedMediumCount: 0,
        advancedHardCount: 0,
      });
    } else {
      form.resetFields();
    }
  }, [visible, editingDeThi, form]);

  const getKhoiKienThucsByMonHoc = (monHocId: string) => {
    return khoiKienThucs.filter(kkt => kkt.monHocId === monHocId);
  };

  return (
    <Modal
      title={editingDeThi ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="monHocId"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
        >
          <Select placeholder="Chọn môn học">
            {monHocs.map(monHoc => (
              <Option key={monHoc.id} value={monHoc.id}>
                {monHoc.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="khoiKienThucId"
          label="Khối kiến thức"
          rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
        >
          <Select 
            placeholder="Chọn khối kiến thức"
            disabled={!form.getFieldValue('monHocId')}
          >
            {getKhoiKienThucsByMonHoc(form.getFieldValue('monHocId')).map(kkt => (
              <Option key={kkt.id} value={kkt.id}>
                {kkt.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Số lượng câu hỏi cơ bản">
          <Form.Item
            name="basicEasyCount"
            label="Dễ"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="basicMediumCount"
            label="Trung bình"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="basicHardCount"
            label="Khó"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Số lượng câu hỏi nâng cao">
          <Form.Item
            name="advancedEasyCount"
            label="Dễ"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="advancedMediumCount"
            label="Trung bình"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="advancedHardCount"
            label="Khó"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
