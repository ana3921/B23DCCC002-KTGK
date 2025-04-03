import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { Course, CourseStatus } from '@/models/KTGK/types';
import TinyEditor from '@/components/TinyEditor';

interface CourseFormProps {
  visible: boolean;
  onCancel: () => void;
  editingCourse: Course | null;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  onCancel,
  editingCourse,
  courses,
  setCourses,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingCourse) {
        form.setFieldsValue(editingCourse);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: CourseStatus.ACTIVE, studentCount: 0 });
      }
    }
  }, [editingCourse, form, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Check for duplicate name - this logic is duplicated from the model
      const isDuplicate = courses.some(
        course => course.name === values.name && (!editingCourse || course.id !== editingCourse.id)
      );
      if (isDuplicate) {
        message.error('Tên khóa học đã tồn tại');
        return;
      }

      if (editingCourse) {
        // Update existing course
        const updatedCourses = courses.map(course =>
          course.id === editingCourse.id ? { ...editingCourse, ...values } : course
        );
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        message.success('Cập nhật khóa học thành công');
      } else {
        // Add new course
        const newCourse = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
        };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        message.success('Thêm khóa học thành công');
      }

      onCancel();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: CourseStatus.ACTIVE }}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học tối đa 100 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select placeholder="Chọn giảng viên">
            <Select.Option value="Giảng viên 1">Giảng viên 1</Select.Option>
            <Select.Option value="Giảng viên 2">Giảng viên 2</Select.Option>
            <Select.Option value="Giảng viên 3">Giảng viên 3</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {Object.values(CourseStatus).map(status => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
        >
          <TinyEditor />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;