import React, { useState } from 'react';
import { Table, Form, Input, Button, Select, Modal, Card, Tag, Space, message, Collapse, Typography, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useKhoiKienThuc from '@/models/KhoiKienThuc/kienthuc';
import KhoiKienThucForm from './KhoiKienThucForm';
import { useModel } from 'umi';

const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select;

const KhoiKienThucPage: React.FC = () => {
  const {
    khoiKienThucs,
    monHocs,
    getKhoiKienThucsByMonHoc,
    addKhoiKienThuc,
    updateKhoiKienThuc,
    deleteKhoiKienThuc
  } =  useModel('KhoiKienThuc.kienthuc');

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMonHocId, setSelectedMonHocId] = useState<string | null>(null);

  const handleAdd = (monHocId: string) => {
    setSelectedMonHocId(monHocId);
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ monHocId });
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setSelectedMonHocId(record.monHocId);
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khối kiến thức này?',
      onOk: () => {
        deleteKhoiKienThuc(id);
        message.success('Xóa thành công');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        updateKhoiKienThuc(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        addKhoiKienThuc(values);
        message.success('Thêm mới thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Tên khối kiến thức',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isRequired',
      key: 'isRequired',
      render: (isRequired: boolean) => (
        <Tag color={isRequired ? 'red' : 'green'}>
          {isRequired ? 'Bắt buộc' : 'Tự chọn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Quản lý khối kiến thức">
        {monHocs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text>Chưa có môn học nào.</Text>
                <br />
                <Text type="secondary">Vui lòng thêm môn học trước khi quản lý khối kiến thức.</Text>
              </div>
            }
          />
        ) : (
          <Collapse defaultActiveKey={['1']}>
            {monHocs.map(monHoc => (
              <Panel 
                header={
                  <Space>
                    <Text strong>{monHoc.name}</Text>
                    <Text type="secondary">({getKhoiKienThucsByMonHoc(monHoc.id).length} khối kiến thức)</Text>
                    <Text type="secondary">- {monHoc.credits} tín chỉ</Text>
                  </Space>
                } 
                key={monHoc.id}
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(monHoc.id);
                    }}
                  >
                    Thêm khối kiến thức
                  </Button>
                }
              >
                {getKhoiKienThucsByMonHoc(monHoc.id).length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <Text type="secondary">
                        Môn học này chưa có khối kiến thức nào.
                        Nhấn nút "Thêm khối kiến thức" để bắt đầu.
                      </Text>
                    }
                  />
                ) : (
                  <Table 
                    columns={columns} 
                    dataSource={getKhoiKienThucsByMonHoc(monHoc.id)} 
                    rowKey="id"
                    pagination={false}
                  />
                )}
              </Panel>
            ))}
          </Collapse>
        )}
      </Card>

      <KhoiKienThucForm 
        form={form}
        monHocs={monHocs}
        isModalVisible={isModalVisible}
        editingId={editingId}
        selectedMonHocId={selectedMonHocId}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingId(null);
          form.resetFields();
        }}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default KhoiKienThucPage;
