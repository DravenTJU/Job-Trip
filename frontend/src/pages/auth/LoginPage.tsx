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
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff, Google, Apple } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { login, clearError } from '@/redux/slices/authSlice';
import Loader from '@/components/common/Loader';

/**
 * 登录页面组件
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  // 获取重定向路径
  const from = (location.state as { from?: string })?.from || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  // 如果已经登录，重定向到之前尝试访问的页面或仪表盘
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;

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
    }

    setFieldErrors(errors);
    return isValid;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(login(formData)).unwrap();
      navigate(from, { replace: true });
    } catch (error) {
      // 错误已经在 Redux 中处理
    }
  };

  // 处理社交登录
  const handleSocialLogin = (provider: string) => {
    // TODO: 实现社交登录
    console.log(`Social login with ${provider}`);
  };

  if (isLoading) {
    return <Loader message="正在登录..." fullScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          登录
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="邮箱地址"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="切换密码可见性"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            登录
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                忘记密码？
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                没有账号？立即注册
              </Link>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            或使用以下方式登录
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialLogin('google')}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<Apple />}
            onClick={() => handleSocialLogin('apple')}
          >
            Apple
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 