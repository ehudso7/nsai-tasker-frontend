import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../../../components/common/StatusBadge';

describe('StatusBadge Component', () => {
  test('renders with pending status', () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  test('renders with in_progress status', () => {
    render(<StatusBadge status="in_progress" />);
    const badge = screen.getByText('In Progress');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  test('renders with awaiting_review status', () => {
    render(<StatusBadge status="awaiting_review" />);
    const badge = screen.getByText('Awaiting Review');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-purple-100');
    expect(badge).toHaveClass('text-purple-800');
  });

  test('renders with approved status', () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText('Approved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  test('renders with unknown status', () => {
    render(<StatusBadge status="unknown_status" />);
    const badge = screen.getByText('Unknown Status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });
});
