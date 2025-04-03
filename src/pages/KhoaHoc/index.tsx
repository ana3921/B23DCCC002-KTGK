import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Select, Tag, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Course, CourseStatus } from '@/models/KTGK/types';
import CourseForm from './components/CourseForm';

const { Search } = Input;

const KhoaHocPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | ''>('');
  const [instructorFilter, setInstructorFilter] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    try {
      const data = localStorage.getItem('courses');
      if (data) {
        setCourses(JSON.parse(data));
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (course: Course) => {
    if (course.studentCount > 0) {
      message.error('Không thể xóa khóa học đã có học viên');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khóa học này?',
      onOk() {
        const newCourses = courses.filter(c => c.id !== course.id);
        setCourses(newCourses);
        localStorage.setItem('courses', JSON.stringify(newCourses));
        message.success('Xóa khóa học thành công');
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string, record) => 
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      filteredValue: instructorFilter ? [instructorFilter] : null,
      onFilter: (value: string, record) => 
        record.instructor.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a, b) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: string, record) => record.status === value,
      render: (status: CourseStatus) => (
        <Tag color={
          status === CourseStatus.ACTIVE ? 'success' :
          status === CourseStatus.PAUSED ? 'warning' : 
          'error'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space>
          <Button 
            type="link" 
            onClick={() => {
              setEditingCourse(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDelete(record)}
            disabled={record.studentCount > 0}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên khóa học"
          onSearch={value => setSearchText(value)}
          style={{ width: 300 }}
          allowClear
        />
        
        <Select
          allowClear
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          onChange={value => setStatusFilter(value)}
        >
          {Object.values(CourseStatus).map(status => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Lọc theo giảng viên"
          style={{ width: 200 }}
          onChange={value => setInstructorFilter(value)}
        >
          {Array.from(new Set(courses.map(c => c.instructor))).map(instructor => (
            <Select.Option key={instructor} value={instructor}>
              {instructor}
            </Select.Option>
          ))}
        </Select>

        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCourse(null); // Reset editingCourse
            setIsModalVisible(true); // Ensure modal is visible
          }}
        >
          Thêm khóa học
        </Button>
      </Space>

      <Table 
        columns={columns}
        dataSource={courses}
        rowKey="id"
        loading={loading}
      />

      <CourseForm
        visible={isModalVisible} // Pass isModalVisible to visible prop
        onCancel={() => {
          setIsModalVisible(false); // Close modal on cancel
          setEditingCourse(null); // Reset editingCourse
        }}
        editingCourse={editingCourse}
        courses={courses}
        setCourses={setCourses}
      />
    </div>
  );
};

export default KhoaHocPage;