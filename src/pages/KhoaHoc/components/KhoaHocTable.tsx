import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Tag } from 'antd';
import { KhoaHoc } from '@/models/khoaHoc';

interface Props {
  khoaHocList: KhoaHoc[];
  onEdit: (khoaHoc: KhoaHoc) => void;
  onDelete: (id: number) => void;
}

const KhoaHocTable: React.FC<Props> = ({ khoaHocList, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterGiangVien, setFilterGiangVien] = useState<string | undefined>();
  const [filterTrangThai, setFilterTrangThai] = useState<string | undefined>();

  const filteredData = khoaHocList.filter((khoaHoc) => {
    return (
      khoaHoc.tenKhoaHoc.toLowerCase().includes(search.toLowerCase()) &&
      (!filterGiangVien || khoaHoc.giangVien === filterGiangVien) &&
      (!filterTrangThai || khoaHoc.trangThai === filterTrangThai)
    );
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      sorter: (a: KhoaHoc, b: KhoaHoc) => a.soLuongHocVien - b.soLuongHocVien,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: string) => {
        const color = trangThai === 'DangMo' ? 'green' : trangThai === 'DaKetThuc' ? 'red' : 'orange';
        return <Tag color={color}>{trangThai}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: KhoaHoc) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên khóa học"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Lọc theo giảng viên"
          allowClear
          onChange={(value) => setFilterGiangVien(value)}
        >
          {[...new Set(khoaHocList.map((khoaHoc) => khoaHoc.giangVien))].map((giangVien) => (
            <Select.Option key={giangVien} value={giangVien}>
              {giangVien}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={(value) => setFilterTrangThai(value)}
        >
          <Select.Option value="DangMo">Đang mở</Select.Option>
          <Select.Option value="DaKetThuc">Đã kết thúc</Select.Option>
          <Select.Option value="TamDung">Tạm dừng</Select.Option>
        </Select>
      </Space>
      <Table dataSource={filteredData} columns={columns} rowKey="id" />
    </div>
  );
};

export default KhoaHocTable;