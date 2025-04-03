import { Button, Modal, Space, Typography, List, Tag, Divider, Row, Col, Card, Descriptions } from 'antd';
import { SwapOutlined, DeleteOutlined } from '@ant-design/icons';
import { DeThi, CauHoi } from '@/models/DeThi/deThi';
import { MonHoc } from '@/models/Monhoc/monHoc';
import { KhoiKienThuc } from '@/models/KhoiKienThuc/kienthuc';

const { Title } = Typography;

interface ViewModalProps {
  visible: boolean;
  deThi: DeThi | null;
  monHocs: MonHoc[];
  khoiKienThucs: KhoiKienThuc[];
  onCancel: () => void;
  onSave: () => void;
  onChangeQuestion: (question: CauHoi, index: number) => void;
  onDeleteQuestion: (index: number) => void;
  onAddQuestion: (type: 'basic' | 'advanced', level: 'easy' | 'medium' | 'hard') => void;
}

const ViewModal: React.FC<ViewModalProps> = ({
  visible,
  deThi,
  monHocs,
  khoiKienThucs,
  onCancel,
  onSave,
  onChangeQuestion,
  onDeleteQuestion,
  onAddQuestion,
}) => {
  const getMonHoc = (monHocId: string) => {
    return monHocs.find(mh => mh.id === monHocId);
  };

  const getKhoiKienThuc = (khoiKienThucId: string) => {
    return khoiKienThucs.find(kkt => kkt.id === khoiKienThucId);
  };

  return (
    <Modal
      title="Xem đề thi"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>Đóng</Button>,
        <Button key="save" type="primary" onClick={onSave}>Lưu thay đổi</Button>
      ]}
      width={800}
    >
      {deThi && (
        <div>
          <Title level={4}>{deThi.title}</Title>
          
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Môn học">
              {getMonHoc(deThi.monHocId)?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Khối kiến thức">
              {getKhoiKienThuc(deThi.khoiKienThucId)?.name}
              {getKhoiKienThuc(deThi.khoiKienThucId)?.isRequired && 
                <Tag color="red" style={{ marginLeft: 8 }}>Bắt buộc</Tag>
              }
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Câu hỏi cơ bản">
                <List
                  dataSource={deThi.questions.filter(q => q.type === 'basic')}
                  renderItem={(question, index) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="text" 
                          icon={<SwapOutlined />}
                          onClick={() => onChangeQuestion(question, index)}
                        >
                          Đổi câu
                        </Button>,
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => onDeleteQuestion(index)}
                        >
                          Xóa
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={`Câu ${index + 1}`}
                        description={
                          <Space>
                            <Tag color={question.level === 'easy' ? 'green' : question.level === 'medium' ? 'orange' : 'red'}>
                              {question.level === 'easy' ? 'Dễ' : question.level === 'medium' ? 'Trung bình' : 'Khó'}
                            </Tag>
                            <span>{question.question}</span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
                <Button 
                  type="dashed" 
                  block 
                  onClick={() => onAddQuestion('basic', 'easy')}
                  style={{ marginTop: 16 }}
                >
                  Thêm câu hỏi cơ bản
                </Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Câu hỏi nâng cao">
                <List
                  dataSource={deThi.questions.filter(q => q.type === 'advanced')}
                  renderItem={(question, index) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="text" 
                          icon={<SwapOutlined />}
                          onClick={() => onChangeQuestion(question, index + deThi.questions.filter(q => q.type === 'basic').length)}
                        >
                          Đổi câu
                        </Button>,
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => onDeleteQuestion(index + deThi.questions.filter(q => q.type === 'basic').length)}
                        >
                          Xóa
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={`Câu ${index + 1}`}
                        description={
                          <Space>
                            <Tag color={question.level === 'easy' ? 'green' : question.level === 'medium' ? 'orange' : 'red'}>
                              {question.level === 'easy' ? 'Dễ' : question.level === 'medium' ? 'Trung bình' : 'Khó'}
                            </Tag>
                            <span>{question.question}</span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
                <Button 
                  type="dashed" 
                  block 
                  onClick={() => onAddQuestion('advanced', 'easy')}
                  style={{ marginTop: 16 }}
                >
                  Thêm câu hỏi nâng cao
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default ViewModal;
