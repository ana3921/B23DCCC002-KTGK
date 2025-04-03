import { useState } from 'react';
import { Card, DatePicker, Form, Input, InputNumber, List, Select, Button, Typography, Space, Divider, Popconfirm, Row, Col, Modal } from "antd";
import { PlusOutlined, EditOutlined, ClockCircleOutlined, BookOutlined, FileTextOutlined, MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import useSubjects from "@/models/bai2/useSubjects";
import useProgress from "@/models/bai2/useProgress";
import dayjs from 'dayjs';

interface Progress {
    id: number;
    subject: string;
    date: string;
    duration: number;
    content?: string;
    notes?: string;
}

const { Title, Text } = Typography;
const { TextArea } = Input;

interface HandleAdd {
    date: any;
    id?: number;
    subject: string;
    duration: number;
    content?: string;
    notes?: string;
}

export default function ProgressTab() {
    const { subjects } = useSubjects();
    const { progress, addProgress, deleteProgress, updateProgress } = useProgress();
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingProgress, setEditingProgress] = useState<Progress | null>(null);

    const handleAdd = (values: HandleAdd) => {
        addProgress({
            id: Date.now(),
            ...values,
            date: values.date.format("YYYY-MM-DD"),
        });
        form.resetFields();
    };

    const handleEdit = (values: HandleAdd) => {
        if (editingProgress) {
            updateProgress(editingProgress.id, {
                ...values,
                date: values.date.format("YYYY-MM-DD"),
            });
            setEditingProgress(null);
            editForm.resetFields();
        }
    };

    const showEditModal = (item: Progress) => {
        setEditingProgress(item);
        editForm.setFieldsValue({
            ...item,
            date: dayjs(item.date),
        });
    };

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Title level={3}>Thêm Tiến Độ Học Tập</Title>
                <Form form={form} onFinish={handleAdd} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="subject"
                                rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
                            >
                                <Select placeholder="Chọn môn học" size="large">
                                    {subjects.map((subject) => (
                                        <Select.Option key={subject} value={subject}>
                                            {subject}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: "Vui lòng chọn ngày học" }]}
                            >
                                <DatePicker placeholder="Chọn ngày học" style={{ width: "100%" }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="duration" rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}>
                        <InputNumber
                            placeholder="Thời lượng (giờ)"
                            style={{ width: "100%" }}
                            size="large"
                            min={0}
                            step={0.5}
                            addonAfter="giờ"
                        />
                    </Form.Item>

                    <Form.Item name="content">
                        <TextArea placeholder="Nội dung đã học" rows={4} />
                    </Form.Item>

                    <Form.Item name="notes">
                        <TextArea placeholder="Ghi chú" rows={3} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />} size="large">
                            Thêm tiến độ
                        </Button>
                    </Form.Item>
                </Form>

                <Divider orientation="left">Lịch sử tiến độ</Divider>

                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={progress}
                    renderItem={(item: Progress, index: number) => (
                        <List.Item>
                            <Card hoverable>
                                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                    <Space>
                                        <Text strong>{index + 1}. </Text>
                                        <BookOutlined style={{ color: "#1890ff" }} />
                                        <Text strong>{item.subject}</Text>
                                        <Divider type="vertical" />
                                        <ClockCircleOutlined style={{ color: "#52c41a" }} />
                                        <Text>{item.date}</Text>
                                        <Button 
                                            icon={<EditOutlined />} 
                                            type="link" 
                                            onClick={() => showEditModal(item)}
                                        />
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa tiến độ này?"
                                            onConfirm={() => deleteProgress(item.id)}
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <Button icon={<DeleteOutlined />} type="link" danger />
                                        </Popconfirm>
                                    </Space>
                                    <Space align="start">
                                        <ClockCircleOutlined style={{ color: "#faad14" }} />
                                        <Text>Thời lượng: {item.duration} giờ</Text>
                                    </Space>
                                    {item.content && (
                                        <Space align="start">
                                            <FileTextOutlined style={{ color: "#722ed1" }} />
                                            <Text>Nội dung: {item.content}</Text>
                                        </Space>
                                    )}
                                    {item.notes && (
                                        <Space align="start">
                                            <MessageOutlined style={{ color: "#eb2f96" }} />
                                            <Text>Ghi chú: {item.notes}</Text>
                                        </Space>
                                    )}
                                </Space>
                            </Card>
                        </List.Item>
                    )}
                />
            </Space>

            <Modal
                title="Sửa tiến độ học tập"
                visible={!!editingProgress}
                onCancel={() => setEditingProgress(null)}
                footer={null}
            >
                <Form form={editForm} onFinish={handleEdit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="subject"
                                rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
                            >
                                <Select placeholder="Chọn môn học" size="large">
                                    {subjects.map((subject) => (
                                        <Select.Option key={subject} value={subject}>
                                            {subject}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="date"
                                rules={[{ required: true, message: "Vui lòng chọn ngày học" }]}
                            >
                                <DatePicker placeholder="Chọn ngày học" style={{ width: "100%" }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="duration" rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}>
                        <InputNumber
                            placeholder="Thời lượng (giờ)"
                            style={{ width: "100%" }}
                            size="large"
                            min={0}
                            step={0.5}
                            addonAfter="giờ"
                        />
                    </Form.Item>

                    <Form.Item name="content">
                        <TextArea placeholder="Nội dung đã học" rows={4} />
                    </Form.Item>

                    <Form.Item name="notes">
                        <TextArea placeholder="Ghi chú" rows={3} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                        <Button 
                            style={{ marginLeft: 8 }} 
                            onClick={() => setEditingProgress(null)}
                        >
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
