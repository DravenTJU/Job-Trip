import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { profileService } from '../../services/profileService';
import { IProfile, IEducation, IWorkExperience, ISkill } from '../../types/profile';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 表单状态
  const [introduction, setIntroduction] = useState('');
  const [educationDialog, setEducationDialog] = useState(false);
  const [workDialog, setWorkDialog] = useState(false);
  const [skillDialog, setSkillDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 获取用户档案
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getProfile();
        setProfile(data);
        setIntroduction(data.introduction);
      } catch (err) {
        console.error('获取档案失败:', err);
        setError('获取档案失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 显示成功消息
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  // 更新个人介绍
  const handleUpdateIntroduction = async () => {
    try {
      setError(null);
      const updatedProfile = await profileService.updateProfile({ introduction });
      setProfile(updatedProfile);
      showSuccess('个人介绍更新成功');
    } catch (err) {
      setError('更新个人介绍失败，请稍后重试');
      console.error('更新个人介绍失败:', err);
    }
  };

  // 教育经历表单
  const [educationForm, setEducationForm] = useState<Partial<IEducation>>({
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: false,
  });

  // 工作经历表单
  const [workForm, setWorkForm] = useState<Partial<IWorkExperience>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: false,
  });

  // 技能表单
  const [skillForm, setSkillForm] = useState<Partial<ISkill>>({
    name: '',
    level: 'intermediate',
    years: 1,
  });

  // 处理教育经历
  const handleEducationSubmit = async () => {
    try {
      if (selectedItem) {
        await profileService.updateEducation(selectedItem._id, educationForm);
      } else {
        await profileService.addEducation(educationForm as Omit<IEducation, '_id'>);
      }
      const updatedProfile = await profileService.getProfile();
      setProfile(updatedProfile);
      setEducationDialog(false);
      setSelectedItem(null);
      setEducationForm({
        school: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false,
      });
      showSuccess('教育经历更新成功');
    } catch (err) {
      setError('操作失败');
    }
  };

  // 处理工作经历
  const handleWorkSubmit = async () => {
    try {
      if (selectedItem) {
        await profileService.updateWorkExperience(selectedItem._id, workForm);
      } else {
        await profileService.addWorkExperience(workForm as Omit<IWorkExperience, '_id'>);
      }
      const updatedProfile = await profileService.getProfile();
      setProfile(updatedProfile);
      setWorkDialog(false);
      setSelectedItem(null);
      setWorkForm({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false,
      });
      showSuccess('工作经历更新成功');
    } catch (err) {
      setError('操作失败');
    }
  };

  // 处理技能
  const handleSkillSubmit = async () => {
    try {
      if (selectedItem) {
        await profileService.updateSkill(selectedItem._id, skillForm);
      } else {
        await profileService.addSkill(skillForm as Omit<ISkill, '_id'>);
      }
      const updatedProfile = await profileService.getProfile();
      setProfile(updatedProfile);
      setSkillDialog(false);
      setSelectedItem(null);
      setSkillForm({
        name: '',
        level: 'intermediate',
        years: 1,
      });
      showSuccess('技能更新成功');
    } catch (err) {
      setError('操作失败');
    }
  };

  // 删除项目
  const handleDelete = async (type: 'education' | 'work' | 'skill', id: string) => {
    try {
      if (type === 'education') {
        await profileService.deleteEducation(id);
      } else if (type === 'work') {
        await profileService.deleteWorkExperience(id);
      } else {
        await profileService.deleteSkill(id);
      }
      const updatedProfile = await profileService.getProfile();
      setProfile(updatedProfile);
      showSuccess(`${type === 'education' ? '教育经历' : type === 'work' ? '工作经历' : '技能'}删除成功`);
    } catch (err) {
      setError('删除失败');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">未找到档案信息</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h4" gutterBottom>
        个人档案
      </Typography>

      {/* 个人介绍 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          个人介绍
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleUpdateIntroduction}
          disabled={introduction === profile.introduction}
        >
          保存
        </Button>
      </Paper>

      {/* 教育经历 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">教育经历</Typography>
          <Button
            startIcon={<Add />}
            onClick={() => {
              setSelectedItem(null);
              setEducationForm({
                school: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
                isCurrent: false,
              });
              setEducationDialog(true);
            }}
          >
            添加
          </Button>
        </Box>
        <List>
          {profile.educations.map((edu) => (
            <ListItem key={edu._id}>
              <ListItemText
                primary={`${edu.school} - ${edu.degree} (${edu.major})`}
                secondary={`${edu.startDate} - ${edu.isCurrent ? '至今' : edu.endDate}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setSelectedItem(edu);
                    setEducationForm(edu);
                    setEducationDialog(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete('education', edu._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 工作经历 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">工作经历</Typography>
          <Button
            startIcon={<Add />}
            onClick={() => {
              setSelectedItem(null);
              setWorkForm({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
                isCurrent: false,
              });
              setWorkDialog(true);
            }}
          >
            添加
          </Button>
        </Box>
        <List>
          {profile.workExperiences.map((work) => (
            <ListItem key={work._id}>
              <ListItemText
                primary={`${work.company} - ${work.position}`}
                secondary={`${work.startDate} - ${work.isCurrent ? '至今' : work.endDate}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setSelectedItem(work);
                    setWorkForm(work);
                    setWorkDialog(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete('work', work._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 技能 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">技能</Typography>
          <Button
            startIcon={<Add />}
            onClick={() => {
              setSelectedItem(null);
              setSkillForm({
                name: '',
                level: 'intermediate',
                years: 1,
              });
              setSkillDialog(true);
            }}
          >
            添加
          </Button>
        </Box>
        <List>
          {profile.skills.map((skill) => (
            <ListItem key={skill._id}>
              <ListItemText
                primary={skill.name}
                secondary={`${skill.level} - ${skill.years}年经验`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setSelectedItem(skill);
                    setSkillForm(skill);
                    setSkillDialog(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete('skill', skill._id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 教育经历对话框 */}
      <Dialog open={educationDialog} onClose={() => setEducationDialog(false)}>
        <DialogTitle>{selectedItem ? '编辑教育经历' : '添加教育经历'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="学校"
            value={educationForm.school}
            onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="学位"
            value={educationForm.degree}
            onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="专业"
            value={educationForm.major}
            onChange={(e) => setEducationForm({ ...educationForm, major: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="开始日期"
            type="date"
            value={educationForm.startDate}
            onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="结束日期"
            type="date"
            value={educationForm.endDate}
            onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={educationForm.isCurrent}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="描述"
            multiline
            rows={3}
            value={educationForm.description}
            onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={educationForm.isCurrent}
              onChange={(e) => setEducationForm({ ...educationForm, isCurrent: e.target.checked })}
            />
            <Typography sx={{ ml: 1 }}>至今</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEducationDialog(false)}>取消</Button>
          <Button onClick={handleEducationSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 工作经历对话框 */}
      <Dialog open={workDialog} onClose={() => setWorkDialog(false)}>
        <DialogTitle>{selectedItem ? '编辑工作经历' : '添加工作经历'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="公司"
            value={workForm.company}
            onChange={(e) => setWorkForm({ ...workForm, company: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="职位"
            value={workForm.position}
            onChange={(e) => setWorkForm({ ...workForm, position: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="开始日期"
            type="date"
            value={workForm.startDate}
            onChange={(e) => setWorkForm({ ...workForm, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="结束日期"
            type="date"
            value={workForm.endDate}
            onChange={(e) => setWorkForm({ ...workForm, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={workForm.isCurrent}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="描述"
            multiline
            rows={3}
            value={workForm.description}
            onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={workForm.isCurrent}
              onChange={(e) => setWorkForm({ ...workForm, isCurrent: e.target.checked })}
            />
            <Typography sx={{ ml: 1 }}>至今</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkDialog(false)}>取消</Button>
          <Button onClick={handleWorkSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 技能对话框 */}
      <Dialog open={skillDialog} onClose={() => setSkillDialog(false)}>
        <DialogTitle>{selectedItem ? '编辑技能' : '添加技能'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="技能名称"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="熟练程度"
            value={skillForm.level}
            onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value as ISkill['level'] })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="beginner">初级</MenuItem>
            <MenuItem value="intermediate">中级</MenuItem>
            <MenuItem value="advanced">高级</MenuItem>
            <MenuItem value="expert">专家</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="使用年限"
            value={skillForm.years}
            onChange={(e) => setSkillForm({ ...skillForm, years: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkillDialog(false)}>取消</Button>
          <Button onClick={handleSkillSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage; 