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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { userProfileService, UserProfile, Education, WorkExperience, Skill, Project, Language, Certification } from '@/services/userProfileService';

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
      id={`user-profile-tabpanel-${index}`}
      aria-labelledby={`user-profile-tab-${index}`}
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

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'education' | 'work' | 'skill' | 'project' | 'language'>('education');
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogData, setDialogData] = useState<any>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: [] as string[]
  });
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 'beginner',
    yearsOfExperience: 0
  });
  const [languageForm, setLanguageForm] = useState({
    name: '',
    level: 'basic' as 'basic' | 'intermediate' | 'advanced' | 'native'
  });
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [certificationForm, setCertificationForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await userProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('获取用户档案失败:', error);
      setError('获取用户档案失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type: string, mode: 'create' | 'edit', data?: any) => {
    setDialogType(type);
    setDialogMode(mode);
    if (type === 'skill') {
      setSkillForm(data || {
        name: '',
        level: 'beginner',
        yearsOfExperience: 0
      });
    }
    if (type === 'language') {
      setLanguageForm(data || {
        name: '',
        level: 'basic'
      });
    }
    setDialogData(data || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData(null);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      setError(null);
      console.log('准备保存个人介绍:', profile.introduction);
      const response = await userProfileService.updateProfile({
        introduction: profile.introduction
      });
      console.log('保存成功:', response);
      setSuccess('用户档案更新成功');
      await fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('更新用户档案失败:', error);
      if (error instanceof Error) {
        setError(`更新用户档案失败: ${error.message}`);
      } else {
        setError('更新用户档案失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkExperience = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (dialogMode === 'create') {
        await userProfileService.addWorkExperience(dialogData);
      } else {
        await userProfileService.updateWorkExperience(dialogData.id, dialogData);
      }
      
      setSuccess(dialogMode === 'create' ? '添加工作经验成功' : '更新工作经验成功');
      handleCloseDialog();
      fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('保存工作经验失败:', error);
      setError('保存工作经验失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (dialogMode === 'create') {
        await userProfileService.addEducation(dialogData);
      } else {
        await userProfileService.updateEducation(dialogData.id, dialogData);
      }
      
      setSuccess(dialogMode === 'create' ? '添加教育经历成功' : '更新教育经历成功');
      handleCloseDialog();
      fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('保存教育经历失败:', error);
      setError('保存教育经历失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userProfileService.deleteEducation(id);
      setSuccess('删除教育经历成功');
      fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('删除教育经历失败:', error);
      setError('删除教育经历失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkExperience = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userProfileService.deleteWorkExperience(id);
      setSuccess('删除工作经验成功');
      fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('删除工作经验失败:', error);
      setError('删除工作经验失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkill = async () => {
    try {
      if (dialogMode === 'create') {
        await userProfileService.createSkill(skillForm);
      } else {
        await userProfileService.updateSkill(skillForm._id, skillForm);
      }
      await fetchProfile();
      setOpenDialog(false);
      setSuccess('保存技能成功');
    } catch (error) {
      console.error('保存技能失败:', error);
      setError('保存技能失败，请稍后重试');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userProfileService.deleteSkill(id);
      setSuccess('删除技能成功');
      fetchProfile(); // 重新获取用户档案数据
    } catch (error) {
      console.error('删除技能失败:', error);
      setError('删除技能失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguage = async () => {
    try {
      if (dialogMode === 'create') {
        await userProfileService.addLanguage(languageForm);
      } else {
        await userProfileService.updateLanguage(editingLanguage?.id || '', languageForm);
      }
      await fetchProfile();
      handleCloseDialog();
      setLanguageForm({
        name: '',
        level: 'basic'
      });
    } catch (error) {
      console.error('保存语言能力失败:', error);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    try {
      await userProfileService.deleteLanguage(id);
      await fetchProfile();
    } catch (error) {
      console.error('删除语言能力失败:', error);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      name: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      technologies: []
    });
    setProjectDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      role: project.role,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description || '',
      technologies: project.technologies || []
    });
    setProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        await userProfileService.updateProject(editingProject.id, projectForm);
      } else {
        await userProfileService.createProject(projectForm);
      }
      await fetchProfile();
      setProjectDialogOpen(false);
      setSuccess('保存项目经验成功');
    } catch (error) {
      console.error('保存项目经验失败:', error);
      setError('保存项目经验失败，请稍后重试');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await userProfileService.deleteProject(id);
      await fetchProfile();
      setSuccess('删除项目经验成功');
    } catch (error) {
      console.error('删除项目经验失败:', error);
      setError('删除项目经验失败，请稍后重试');
    }
  };

  const handleSaveCertification = async () => {
    try {
      if (dialogMode === 'add') {
        await userProfileService.addCertification(certificationForm);
      } else {
        await userProfileService.updateCertification(editingCertification?.id || '', certificationForm);
      }
      await fetchProfile();
      setCertificationDialogOpen(false);
      setCertificationForm({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: ''
      });
    } catch (error) {
      console.error('保存证书失败:', error);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    try {
      await userProfileService.deleteCertification(id);
      await fetchProfile();
    } catch (error) {
      console.error('删除证书失败:', error);
    }
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            用户档案
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
              <Tab label="个人介绍" />
              <Tab label="教育经历" />
              <Tab label="工作经验" />
              <Tab label="技能" />
              <Tab label="项目经验" />
              <Tab label="语言能力" />
              <Tab label="证书" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="个人介绍"
                value={profile?.introduction || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, introduction: e.target.value } : null)}
              />
              <Button
                variant="contained"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                保存更改
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('education', 'create')}
              >
                添加教育经历
              </Button>
            </Box>
            <List>
              {profile?.education.map((edu) => (
                <React.Fragment key={edu.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${edu.school} - ${edu.degree}`}
                      secondary={`${edu.major} | ${edu.startDate} - ${edu.endDate}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleOpenDialog('education', 'edit', edu)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteEducation(edu.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('work', 'create')}
              >
                添加工作经验
              </Button>
            </Box>
            <List>
              {profile?.workExperience.map((work) => (
                <React.Fragment key={work.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${work.company} - ${work.position}`}
                      secondary={`${work.startDate} - ${work.endDate}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleOpenDialog('work', 'edit', work)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDeleteWorkExperience(work.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">技能</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('skill', 'create')}
              >
                添加技能
              </Button>
            </Box>
            <List>
              {profile?.skills?.map((skill: any) => (
                <ListItem
                  key={skill._id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog('skill', 'edit', skill)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteSkill(skill._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={skill.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {skill.level}
                        </Typography>
                        {` — ${skill.yearsOfExperience}年经验`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">项目经验</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProject}
              >
                添加项目
              </Button>
            </Box>
            <List>
              {profile?.projects?.map((project: any) => (
                <ListItem
                  key={project.id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditProject(project)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={project.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {project.role}
                        </Typography>
                        {` — ${project.startDate} 至 ${project.endDate}`}
                        <br />
                        {project.description}
                        <br />
                        {project.technologies?.length > 0 && (
                          <>
                            使用技术：
                            {project.technologies.join('、')}
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">语言能力</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('language', 'create')}
              >
                添加语言
              </Button>
            </Box>
            <List>
              {profile?.languages?.map((language: any) => (
                <ListItem
                  key={language._id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog('language', 'edit', language)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteLanguage(language._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={language.name}
                    secondary={
                      <Typography component="span" variant="body2" color="text.primary">
                        {language.level}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={6}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">证书</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setCertificationForm({
                    title: '',
                    issuer: '',
                    issueDate: '',
                    expiryDate: '',
                    credentialId: '',
                    credentialUrl: ''
                  });
                  setDialogMode('add');
                  setCertificationDialogOpen(true);
                }}
              >
                添加证书
              </Button>
            </Box>
            <List>
              {profile?.certifications?.map((certification) => (
                <ListItem
                  key={certification.id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setCertificationForm({
                            title: certification.title,
                            issuer: certification.issuer,
                            issueDate: certification.issueDate,
                            expiryDate: certification.expiryDate || '',
                            credentialId: certification.credentialId || '',
                            credentialUrl: certification.credentialUrl || ''
                          });
                          setEditingCertification(certification);
                          setDialogMode('edit');
                          setCertificationDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteCertification(certification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={certification.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {certification.issuer}
                        </Typography>
                        {` | ${certification.issueDate} - ${certification.expiryDate || '至今'}`}
                        {certification.credentialId && (
                          <Typography component="div" variant="body2">
                            证书编号: {certification.credentialId}
                          </Typography>
                        )}
                        {certification.credentialUrl && (
                          <Typography component="div" variant="body2">
                            证书链接: {certification.credentialUrl}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? '添加' : '编辑'} {dialogType === 'education' ? '教育经历' :
            dialogType === 'work' ? '工作经验' :
            dialogType === 'skill' ? '技能' :
            dialogType === 'project' ? '项目经验' :
            dialogType === 'language' ? '语言能力' : '证书'}
        </DialogTitle>
        <DialogContent>
          {/* 根据 dialogType 显示不同的表单 */}
          {dialogType === 'education' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="学校"
                value={dialogData?.school || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, school: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="学位"
                value={dialogData?.degree || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, degree: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="专业"
                value={dialogData?.major || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, major: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="开始日期"
                    type="date"
                    value={dialogData?.startDate || ''}
                    onChange={(e) => setDialogData(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="结束日期"
                    type="date"
                    value={dialogData?.endDate || ''}
                    onChange={(e) => setDialogData(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="描述"
                value={dialogData?.description || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, description: e.target.value }))}
                sx={{ mt: 2 }}
              />
            </Box>
          )}
          {dialogType === 'skill' && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="技能名称"
                value={skillForm.name}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, name: e.target.value })
                }
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>技能水平</InputLabel>
                <Select
                  value={skillForm.level}
                  label="技能水平"
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, level: e.target.value })
                  }
                >
                  <MenuItem value="beginner">初级</MenuItem>
                  <MenuItem value="intermediate">中级</MenuItem>
                  <MenuItem value="advanced">高级</MenuItem>
                  <MenuItem value="expert">专家</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="使用年限"
                type="number"
                value={skillForm.yearsOfExperience}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, yearsOfExperience: e.target.value })
                }
                margin="normal"
                required
                InputProps={{ inputProps: { min: 0, max: 50 } }}
              />
            </Box>
          )}
          {dialogType === 'project' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="项目名称"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="担任角色"
                value={projectForm.role}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, role: e.target.value })
                }
                margin="normal"
                required
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="开始日期"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  fullWidth
                  label="结束日期"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Box>
              <TextField
                fullWidth
                label="项目描述"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="使用技术"
                value={projectForm.technologies.join('、')}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    technologies: e.target.value.split('、')
                  })
                }
                margin="normal"
                helperText="多个技术用顿号（、）分隔"
              />
            </Box>
          )}
          {dialogType === 'language' && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="语言名称"
                value={languageForm.name}
                onChange={(e) =>
                  setLanguageForm({ ...languageForm, name: e.target.value })
                }
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>语言水平</InputLabel>
                <Select
                  value={languageForm.level}
                  label="语言水平"
                  onChange={(e) =>
                    setLanguageForm({ ...languageForm, level: e.target.value })
                  }
                >
                  <MenuItem value="basic">基础</MenuItem>
                  <MenuItem value="intermediate">中等</MenuItem>
                  <MenuItem value="advanced">高级</MenuItem>
                  <MenuItem value="native">母语</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {dialogType === 'work' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="公司名称"
                value={dialogData?.company || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, company: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="职位"
                value={dialogData?.position || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, position: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="开始日期"
                    type="date"
                    value={dialogData?.startDate || ''}
                    onChange={(e) => setDialogData(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="结束日期"
                    type="date"
                    value={dialogData?.endDate || ''}
                    onChange={(e) => setDialogData(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="工作描述"
                value={dialogData?.description || ''}
                onChange={(e) => setDialogData(prev => ({ ...prev, description: e.target.value }))}
                sx={{ mt: 2 }}
                placeholder="描述您的主要职责和成就"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button
            onClick={
              dialogType === 'education'
                ? handleSaveEducation
                : dialogType === 'skill'
                ? handleSaveSkill
                : dialogType === 'project'
                ? handleSaveProject
                : dialogType === 'language'
                ? handleSaveLanguage
                : dialogType === 'work'
                ? handleSaveWorkExperience
                : handleSaveProfile
            }
            variant="contained"
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 项目经验对话框 */}
      <Dialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProject ? '编辑项目经验' : '添加项目经验'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="项目名称"
              value={projectForm.name}
              onChange={(e) =>
                setProjectForm({ ...projectForm, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="担任角色"
              value={projectForm.role}
              onChange={(e) =>
                setProjectForm({ ...projectForm, role: e.target.value })
              }
              margin="normal"
              required
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="开始日期"
                type="date"
                value={projectForm.startDate}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="结束日期"
                type="date"
                value={projectForm.endDate}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="项目描述"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({ ...projectForm, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="使用技术"
              value={projectForm.technologies.join('、')}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  technologies: e.target.value.split('、')
                })
              }
              margin="normal"
              helperText="多个技术用顿号（、）分隔"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveProject} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 证书对话框 */}
      <Dialog
        open={certificationDialogOpen}
        onClose={() => setCertificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? '添加证书' : '编辑证书'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="证书名称"
              value={certificationForm.title}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="颁发机构"
              value={certificationForm.issuer}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, issuer: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="颁发日期"
              type="date"
              value={certificationForm.issueDate}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, issueDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="过期日期"
              type="date"
              value={certificationForm.expiryDate}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, expiryDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="证书编号"
              value={certificationForm.credentialId}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, credentialId: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="证书链接"
              value={certificationForm.credentialUrl}
              onChange={(e) =>
                setCertificationForm({ ...certificationForm, credentialUrl: e.target.value })
              }
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificationDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveCertification} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfilePage; 