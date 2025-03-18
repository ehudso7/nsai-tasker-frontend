import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

const initialState = {
  reviewQueue: [],
  currentReview: null,
  reviewMetrics: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Get review queue async thunk
export const getReviewQueue = createAsyncThunk(
  'reviews/getQueue',
  async (params, thunkAPI) => {
    try {
      return await reviewService.getReviewQueue(params);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get review by ID async thunk
export const getReviewById = createAsyncThunk(
  'reviews/getById',
  async (reviewId, thunkAPI) => {
    try {
      return await reviewService.getReviewById(reviewId);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit review async thunk
export const submitReview = createAsyncThunk(
  'reviews/submit',
  async ({ taskId, reviewData }, thunkAPI) => {
    try {
      return await reviewService.submitReview(taskId, reviewData);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get reviewer metrics async thunk
export const getReviewerMetrics = createAsyncThunk(
  'reviews/getMetrics',
  async (timeframe, thunkAPI) => {
    try {
      return await reviewService.getReviewerMetrics(timeframe);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Skip review async thunk
export const skipReview = createAsyncThunk(
  'reviews/skip',
  async (taskId, thunkAPI) => {
    try {
      return await reviewService.skipReview(taskId);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get review queue cases
      .addCase(getReviewQueue.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getReviewQueue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviewQueue = action.payload;
      })
      .addCase(getReviewQueue.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get review by ID cases
      .addCase(getReviewById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getReviewById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentReview = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Submit review cases
      .addCase(submitReview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentReview = null;
        state.reviewQueue = state.reviewQueue.filter(
          item => item.task_id !== action.payload.task_id
        );
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get reviewer metrics cases
      .addCase(getReviewerMetrics.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getReviewerMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviewMetrics = action.payload;
      })
      .addCase(getReviewerMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Skip review cases
      .addCase(skipReview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(skipReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the queue by removing the skipped task and potentially adding it back at the end
        // depending on the API response structure
        if (action.payload.updatedQueue) {
          state.reviewQueue = action.payload.updatedQueue;
        } else {
          state.reviewQueue = state.reviewQueue.filter(
            item => item.task_id !== action.payload.task_id
          );
        }
      })
      .addCase(skipReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
