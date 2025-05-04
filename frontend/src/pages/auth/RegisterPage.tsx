import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Grid,
  InputAdornment,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Google, Apple } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { register, clearError } from '@/redux/slices/authSlice';
import Loader from '@/components/common/Loader';

/**
 * 注册页面组件
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 清除全局错误状态
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // 验证用户名
    if (!formData.username) {
      errors.username = '请输入用户名';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = '用户名最少3个字符';
      isValid = false;
    }

    // 验证邮箱
    if (!formData.email) {
      errors.email = '请输入邮箱';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

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
    
    // 调用注册Action
    const { confirmPassword, ...userData } = formData;
    // 添加firstName和lastName空字段以符合UserRegisterData接口要求
    const registerData = {
      ...userData,
      firstName: '未设置', // 默认值，用户可以后续在个人资料中修改
      lastName: '',
    };
    
    const resultAction = await dispatch(register(registerData));
    
    if (register.fulfilled.match(resultAction)) {
      // 注册成功后跳转到登录页
      navigate('/login');
    }
  };

  // 处理第三方登录注册
  const handleSocialSignup = (provider: string) => {
    // 实现社交媒体注册逻辑
    console.log(`注册方式: ${provider}`);
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
          maxWidth: 550, 
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
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
          注册免费账号
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          掌控您的求职之旅
        </Typography>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={() => handleSocialSignup('google')}
              sx={{ 
                py: 1.2,
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: 'divider'
              }}
            >
              使用Google继续
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Apple />}
              onClick={() => handleSocialSignup('apple')}
              sx={{ 
                py: 1.2,
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: 'divider'
              }}
            >
              使用Apple继续
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }}>
          <Typography color="text.secondary" variant="body2">
            或使用邮箱注册
          </Typography>
        </Divider>

        <form onSubmit={handleSubmit}>
          <TextField
            label="用户名"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!fieldErrors.username}
            helperText={fieldErrors.username || '用户名至少3个字符'}
            disabled={isLoading}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            label="邮箱"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            disabled={isLoading}
            required
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            label="密码"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password || '密码至少8个字符'}
            disabled={isLoading}
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
            label="确认密码"
            variant="outlined"
            fullWidth
            margin="normal"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? <Loader size={24} /> : '创建账号'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              已有账号？{' '}
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
                登录
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 