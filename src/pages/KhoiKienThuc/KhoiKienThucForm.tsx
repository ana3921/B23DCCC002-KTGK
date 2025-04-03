import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { MonHoc } from '@/models/KhoiKienThuc/kienthuc';

const { Option } = Select;

interface KhoiKienThucFormProps {
  form: FormInstance;
  monHocs: MonHoc[];
  isModalVisible: boolean;
  editingId: string | null;
  selectedMonHocId: string | null;
  onCancel: () => void;
  onOk: () => void;
}

const KhoiKienThucForm: React.FC<KhoiKienThucFormProps> = ({
  form,
  monHocs,
  isModalVisible,
  editingId,
  selectedMonHocId,
  onCancel,
  onOk
}) => {
  return (
    <Modal
      title={editingId ? "Chỉnh sửa khối kiến thức" : "Thêm khối kiến thức mới"}
      visible={isModalVisible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="monHocId"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select disabled={!!selectedMonHocId}>
            {monHocs.map(monHoc => (
              <Option key={monHoc.id} value={monHoc.id}>
                {monHoc.name} ({monHoc.credits} tín chỉ)
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên khối kiến thức"
          rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức' }]}
        >
          <Input placeholder="Nhập tên khối kiến thức" />
        </Form.Item>

        <Form.Item
          name="isRequired"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Select>
            <Option value={true}>Bắt buộc</Option>
            <Option value={false}>Tự chọn</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default KhoiKienThucForm;
