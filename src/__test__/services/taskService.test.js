import axios from 'axios';
import taskService from '../../services/taskService';

// Mock axios
jest.mock('axios');

describe('Task Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test getTasks function
  test('getTasks should fetch tasks successfully', async () => {
    const mockTasks = [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }];
    
    axios.get.mockResolvedValueOnce({ data: mockTasks });
    
    const result = await taskService.getTasks();
    
    expect(axios.get).toHaveBeenCalledWith('/tasks', { params: {} });
    expect(result).toEqual(mockTasks);
  });

  test('getTasks should handle errors', async () => {
    const errorMessage = 'Network Error';
    
    axios.get.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } } 
    });
    
    await expect(taskService.getTasks()).rejects.toEqual({ 
      message: errorMessage 
    });
    
    expect(axios.get).toHaveBeenCalledWith('/tasks', { params: {} });
  });

  // Test getTaskById function
  test('getTaskById should fetch a task by ID successfully', async () => {
    const taskId = '1';
    const mockTask = { id: taskId, title: 'Task 1' };
    
    axios.get.mockResolvedValueOnce({ data: mockTask });
    
    const result = await taskService.getTaskById(taskId);
    
    expect(axios.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
    expect(result).toEqual(mockTask);
  });

  // Test createTask function
  test('createTask should create a task successfully', async () => {
    const taskData = { title: 'New Task', description: 'Task description' };
    const mockCreatedTask = { id: '3', ...taskData };
    
    axios.post.mockResolvedValueOnce({ data: mockCreatedTask });
    
    const result = await taskService.createTask(taskData);
    
    expect(axios.post).toHaveBeenCalledWith('/tasks', taskData);
    expect(result).toEqual(mockCreatedTask);
  });

  // Test updateTask function
  test('updateTask should update a task successfully', async () => {
    const taskId = '1';
    const taskData = { title: 'Updated Task' };
    const mockUpdatedTask = { id: taskId, ...taskData };
    
    axios.put.mockResolvedValueOnce({ data: mockUpdatedTask });
    
    const result = await taskService.updateTask(taskId, taskData);
    
    expect(axios.put).toHaveBeenCalledWith(`/tasks/${taskId}`, taskData);
    expect(result).toEqual(mockUpdatedTask);
  });

  // Test deleteTask function
  test('deleteTask should delete a task successfully', async () => {
    const taskId = '1';
    const mockResponse = { success: true };
    
    axios.delete.mockResolvedValueOnce({ data: mockResponse });
    
    const result = await taskService.deleteTask(taskId);
    
    expect(axios.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    expect(result).toEqual(mockResponse);
  });
});
