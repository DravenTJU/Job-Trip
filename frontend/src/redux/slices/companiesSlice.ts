import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Company, CreateCompanyData } from '@/types';
import companyService from '@/services/companyService';

// 异步Thunk actions
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    sort?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanies(params);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCompany = createAsyncThunk(
  'companies/fetchCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompany(id);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (companyData: CreateCompanyData, { rejectWithValue }) => {
    try {
      const response = await companyService.createCompany(companyData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, data }: { id: string, data: Partial<CreateCompanyData> }, { rejectWithValue }) => {
    try {
      const response = await companyService.updateCompany(id, data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string, { rejectWithValue }) => {
    try {
      await companyService.deleteCompany(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 状态接口
interface CompaniesState {
  companies: Company[];
  company: Company | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: CompaniesState = {
  companies: [],
  company: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// 创建slice
const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCompany: (state) => {
      state.company = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取公司列表
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.size,
          pages: action.payload.totalPages
        };
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 获取单个公司
      .addCase(fetchCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 创建公司
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies.push(action.payload);
        state.error = null;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 更新公司
      .addCase(updateCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = state.companies.map(company => 
          company._id === action.payload._id ? action.payload : company
        );
        if (state.company && state.company._id === action.payload._id) {
          state.company = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 删除公司
      .addCase(deleteCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = state.companies.filter(company => company._id !== action.payload);
        if (state.company && state.company._id === action.payload) {
          state.company = null;
        }
        state.error = null;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCompany } = companiesSlice.actions;
export default companiesSlice.reducer; 