import React from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DeThi } from '../interfaces';
import styles from '../styles.less';

interface DeThiTableProps {
  deThis: DeThi[];
  onEdit: (deThi: DeThi) => void;
  onDelete: (id: string) => void;
}

const DeThiTable: React.FC<DeThiTableProps> = ({
  deThis,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: 'Môn học',
      dataIndex: 'monHocName',
      key: 'monHocName',
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'khoiKienThucs',
      key: 'khoiKienThucs',
      render: (khoiKienThucs: DeThi['khoiKienThucs']) => (
        <ul className={styles.khoiKienThucList}>
          {khoiKienThucs.map((kkt, index) => (
            <li key={index}>
              {kkt.khoiKienThucName} ({kkt.cauHoiDe + kkt.cauHoiTrungBinh + kkt.cauHoiKho} câu)
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Tổng số câu',
      key: 'totalQuestions',
      render: (record: DeThi) => 
        record.khoiKienThucs.reduce(
          (total, kkt) => total + kkt.cauHoiDe + kkt.cauHoiTrungBinh + kkt.cauHoiKho, 
          0
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DeThi) => (
        <div className={styles.actionButtons}>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={deThis}
      bordered
      className={styles.deThiTable}
    />
  );
};

export default DeThiTable;
