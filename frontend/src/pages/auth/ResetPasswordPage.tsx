import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * 重置密码页面组件
 */
const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // 验证令牌
  useEffect(() => {
    if (!token) {
      setError('无效的密码重置链接');
    } else {
      // 这里可以验证令牌的有效性
      // const validateToken = async () => {
      //   try {
      //     // await api.validateResetToken(token);
      //   } catch (err) {
      //     setError('密码重置链接已过期或无效');
      //   }
      // };
      // validateToken();
    }
  }, [token]);

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除字段错误
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // 处理密码可见性切换
  const handleTogglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors = {
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // 验证密码
    if (!formData.password) {
      errors.password = '请输入密码';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = '密码长度至少为8个字符';
      isValid = false;
    }

    // 验证确认密码
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    // 设置加载状态
    setIsLoading(true);
    setError('');
    
    try {
      // 这里会调用重置密码的API
      // const response = await api.resetPassword({
      //   token,
      //   password: formData.password
      // });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重置成功
      setIsSuccess(true);
    } catch (err) {
      // 设置错误信息
      setError('密码重置失败，请重试');
    } finally {
      // 结束加载状态
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
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
        {!isSuccess ? (
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
              重置密码
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              请设置您的新密码
            </Typography>

            {/* 错误提示 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="新密码"
                variant="outlined"
                fullWidth
                margin="normal"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || '* 至少8个字符，包含1个数字，1个大写和1个小写字母'}
                disabled={isLoading || !!error}
                required
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="切换密码可见性"
                        onClick={() => handleTogglePasswordVisibility('password')}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="确认新密码"
                variant="outlined"
                fullWidth
                margin="normal"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                disabled={isLoading || !!error}
                required
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="切换密码可见性"
                        onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                disabled={isLoading || !!error}
              >
                {isLoading ? '正在重置...' : '重置密码'}
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
                密码重置成功
              </Typography>
              <Typography variant="body1" paragraph>
                您的密码已成功重置。
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                您现在可以使用新密码登录您的账户。
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoToLogin}
                sx={{ 
                  mt: 2,
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: 1.5,
                  px: 4,
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)'
                }}
              >
                立即登录
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage; 