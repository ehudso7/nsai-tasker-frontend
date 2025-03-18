import authReducer, { reset, login, logout } from '../../../store/slices/authSlice';

describe('Auth Slice', () => {
  // Initial state test
  test('should return the initial state', () => {
    const initialState = {
      user: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: ''
    };
    
    expect(authReducer(undefined, { type: undefined })).toEqual(expect.objectContaining(initialState));
  });

  // Reset action test
  test('should handle reset action', () => {
    const previousState = {
      user: { id: '1', name: 'Test User' },
      isLoading: false,
      isError: true,
      isSuccess: true,
      message: 'Error message'
    };
    
    expect(authReducer(previousState, reset())).toEqual({
      ...previousState,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: ''
    });
  });

  // Login action tests
  test('should handle login.pending', () => {
    const previousState = {
      user: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: ''
    };
    
    expect(authReducer(previousState, { type: login.pending.type })).toEqual({
      ...previousState,
      isLoading: true,
      isError: false
    });
  });

  test('should handle login.fulfilled', () => {
    const previousState = {
      user: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      message: ''
    };
    
    const user = { id: '1', name: 'Test User' };
    
    expect(authReducer(previousState, { type: login.fulfilled.type, payload: user })).toEqual({
      ...previousState,
      isLoading: false,
      isSuccess: true,
      user
    });
  });

  test('should handle login.rejected', () => {
    const previousState = {
      user: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      message: ''
    };
    
    const errorMessage = 'Invalid credentials';
    
    expect(authReducer(previousState, { type: login.rejected.type, payload: errorMessage })).toEqual({
      ...previousState,
      isLoading: false,
      isError: true,
      message: errorMessage,
      user: null
    });
  });

  // Logout action test
  test('should handle logout.fulfilled', () => {
    const previousState = {
      user: { id: '1', name: 'Test User' },
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: ''
    };
    
    expect(authReducer(previousState, { type: logout.fulfilled.type })).toEqual({
      ...previousState,
      user: null
    });
  });
});
