import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Get tasks async thunk
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (params, thunkAPI) => {
    try {
      return await taskService.getTasks(params);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get task by ID async thunk
export const getTaskById = createAsyncThunk(
  'tasks/getById',
  async (taskId, thunkAPI) => {
    try {
      return await taskService.getTaskById(taskId);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create task async thunk
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update task async thunk
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, taskData }, thunkAPI) => {
    try {
      return await taskService.updateTask(taskId, taskData);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task async thunk
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId, thunkAPI) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit task for review async thunk
export const submitForReview = createAsyncThunk(
  'tasks/submitForReview',
  async (taskId, thunkAPI) => {
    try {
      return await taskService.submitForReview(taskId);
    } catch (error) {
      const message = error.message || (error.response && error.response.data && error.response.data.message) || 'An error occurred';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get tasks cases
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get task by ID cases
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTask = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create task cases
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update task cases
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTask = action.payload;
        state.tasks = state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete task cases
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Submit for review cases
      .addCase(submitForReview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(submitForReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTask = action.payload;
        state.tasks = state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(submitForReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
