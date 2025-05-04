import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Switch, 
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import { userService, User, UpdateUserData, UpdatePasswordData } from '../services/userService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-settings-tabpanel-${index}`}
      aria-labelledby={`account-settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AccountSettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        username: userData.username,
        email: userData.email
      }));
    } catch (error) {
      setError('获取用户信息失败');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      setError(null);
      await userService.updateUser({
        username: formData.username,
        email: formData.email
      });
      setSuccess('用户信息更新成功');
      fetchUser();
    } catch (error) {
      setError('更新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      setError(null);
      await userService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccess('密码更新成功');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));
    } catch (error) {
      setError('更新密码失败');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>加载中...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            账号设置
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="基本信息" />
              <Tab label="安全设置" />
              <Tab label="通知设置" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
              <TextField
                fullWidth
                label="用户名"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="邮箱"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Button
                variant="contained"
                onClick={handleUpdateUser}
                disabled={loading}
              >
                保存更改
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
              <TextField
                fullWidth
                label="当前密码"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="新密码"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <Button
                variant="contained"
                onClick={handleUpdatePassword}
                disabled={loading}
              >
                修改密码
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ '& .MuiFormControlLabel-root': { mb: 2 } }}>
                <FormControlLabel
                  control={<Switch />}
                  label={
                    <Box>
                      <Typography variant="body1">两步验证</Typography>
                      <Typography variant="body2" color="text.secondary">
                        为您的账号添加额外的安全保护
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">登录提醒</Typography>
                      <Typography variant="body2" color="text.secondary">
                        当您的账号在新设备登录时发送通知
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                邮件通知
              </Typography>
              <Box sx={{ '& .MuiFormControlLabel-root': { mb: 2 } }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">职位申请状态更新</Typography>
                      <Typography variant="body2" color="text.secondary">
                        当您的职位申请状态发生变化时
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">面试邀请</Typography>
                      <Typography variant="body2" color="text.secondary">
                        当您收到新的面试邀请时
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">系统通知</Typography>
                      <Typography variant="body2" color="text.secondary">
                        重要的系统更新和公告
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                站内通知
              </Typography>
              <Box sx={{ '& .MuiFormControlLabel-root': { mb: 2 } }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">职位推荐</Typography>
                      <Typography variant="body2" color="text.secondary">
                        根据您的偏好推荐相关职位
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label={
                    <Box>
                      <Typography variant="body1">简历更新提醒</Typography>
                      <Typography variant="body2" color="text.secondary">
                        定期提醒您更新简历
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountSettingsPage; 