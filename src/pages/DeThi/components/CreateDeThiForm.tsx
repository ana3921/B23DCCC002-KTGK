import React from 'react';
import { Form, Select, InputNumber, Button, Card, Row, Col, Alert, Tag, Empty } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { DeThiFormData, QuestionCount } from '../interfaces';
import styles from '../styles.less';

const { Option } = Select;

interface CreateDeThiFormProps {
  form: any;
  monHocs: any[];
  filteredKhoiKienThucs: any[];
  selectedMonHoc: string;
  availableQuestions: Map<string, QuestionCount>;
  onMonHocChange: (value: string) => void;
  onKhoiKienThucChange: (index: number) => void;
  onFinish: (values: DeThiFormData) => void;
  onCancel: () => void;
}

const CreateDeThiForm: React.FC<CreateDeThiFormProps> = ({
  form,
  monHocs,
  filteredKhoiKienThucs,
  selectedMonHoc,
  availableQuestions,
  onMonHocChange,
  onKhoiKienThucChange,
  onFinish,
  onCancel,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.deThiForm}
    >
      {monHocs.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có môn học nào. Vui lòng thêm môn học trước khi tạo đề thi."
        />
      ) : (
        <>
          <Form.Item
            name="monHocId"
            label="Môn học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
          >
            <Select 
              placeholder="Chọn môn học"
              onChange={onMonHocChange}
            >
              {monHocs.map(monHoc => (
                <Option key={monHoc.id} value={monHoc.id}>
                  {monHoc.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedMonHoc && filteredKhoiKienThucs.length === 0 && (
            <Alert
              message="Không có khối kiến thức"
              description="Môn học này chưa có khối kiến thức nào. Vui lòng thêm khối kiến thức cho môn học trước khi tạo đề thi."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.List name="khoiKienThucs">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key}
                    title={`Khối kiến thức ${index + 1}`}
                    extra={
                      fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      )
                    }
                    className={styles.khoiKienThucCard}
                  >
                    <Form.Item
                      {...field}
                      label="Chọn khối kiến thức"
                      name={[field.name, 'khoiKienThucId']}
                      rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
                    >
                      <Select 
                        placeholder="Chọn khối kiến thức"
                        disabled={!selectedMonHoc}
                        onChange={() => onKhoiKienThucChange(index)}
                      >
                        {filteredKhoiKienThucs.map(kkt => (
                          <Option key={kkt.id} value={kkt.id}>
                            {kkt.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        const prev = prevValues.khoiKienThucs?.[field.name]?.khoiKienThucId;
                        const curr = curValues.khoiKienThucs?.[field.name]?.khoiKienThucId;
                        return prev !== curr;
                      }}
                    >
                      {({ getFieldValue }) => {
                        const khoiKienThucId = getFieldValue(['khoiKienThucs', field.name, 'khoiKienThucId']);
                        const available = availableQuestions.get(khoiKienThucId);

                        if (!khoiKienThucId) {
                          return null;
                        }

                        if (!available || (available.easy === 0 && available.medium === 0 && available.hard === 0)) {
                          return (
                            <Alert
                              message="Không có câu hỏi"
                              description="Khối kiến thức này chưa có câu hỏi nào. Vui lòng thêm câu hỏi trước khi tạo đề thi."
                              type="warning"
                              showIcon
                              className={styles.questionAlert}
                            />
                          );
                        }

                        return (
                          <Alert
                            message="Số lượng câu hỏi có sẵn"
                            description={
                              <div>
                                <p>Dễ: <Tag color="success">{available.easy}</Tag></p>
                                <p>Trung bình: <Tag color="warning">{available.medium}</Tag></p>
                                <p>Khó: <Tag color="error">{available.hard}</Tag></p>
                              </div>
                            }
                            type="info"
                            showIcon
                            className={styles.questionAlert}
                          />
                        );
                      }}
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label="Số câu dễ"
                          name={[field.name, 'cauHoiDe']}
                          rules={[{ required: true, message: 'Vui lòng nhập số câu dễ!' }]}
                        >
                          <InputNumber 
                            min={0} 
                            max={availableQuestions.get(
                              form.getFieldValue(['khoiKienThucs', field.name, 'khoiKienThucId'])
                            )?.easy || 0}
                            style={{ width: '100%' }} 
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label="Số câu trung bình"
                          name={[field.name, 'cauHoiTrungBinh']}
                          rules={[{ required: true, message: 'Vui lòng nhập số câu trung bình!' }]}
                        >
                          <InputNumber 
                            min={0} 
                            max={availableQuestions.get(
                              form.getFieldValue(['khoiKienThucs', field.name, 'khoiKienThucId'])
                            )?.medium || 0}
                            style={{ width: '100%' }} 
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          label="Số câu khó"
                          name={[field.name, 'cauHoiKho']}
                          rules={[{ required: true, message: 'Vui lòng nhập số câu khó!' }]}
                        >
                          <InputNumber 
                            min={0} 
                            max={availableQuestions.get(
                              form.getFieldValue(['khoiKienThucs', field.name, 'khoiKienThucId'])
                            )?.hard || 0}
                            style={{ width: '100%' }} 
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    disabled={!selectedMonHoc || filteredKhoiKienThucs.length === 0}
                  >
                    Thêm khối kiến thức
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className={styles.formActions}>
            <Button type="default" onClick={onCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              disabled={!selectedMonHoc || filteredKhoiKienThucs.length === 0}
            >
              Tạo đề thi
            </Button>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default CreateDeThiForm; 