import { rest } from 'msw';
import { server } from '../../mocks/server';
import authService from '../../services/authService';
import taskService from '../../services/taskService';
import reviewService from '../../services/reviewService';

describe('API Integration Tests', () => {
  // Reset handlers after each test
  afterEach(() => server.resetHandlers());

  describe('Auth Service', () => {
    test('login should return user data for valid credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');
      
      expect(result).toMatchObject({
        email: 'test@example.com',
        token: expect.any(String)
      });
      
      // Verify localStorage was updated
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toEqual(result);
    });

    test('login should handle authentication errors', async () => {
      await expect(
        authService.login('wrong@example.com', 'wrongpassword')
      ).rejects.toMatchObject({
        message: 'Invalid credentials'
      });
    });

    test('logout should remove user from localStorage', () => {
      // Set up initial state
      localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
      
      authService.logout();
      
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Task Service', () => {
    test('getTasks should fetch tasks successfully', async () => {
      const tasks = await taskService.getTasks();
      
      expect(tasks).toHaveLength(2);
      expect(tasks[0]).toMatchObject({
        id: 'task-1',
        title: 'Sample Task 1'
      });
    });

    test('getTasks should handle server errors', async () => {
      // Override the default handler to simulate a server error
      server.use(
        rest.get('http://localhost:3000/api/v1/tasks', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Server error' }));
        })
      );
      
      await expect(taskService.getTasks()).rejects.toMatchObject({
        message: 'Server error'
      });
    });
  });

  describe('Review Service', () => {
    test('getReviewQueue should fetch reviews successfully', async () => {
      const queue = await reviewService.getReviewQueue();
      
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        task_id: 'task-3',
        title: 'Task Needing Review'
      });
    });
  });
});
