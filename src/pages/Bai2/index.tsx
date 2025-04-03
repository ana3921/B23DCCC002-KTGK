import { Tabs } from 'antd';
import SubjectsTab from './components/SubjectsTab';
import ProgressTab from './components/ProgressTab';
import GoalsTab from './components/GoalTab';

const { TabPane } = Tabs;

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quản lý Học tập</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý Môn học" key="1">
          <SubjectsTab />
        </TabPane>
        <TabPane tab="Tiến độ Học tập" key="2">
          <ProgressTab />
        </TabPane>
        <TabPane tab="Mục tiêu Học tập" key="3">
          <GoalsTab />
        </TabPane>
      </Tabs>
    </div>
  );
}

