import { Card, InputNumber, Progress, List, Empty } from 'antd';
import useSubjects from '@/models/bai2/useSubjects';
import useGoals from '@/models/bai2/useGoals';
import useProgress from '@/models/bai2/useProgress';

export default function GoalsTab() {
  const { subjects } = useSubjects();
  const { goals, updateGoal } = useGoals();
  const { calculateMonthlyHours } = useProgress();

  const calculateProgress = (achieved: number, goal: number) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, (achieved / goal) * 100);
  };

  if (!subjects?.length) {
    return (
      <Card title={`Mục tiêu học tập - Tháng ${new Date().getMonth() + 1}`}>
        <Empty description="Chưa có môn học nào. Vui lòng thêm môn học trước." />
      </Card>
    );
  }

  return (
    <Card title={`Mục tiêu học tập - Tháng ${new Date().getMonth() + 1}`}>
      <List
        dataSource={subjects}
        renderItem={(subject) => {
          const goal = goals[subject] || 0;
          const achieved = calculateMonthlyHours(subject);
          const percent = calculateProgress(achieved, goal);

          return (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{subject}</span>
                  <InputNumber
                    min={0}
                    value={goal}
                    onChange={(value) => {
                      if (value !== null) {
                        updateGoal(subject, value);
                      }
                    }}
                    placeholder="Số giờ mục tiêu"
                    addonAfter="giờ"
                  />
                </div>
                <Progress
                  percent={Math.round(percent)}
                  format={() => `${achieved}/${goal} giờ (${Math.round(percent)}%)`}
                  status={achieved >= goal ? 'success' : 'active'}
                  strokeColor={achieved >= goal ? '#52c41a' : '#1890ff'}
                />
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
}