import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getReviewQueue, getReviewerMetrics, reset } from '../store/slices/reviewSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ReviewQueuePage = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { reviewQueue, reviewMetrics, isLoading, isError, message } = useSelector(
    (state) => state.reviews
  );

  useEffect(() => {
    // Ensure the user is a reviewer
    if (user && user.role !== 'reviewer' && user.role !== 'admin') {
      navigate('/dashboard');
    }
    
    dispatch(getReviewQueue());
    dispatch(getReviewerMetrics(timeframe));
    
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch, timeframe]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleReviewTask = (taskId) => {
    navigate(`/reviews/tasks/${taskId}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Review Queue
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      {isError && <ErrorMessage message={message} />}
      
      {reviewMetrics && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Review Metrics
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your review performance metrics
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6">
              <div className="text-center">
                <span className="block text-2xl font-bold">{reviewMetrics.reviews_completed || 0}</span>
                <span className="block text-sm text-gray-500">Reviews Completed</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{reviewMetrics.approved_count || 0}</span>
                <span className="block text-sm text-gray-500">Approved</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{reviewMetrics.rejected_count || 0}</span>
                <span className="block text-sm text-gray-500">Rejected</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{reviewMetrics.revision_count || 0}</span>
                <span className="block text-sm text-gray-500">Needs Revision</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">
                  {reviewMetrics.average_review_time_seconds
                    ? Math.round(reviewMetrics.average_review_time_seconds / 60)
                    : 0}
                </span>
                <span className="block text-sm text-gray-500">Avg. Review Time (min)</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tasks Awaiting Review
          </h3>
          {reviewQueue.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500">
              No tasks are currently awaiting review.
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              {reviewQueue.length} tasks awaiting your review
            </p>
          )}
        </div>
        
        {reviewQueue.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewQueue.map((item) => (
                  <tr key={item.task_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.user_email || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.priority === 'high' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          High
                        </span>
                      ) : item.priority === 'medium' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Medium
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleReviewTask(item.task_id)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQueuePage;
