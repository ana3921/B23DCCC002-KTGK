import { useState } from 'react';
import { Card, Form, InputNumber, List, Button, Typography, Space, message, Modal } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import useGoals from '@/models/bai2/useGoals';
import useSubjects from '@/models/bai2/useSubjects';

const { Title, Text } = Typography;

export default function GoalsTab() {
    const { goals, updateGoal } = useGoals();
    const { subjects } = useSubjects();
    const [form] = Form.useForm();
    const [editingSubject, setEditingSubject] = useState<string | null>(null);

    const handleEdit = (subject: string) => {
        setEditingSubject(subject);
        form.setFieldsValue({ hours: goals[subject] || 0 });
    };

    const handleSave = (values: { hours: number }) => {
        if (editingSubject) {
            updateGoal(editingSubject, values.hours);
            setEditingSubject(null);
            message.success('Cập nhật mục tiêu thành công!');
        }
    };

    return (
        <div className="p-4">
            <Card className="w-full" style={{ maxWidth: '100%' }}>
                <Title level={3} style={{ marginBottom: '20px' }}>Mục Tiêu Học Tập</Title>
                <List
                    dataSource={subjects}
                    renderItem={(subject) => (
                        <List.Item
                            style={{
                                padding: '12px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                flex: 1,
                                minWidth: 0, // Quan trọng để text có thể tự wrap
                                marginRight: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}>
                                    <Text
                                        strong
                                        style={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        {subject}
                                    </Text>
                                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
                                        Mục tiêu: {goals[subject] || 0} giờ
                                    </Text>
                                </div>
                            </div>
                            <Button
                                icon={<EditOutlined />}
                                type="link"
                                onClick={() => handleEdit(subject)}
                                style={{ flexShrink: 0 }}
                            />
                        </List.Item>
                    )}
                />

                <Modal
                    title={
                        <div style={{ wordBreak: 'break-word' }}>
                            Cập nhật mục tiêu cho môn {editingSubject}
                        </div>
                    }
                    visible={!!editingSubject}
                    onCancel={() => setEditingSubject(null)}
                    footer={null}
                    width={320}
                >
                    <Form
                        form={form}
                        onFinish={handleSave}
                        layout="vertical"
                        style={{ marginTop: '20px' }}
                    >
                        <Form.Item
                            name="hours"
                            rules={[{ required: true, message: 'Vui lòng nhập số giờ mục tiêu!' }]}
                        >
                            <InputNumber
                                placeholder="Số giờ mục tiêu"
                                style={{ width: '100%' }}
                                min={0}
                                step={1}
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                >
                                    Lưu
                                </Button>
                                <Button onClick={() => setEditingSubject(null)}>
                                    Hủy
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
}