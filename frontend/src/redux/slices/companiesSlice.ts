import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Company, CreateCompanyData } from '@/types';
import { companyService } from '@/services/companyService';

interface CompaniesState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  currentCompany: Company | null;
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

const initialState: CompaniesState = {
  companies: [],
  loading: false,
  error: null,
  currentCompany: null,
  total: 0,
  page: 1,
  size: 10,
  totalPages: 0
};

// 获取公司列表
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params?: { page?: number; limit?: number; search?: string; sort?: string }) => {
    const response = await companyService.getCompanies(params);
    return response;
  }
);

// 获取单个公司
export const fetchCompany = createAsyncThunk(
  'companies/fetchCompany',
  async (id: string) => {
    const response = await companyService.getCompany(id);
    return response;
  }
);

// 创建公司
export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (companyData: CreateCompanyData) => {
    const response = await companyService.createCompany(companyData);
    return response;
  }
);

// 更新公司
export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, companyData }: { id: string; companyData: Partial<CreateCompanyData> }) => {
    const response = await companyService.updateCompany(id, companyData);
    return response;
  }
);

// 删除公司
export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string) => {
    await companyService.deleteCompany(id);
    return id;
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取公司列表
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取公司列表失败';
      })
      // 获取单个公司
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取公司详情失败';
      })
      // 创建公司
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.unshift(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建公司失败';
      })
      // 更新公司
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(company => company._id === action.payload._id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.currentCompany?._id === action.payload._id) {
          state.currentCompany = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新公司失败';
      })
      // 删除公司
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(company => company._id !== action.payload);
        if (state.currentCompany?._id === action.payload) {
          state.currentCompany = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除公司失败';
      });
  }
});

export const { clearCurrentCompany, clearError } = companiesSlice.actions;
export default companiesSlice.reducer; 