import { useState } from 'react';
import { Card, Input, Button, List, Modal, Form, Select, Divider, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useSubjects from '@/models/bai2/useSubjects';

const { Option } = Select;

export default function SubjectsTab() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [customSubject, setCustomSubject] = useState(false);

  const defaultSubjects = [
    "Toán", "Lý", "Hóa", "Sinh", "Văn", "Sử", "Địa", "Ngoại ngữ", "Khác"
  ];

  const handleAdd = (values: { name: string; description?: string }) => {
    if (subjects.includes(values.name)) {
      message.error('Môn học này đã tồn tại!');
      return;
    }
    addSubject(values.name);
    setIsModalVisible(false);
    form.resetFields();
    setCustomSubject(false);
    message.success('Thêm môn học thành công!');
  };

  const showEditModal = (subject: string) => {
    setEditingSubject(subject);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({ name: subject });
  };

  const handleEdit = (values: { name: string; description?: string }) => {
    if (values.name !== editingSubject && subjects.includes(values.name)) {
      message.error('Môn học này đã tồn tại!');
      return;
    }
    updateSubject(editingSubject, values.name);
    setIsEditModalVisible(false);
    editForm.resetFields();
    message.success('Cập nhật môn học thành công!');
  };

  const handleDelete = (subject: string) => {
    deleteSubject(subject);
    message.success('Xóa môn học thành công!');
  };

  return (
    <Card>
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Thêm môn học
        </Button>
      </div>

      <List
        dataSource={subjects}
        renderItem={(subject) => (
          <List.Item
            actions={[
              <Button 
                icon={<EditOutlined />} 
                type="link" 
                onClick={() => showEditModal(subject)}
              />,
              <Button 
                icon={<DeleteOutlined />} 
                type="link" 
                danger 
                onClick={() => handleDelete(subject)}
              />
            ]}
          >
            {subject}
          </List.Item>
        )}
      />

      {/* Modal Thêm môn học */}
      <Modal
        title="Thêm môn học mới"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setCustomSubject(false);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            {customSubject ? (
              <Input placeholder="Tên môn học" />
            ) : (
              <Select 
                placeholder="Chọn môn học" 
                onChange={(value) => value === 'Khác' && setCustomSubject(true)}
                showSearch
                allowClear
              >
                {defaultSubjects.map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Mô tả môn học (tùy chọn)" rows={3} />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
            <Button 
              style={{ marginLeft: '8px' }} 
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setCustomSubject(false);
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Sửa môn học */}
      <Modal
        title="Sửa môn học"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input placeholder="Tên môn học" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Mô tả môn học (tùy chọn)" rows={3} />
          </Form.Item>
          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button 
              style={{ marginLeft: '8px' }} 
              onClick={() => {
                setIsEditModalVisible(false);
                editForm.resetFields();
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}