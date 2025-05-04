import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Divider, Tag } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { userService, User } from '../services/userService';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    activeJobs: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      // 这里应该调用获取用户统计信息的API
      setStats({
        totalApplications: 12,
        interviews: 5,
        offers: 2,
        activeJobs: 3
      });
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!user) {
    return <div>无法加载用户信息</div>;
  }

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        {/* 个人信息卡片 */}
        <Col span={24}>
          <Card>
            <div className="flex items-center space-x-6">
              <Avatar size={100} icon={<UserOutlined />} />
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <MailOutlined className="mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    <span>注册时间: 2024-01-01</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 统计信息 */}
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总申请数"
                  value={stats.totalApplications}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="面试次数"
                  value={stats.interviews}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="收到Offer"
                  value={stats.offers}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="进行中的职位"
                  value={stats.activeJobs}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 最近活动 */}
        <Col span={24}>
          <Card title="最近活动">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">申请了高级前端工程师职位</span>
                  <div className="text-gray-500 text-sm">Google · 2天前</div>
                </div>
                <Tag color="blue">已投递</Tag>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">收到了面试邀请</span>
                  <div className="text-gray-500 text-sm">Microsoft · 5天前</div>
                </div>
                <Tag color="green">面试中</Tag>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">更新了简历</span>
                  <div className="text-gray-500 text-sm">个人简历 · 1周前</div>
                </div>
                <Tag color="purple">已更新</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage; 