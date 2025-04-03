import React, { useState } from 'react';
import { Table, Form, Input, Button, InputNumber, Card, Space, Typography, message, Popconfirm, Modal } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useMonHocs, { MonHoc } from '@/models/monhoc/monHoc';
import styles from './styles.module.less';
import { ColumnType } from 'antd/lib/table';

const { Title } = Typography;

const MonHocPage = () => {
	const { monHocs, addMonHoc, updateMonHoc, deleteMonHoc } = useMonHocs();
	const [form] = Form.useForm();
	const [editingMonHoc, setEditingMonHoc] = useState<MonHoc | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingMonHoc(null);
		form.resetFields();
	};

	const handleEdit = (monHoc: MonHoc) => {
		setEditingMonHoc(monHoc);
		form.setFieldsValue(monHoc);
		showModal();
	};

	const handleSave = (values: Omit<MonHoc, 'id'>) => {
		if (editingMonHoc) {
			updateMonHoc(editingMonHoc.id, values);
			message.success('Cập nhật môn học thành công!');
		} else {
			addMonHoc(values);
			message.success('Thêm môn học thành công!');
		}
		handleCancel();
	};

	const handleDelete = (id: string) => {
		deleteMonHoc(id);
		message.success('Xóa môn học thành công!');
	};

	const confirmSave = (values: Omit<MonHoc, 'id'>) => {
		Modal.confirm({
			title: 'Xác nhận lưu',
			content: 'Bạn có chắc chắn muốn lưu các thay đổi?',
			onOk: () => handleSave(values),
		});
	};

	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
			key: 'stt',
			align: 'center',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên môn học',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			align: 'center',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'credits',
			key: 'credits',
			align: 'center',
			width: 100,
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center',
			width: 100,
			render: (_: any, record: MonHoc) => (
				<Space size='middle'>
					<Button icon={<EditOutlined />} type='link' onClick={() => handleEdit(record)} />
					<Popconfirm title='Bạn có chắc chắn muốn xóa môn học này?' onConfirm={() => handleDelete(record.id)}>
						<Button icon={<DeleteOutlined />} type='link' danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card className={styles.card}>
			<Space direction='vertical' size='large' className={styles.Space_wrapper}>
				<Title level={3}>Danh mục môn học</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={showModal}>
					Thêm môn học
				</Button>
				<Table
					dataSource={monHocs}
					columns={columns as ColumnType<MonHoc>[]}
					rowKey='id'
					pagination={{ showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'] }}
				/>
			</Space>
			<Modal
				title={editingMonHoc ? 'Chỉnh sửa môn học' : 'Thêm môn học'}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form form={form} onFinish={editingMonHoc ? confirmSave : handleSave} layout='vertical'>
					<Form.Item name='name' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
						<Input placeholder='Tên môn học' />
					</Form.Item>
					<Form.Item name='description' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<Input placeholder='Mô tả' />
					</Form.Item>
					<Form.Item name='credits' rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}>
						<InputNumber min={1} placeholder='Số tín chỉ' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
							{editingMonHoc ? 'Lưu' : 'Thêm môn học'}
						</Button>
						<Button style={{ marginLeft: 8 }} onClick={handleCancel}>
							Hủy
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default MonHocPage;
