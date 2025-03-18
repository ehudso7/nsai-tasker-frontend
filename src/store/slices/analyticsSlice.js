import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

const initialState = {
  systemOverview: null,
  taskMetrics: null,
  reviewMetrics: null,
  aiMetrics: null,
  costAnalysis: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Get system overview async thunk
export const getSystemOverview = createAsyncThunk(
  'analytics/getSystemOverview',
  async (timeframe, thunkAPI) => {
    try {
      return await analyticsService.getSystemOverview(timeframe);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get task metrics async thunk
export const getTaskMetrics = createAsyncThunk(
  'analytics/getTaskMetrics',
  async (params, thunkAPI) => {
    try {
      return await analyticsService.getTaskMetrics(params);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get review metrics async thunk
export const getReviewMetrics = createAsyncThunk(
  'analytics/getReviewMetrics',
  async (params, thunkAPI) => {
    try {
      return await analyticsService.getReviewMetrics(params);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get AI metrics async thunk
export const getAIMetrics = createAsyncThunk(
  'analytics/getAIMetrics',
  async (params, thunkAPI) => {
    try {
      return await analyticsService.getAIMetrics(params);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cost analysis async thunk
export const getCostAnalysis = createAsyncThunk(
  'analytics/getCostAnalysis',
  async (timeframe, thunkAPI) => {
    try {
      return await analyticsService.getCostAnalysis(timeframe);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // System overview cases
      .addCase(getSystemOverview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getSystemOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.systemOverview = action.payload;
      })
      .addCase(getSystemOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Task metrics cases
      .addCase(getTaskMetrics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTaskMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.taskMetrics = action.payload;
      })
      .addCase(getTaskMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Review metrics cases
      .addCase(getReviewMetrics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getReviewMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviewMetrics = action.payload;
      })
      .addCase(getReviewMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // AI metrics cases
      .addCase(getAIMetrics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAIMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.aiMetrics = action.payload;
      })
      .addCase(getAIMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Cost analysis cases
      .addCase(getCostAnalysis.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCostAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.costAnalysis = action.payload;
      })
      .addCase(getCostAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;
