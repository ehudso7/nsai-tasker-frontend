import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import taskReducer from '../../store/slices/taskSlice';
import reviewReducer from '../../store/slices/reviewSlice';
import analyticsReducer from '../../store/slices/analyticsSlice';

// Create a custom renderer that includes providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        tasks: taskReducer,
        reviews: reviewReducer,
        analytics: analyticsReducer
      },
      preloadedState
    }),
    route = '/',
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
}

// Helper function to create a mock Redux store
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: taskReducer,
      reviews: reviewReducer,
      analytics: analyticsReducer
    },
    preloadedState
  });
}
