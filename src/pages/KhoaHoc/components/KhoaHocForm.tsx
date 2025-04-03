import React, { useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber } from 'antd';
import { KhoaHoc } from '@/models/khoaHoc';

interface Props {
  khoaHoc: KhoaHoc | null;
  onSave: (khoaHoc: KhoaHoc) => void;
}

const KhoaHocForm: React.FC<Props> = ({ khoaHoc, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (khoaHoc) {
      form.setFieldsValue(khoaHoc);
    } else {
      form.resetFields();
    }
  }, [khoaHoc, form]);

  const handleFinish = (values: any) => {
    onSave({
      ...values,
      trangThai: values.trangThai || 'DangMo', // Default trạng thái nếu không chọn
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        trangThai: 'DangMo',
      }}
    >
      <Form.Item
        name="tenKhoaHoc"
        label="Tên khóa học"
        rules={[
          { required: true, message: 'Vui lòng nhập tên khóa học' },
          { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' },
        ]}
      >
        <Input placeholder="Nhập tên khóa học" />
      </Form.Item>

      <Form.Item
        name="giangVien"
        label="Giảng viên"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
      >
        <Select placeholder="Chọn giảng viên">
          <Select.Option value="Nguyen Van A">Nguyễn Văn A</Select.Option>
          <Select.Option value="Tran Thi B">Trần Thị B</Select.Option>
          <Select.Option value="Le Van C">Lê Văn C</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="soLuongHocVien"
        label="Số lượng học viên"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng học viên" />
      </Form.Item>

      <Form.Item
        name="moTa"
        label="Mô tả khóa học"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
      >
        <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học" />
      </Form.Item>

      <Form.Item
        name="trangThai"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Select.Option value="DangMo">Đang mở</Select.Option>
          <Select.Option value="DaKetThuc">Đã kết thúc</Select.Option>
          <Select.Option value="TamDung">Tạm dừng</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KhoaHocForm;