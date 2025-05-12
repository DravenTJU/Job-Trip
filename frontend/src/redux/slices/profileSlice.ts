import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, UserProfile, Education, WorkExperience, Skill, Certification, Project, Language, VolunteerExperience, HonorAward, Recommendation } from '../../types/profile';
import profileService from '../../services/profileService';
import { ApiError, isApiError } from '../../types/api';

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  profileNotFound: false,
  activeSection: 'basic',
  editMode: false,
  currentEditItem: null
};

// 异步thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetchUserProfile: 开始获取用户档案');
      const response = await profileService.getUserProfile();
      console.log('fetchUserProfile: 成功获取用户档案', response);
      return response;
    } catch (error: any) {
      console.log('fetchUserProfile: 获取用户档案出错', error);
      
      // 使用改进的错误处理逻辑
      // 优先检查ApiError类型和状态码
      if (isApiError(error) && error.status === 404) {
        console.log('fetchUserProfile: 检测到ApiError 404错误，设置profileNotFound=true');
        return rejectWithValue({ message: '用户档案不存在', notFound: true });
      }
      
      // 向后兼容 - 检查旧版错误对象
      if (error.response && error.response.status === 404) {
        console.log('fetchUserProfile: 检测到旧版404错误，设置profileNotFound=true');
        return rejectWithValue({ message: '用户档案不存在', notFound: true });
      }
      
      // 检查错误消息内容作为降级处理
      if (error.message && error.message.includes('用户档案不存在')) {
        console.log('fetchUserProfile: 从错误消息判断档案不存在，设置profileNotFound=true');
        return rejectWithValue({ message: '用户档案不存在', notFound: true });
      }
      
      console.log('fetchUserProfile: 其他错误，设置profileNotFound=false');
      return rejectWithValue({ message: '获取用户档案失败', notFound: false });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await profileService.updateUserProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue('更新用户档案失败');
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  'profile/deleteUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.deleteUserProfile();
      return true;
    } catch (error) {
      return rejectWithValue('删除用户档案失败');
    }
  }
);

// 教育经历相关
export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (education: Education, { rejectWithValue }) => {
    try {
      const response = await profileService.addEducation(education);
      return response;
    } catch (error) {
      return rejectWithValue('添加教育经历失败');
    }
  }
);

export const updateEducation = createAsyncThunk(
  'profile/updateEducation',
  async ({ educationId, education }: { educationId: string, education: Education }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateEducation(educationId, education);
      return response;
    } catch (error) {
      return rejectWithValue('更新教育经历失败');
    }
  }
);

export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (educationId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteEducation(educationId);
      return educationId;
    } catch (error) {
      return rejectWithValue('删除教育经历失败');
    }
  }
);

// 工作经历相关
export const addWorkExperience = createAsyncThunk(
  'profile/addWorkExperience',
  async (workExperience: WorkExperience, { rejectWithValue }) => {
    try {
      const response = await profileService.addWorkExperience(workExperience);
      return response;
    } catch (error) {
      return rejectWithValue('添加工作经历失败');
    }
  }
);

export const updateWorkExperience = createAsyncThunk(
  'profile/updateWorkExperience',
  async ({ workExperienceId, workExperience }: { workExperienceId: string, workExperience: WorkExperience }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateWorkExperience(workExperienceId, workExperience);
      return response;
    } catch (error) {
      return rejectWithValue('更新工作经历失败');
    }
  }
);

export const deleteWorkExperience = createAsyncThunk(
  'profile/deleteWorkExperience',
  async (workExperienceId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteWorkExperience(workExperienceId);
      return workExperienceId;
    } catch (error) {
      return rejectWithValue('删除工作经历失败');
    }
  }
);

// 技能相关
export const addSkill = createAsyncThunk(
  'profile/addSkill',
  async (skill: Skill, { rejectWithValue }) => {
    try {
      const response = await profileService.addSkill(skill);
      return response;
    } catch (error) {
      return rejectWithValue('添加技能失败');
    }
  }
);

export const updateSkill = createAsyncThunk(
  'profile/updateSkill',
  async ({ skillId, skill }: { skillId: string, skill: Skill }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateSkill(skillId, skill);
      return response;
    } catch (error) {
      return rejectWithValue('更新技能失败');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'profile/deleteSkill',
  async (skillId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteSkill(skillId);
      return skillId;
    } catch (error) {
      return rejectWithValue('删除技能失败');
    }
  }
);

// 证书相关
export const addCertification = createAsyncThunk(
  'profile/addCertification',
  async (certification: Certification, { rejectWithValue }) => {
    try {
      const response = await profileService.addCertification(certification);
      return response;
    } catch (error) {
      return rejectWithValue('添加证书失败');
    }
  }
);

export const updateCertification = createAsyncThunk(
  'profile/updateCertification',
  async ({ certificationId, certification }: { certificationId: string, certification: Certification }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateCertification(certificationId, certification);
      return response;
    } catch (error) {
      return rejectWithValue('更新证书失败');
    }
  }
);

export const deleteCertification = createAsyncThunk(
  'profile/deleteCertification',
  async (certificationId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteCertification(certificationId);
      return certificationId;
    } catch (error) {
      return rejectWithValue('删除证书失败');
    }
  }
);

// 项目经历相关
export const addProject = createAsyncThunk(
  'profile/addProject',
  async (project: Project, { rejectWithValue }) => {
    try {
      const response = await profileService.addProject(project);
      return response;
    } catch (error) {
      return rejectWithValue('添加项目经历失败');
    }
  }
);

export const updateProject = createAsyncThunk(
  'profile/updateProject',
  async ({ projectId, project }: { projectId: string, project: Project }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProject(projectId, project);
      return response;
    } catch (error) {
      return rejectWithValue('更新项目经历失败');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'profile/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue('删除项目经历失败');
    }
  }
);

// 语言能力相关
export const addLanguage = createAsyncThunk(
  'profile/addLanguage',
  async (language: Language, { rejectWithValue }) => {
    try {
      const response = await profileService.addLanguage(language);
      return response;
    } catch (error) {
      return rejectWithValue('添加语言能力失败');
    }
  }
);

export const updateLanguage = createAsyncThunk(
  'profile/updateLanguage',
  async ({ languageId, language }: { languageId: string, language: Language }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateLanguage(languageId, language);
      return response;
    } catch (error) {
      return rejectWithValue('更新语言能力失败');
    }
  }
);

export const deleteLanguage = createAsyncThunk(
  'profile/deleteLanguage',
  async (languageId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteLanguage(languageId);
      return languageId;
    } catch (error) {
      return rejectWithValue('删除语言能力失败');
    }
  }
);

// 志愿者经历相关
export const addVolunteerExperience = createAsyncThunk(
  'profile/addVolunteerExperience',
  async (experience: VolunteerExperience, { rejectWithValue }) => {
    try {
      const response = await profileService.addVolunteerExperience(experience);
      return response;
    } catch (error) {
      return rejectWithValue('添加志愿者经历失败');
    }
  }
);

export const updateVolunteerExperience = createAsyncThunk(
  'profile/updateVolunteerExperience',
  async ({ experienceId, experience }: { experienceId: string, experience: VolunteerExperience }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateVolunteerExperience(experienceId, experience);
      return response;
    } catch (error) {
      return rejectWithValue('更新志愿者经历失败');
    }
  }
);

export const deleteVolunteerExperience = createAsyncThunk(
  'profile/deleteVolunteerExperience',
  async (experienceId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteVolunteerExperience(experienceId);
      return experienceId;
    } catch (error) {
      return rejectWithValue('删除志愿者经历失败');
    }
  }
);

// 荣誉奖项相关
export const addHonorAward = createAsyncThunk(
  'profile/addHonorAward',
  async (award: HonorAward, { rejectWithValue }) => {
    try {
      const response = await profileService.addHonorAward(award);
      return response;
    } catch (error) {
      return rejectWithValue('添加荣誉奖项失败');
    }
  }
);

export const updateHonorAward = createAsyncThunk(
  'profile/updateHonorAward',
  async ({ honorAwardId, honorAward }: { honorAwardId: string, honorAward: HonorAward }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateHonorAward(honorAwardId, honorAward);
      return response;
    } catch (error) {
      return rejectWithValue('更新荣誉奖项失败');
    }
  }
);

export const deleteHonorAward = createAsyncThunk(
  'profile/deleteHonorAward',
  async (honorAwardId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteHonorAward(honorAwardId);
      return honorAwardId;
    } catch (error) {
      return rejectWithValue('删除荣誉奖项失败');
    }
  }
);

// 推荐信相关
export const addRecommendation = createAsyncThunk(
  'profile/addRecommendation',
  async (recommendation: Recommendation, { rejectWithValue }) => {
    try {
      const response = await profileService.addRecommendation(recommendation);
      return response;
    } catch (error) {
      return rejectWithValue('添加推荐信失败');
    }
  }
);

export const updateRecommendation = createAsyncThunk(
  'profile/updateRecommendation',
  async ({ recommendationId, recommendation }: { recommendationId: string, recommendation: Recommendation }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateRecommendation(recommendationId, recommendation);
      return response;
    } catch (error) {
      return rejectWithValue('更新推荐信失败');
    }
  }
);

export const deleteRecommendation = createAsyncThunk(
  'profile/deleteRecommendation',
  async (recommendationId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteRecommendation(recommendationId);
      return recommendationId;
    } catch (error) {
      return rejectWithValue('删除推荐信失败');
    }
  }
);

// 新增创建用户档案的thunk
export const createUserProfile = createAsyncThunk(
  'profile/createUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      console.log('createUserProfile: 开始创建用户档案', profileData);
      const response = await profileService.createUserProfile(profileData);
      console.log('createUserProfile: 成功创建用户档案', response);
      return response;
    } catch (error) {
      console.log('createUserProfile: 创建用户档案失败', error);
      return rejectWithValue('创建用户档案失败');
    }
  }
);

// 创建slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
    toggleEditMode: (state, action: PayloadAction<boolean | undefined>) => {
      state.editMode = action.payload !== undefined ? action.payload : !state.editMode;
    },
    setCurrentEditItem: (state, action: PayloadAction<any>) => {
      state.currentEditItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        console.log('Redux state: fetchUserProfile.pending');
        state.isLoading = true;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        console.log('Redux state: fetchUserProfile.fulfilled, payload:', action.payload);
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action: PayloadAction<any>) => {
        console.log('Redux state: fetchUserProfile.rejected, payload:', action.payload);
        state.isLoading = false;
        state.error = action.payload.message || '获取用户档案失败';
        state.profileNotFound = action.payload.notFound || false;
        console.log('Redux state更新后: profileNotFound =', state.profileNotFound);
      })
      
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // deleteUserProfile
      .addCase(deleteUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.profile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 教育经历
      .addCase(addEducation.fulfilled, (state, action) => {
        if (state.profile && state.profile.educations) {
          state.profile.educations.push(action.payload);
        } else if (state.profile) {
          state.profile.educations = [action.payload];
        }
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        if (state.profile && state.profile.educations) {
          const index = state.profile.educations.findIndex(edu => edu._id === action.payload._id);
          if (index !== -1) {
            state.profile.educations[index] = action.payload;
          }
        }
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        if (state.profile && state.profile.educations) {
          state.profile.educations = state.profile.educations.filter(edu => edu._id !== action.payload);
        }
      })
      
      // 工作经历
      .addCase(addWorkExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.workExperiences) {
          state.profile.workExperiences.push(action.payload);
        } else if (state.profile) {
          state.profile.workExperiences = [action.payload];
        }
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.workExperiences) {
          const index = state.profile.workExperiences.findIndex(exp => exp._id === action.payload._id);
          if (index !== -1) {
            state.profile.workExperiences[index] = action.payload;
          }
        }
      })
      .addCase(deleteWorkExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.workExperiences) {
          state.profile.workExperiences = state.profile.workExperiences.filter(exp => exp._id !== action.payload);
        }
      })
      
      // 技能
      .addCase(addSkill.fulfilled, (state, action) => {
        if (state.profile && state.profile.skills) {
          state.profile.skills.push(action.payload);
        } else if (state.profile) {
          state.profile.skills = [action.payload];
        }
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        if (state.profile && state.profile.skills) {
          const index = state.profile.skills.findIndex(skill => skill._id === action.payload._id);
          if (index !== -1) {
            state.profile.skills[index] = action.payload;
          }
        }
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        if (state.profile && state.profile.skills) {
          state.profile.skills = state.profile.skills.filter(skill => skill._id !== action.payload);
        }
      })
      
      // 证书
      .addCase(addCertification.fulfilled, (state, action) => {
        if (state.profile && state.profile.certifications) {
          state.profile.certifications.push(action.payload);
        } else if (state.profile) {
          state.profile.certifications = [action.payload];
        }
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        if (state.profile && state.profile.certifications) {
          const index = state.profile.certifications.findIndex(cert => cert._id === action.payload._id);
          if (index !== -1) {
            state.profile.certifications[index] = action.payload;
          }
        }
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        if (state.profile && state.profile.certifications) {
          state.profile.certifications = state.profile.certifications.filter(cert => cert._id !== action.payload);
        }
      })
      
      // 项目
      .addCase(addProject.fulfilled, (state, action) => {
        if (state.profile && state.profile.projects) {
          state.profile.projects.push(action.payload);
        } else if (state.profile) {
          state.profile.projects = [action.payload];
        }
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        if (state.profile && state.profile.projects) {
          const index = state.profile.projects.findIndex(project => project._id === action.payload._id);
          if (index !== -1) {
            state.profile.projects[index] = action.payload;
          }
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        if (state.profile && state.profile.projects) {
          state.profile.projects = state.profile.projects.filter(project => project._id !== action.payload);
        }
      })
      
      // 语言
      .addCase(addLanguage.fulfilled, (state, action) => {
        if (state.profile && state.profile.languages) {
          state.profile.languages.push(action.payload);
        } else if (state.profile) {
          state.profile.languages = [action.payload];
        }
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        if (state.profile && state.profile.languages) {
          const index = state.profile.languages.findIndex(lang => lang._id === action.payload._id);
          if (index !== -1) {
            state.profile.languages[index] = action.payload;
          }
        }
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        if (state.profile && state.profile.languages) {
          state.profile.languages = state.profile.languages.filter(lang => lang._id !== action.payload);
        }
      })
      
      // 志愿者经历
      .addCase(addVolunteerExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.volunteerExperiences) {
          state.profile.volunteerExperiences.push(action.payload);
        } else if (state.profile) {
          state.profile.volunteerExperiences = [action.payload];
        }
      })
      .addCase(updateVolunteerExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.volunteerExperiences) {
          const index = state.profile.volunteerExperiences.findIndex(exp => exp._id === action.payload._id);
          if (index !== -1) {
            state.profile.volunteerExperiences[index] = action.payload;
          }
        }
      })
      .addCase(deleteVolunteerExperience.fulfilled, (state, action) => {
        if (state.profile && state.profile.volunteerExperiences) {
          state.profile.volunteerExperiences = state.profile.volunteerExperiences.filter(exp => exp._id !== action.payload);
        }
      })
      
      // 荣誉奖项
      .addCase(addHonorAward.fulfilled, (state, action) => {
        if (state.profile && state.profile.honorsAwards) {
          state.profile.honorsAwards.push(action.payload);
        } else if (state.profile) {
          state.profile.honorsAwards = [action.payload];
        }
      })
      .addCase(updateHonorAward.fulfilled, (state, action) => {
        if (state.profile && state.profile.honorsAwards) {
          const index = state.profile.honorsAwards.findIndex(award => award._id === action.payload._id);
          if (index !== -1) {
            state.profile.honorsAwards[index] = action.payload;
          }
        }
      })
      .addCase(deleteHonorAward.fulfilled, (state, action) => {
        if (state.profile && state.profile.honorsAwards) {
          state.profile.honorsAwards = state.profile.honorsAwards.filter(award => award._id !== action.payload);
        }
      })
      
      // 推荐信
      .addCase(addRecommendation.fulfilled, (state, action) => {
        if (state.profile && state.profile.recommendations) {
          state.profile.recommendations.push(action.payload);
        } else if (state.profile) {
          state.profile.recommendations = [action.payload];
        }
      })
      .addCase(updateRecommendation.fulfilled, (state, action) => {
        if (state.profile && state.profile.recommendations) {
          const index = state.profile.recommendations.findIndex(rec => rec._id === action.payload._id);
          if (index !== -1) {
            state.profile.recommendations[index] = action.payload;
          }
        }
      })
      .addCase(deleteRecommendation.fulfilled, (state, action) => {
        if (state.profile && state.profile.recommendations) {
          state.profile.recommendations = state.profile.recommendations.filter(rec => rec._id !== action.payload);
        }
      })
      .addCase(createUserProfile.pending, (state) => {
        console.log('Redux state: createUserProfile.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        console.log('Redux state: createUserProfile.fulfilled');
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        state.profileNotFound = false;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        console.log('Redux state: createUserProfile.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setActiveSection, toggleEditMode, setCurrentEditItem, clearError } = profileSlice.actions;

export default profileSlice.reducer; 