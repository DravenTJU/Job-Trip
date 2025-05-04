import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * 忘记密码页面组件
 */
const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // 处理邮箱输入变化
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  // 验证邮箱
  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError('请输入邮箱');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('请输入有效的邮箱地址');
      return false;
    }
    return true;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证邮箱
    if (!validateEmail()) {
      return;
    }
    
    // 设置加载状态
    setIsLoading(true);
    setError('');
    
    try {
      // 这里会调用忘记密码的API
      // const response = await api.forgotPassword(email);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 提交成功
      setIsSubmitted(true);
    } catch (err) {
      // 设置错误信息
      setError('发送重置密码邮件失败，请稍后再试');
    } finally {
      // 结束加载状态
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundColor: 'background.default',
        backgroundImage: 'linear-gradient(to bottom right, rgba(63, 81, 181, 0.05), rgba(63, 81, 181, 0.1))'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 450, 
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        {!isSubmitted ? (
          <>
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 1
              }}
            >
              忘记密码
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              请输入您的邮箱，我们将发送密码重置链接
            </Typography>

            {/* 错误提示 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="邮箱"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                disabled={isLoading}
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ 
                  mb: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)'
                }}
                disabled={isLoading}
              >
                {isLoading ? '发送中...' : '发送重置链接'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  记起密码了？{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    返回登录
                  </Link>
                </Typography>
              </Box>
            </form>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography 
                variant="h5" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2
                }}
              >
                邮件已发送
              </Typography>
              <Typography variant="body1" paragraph>
                我们已向 <strong>{email}</strong> 发送了密码重置链接。
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                请检查您的邮箱，点击邮件中的链接重置密码。如果没有收到邮件，请检查垃圾邮件文件夹。
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ 
                  mt: 2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: 1
                }}
              >
                返回登录
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage; 