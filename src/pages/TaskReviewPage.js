import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTaskById } from '../store/slices/taskSlice';
import { submitReview, skipReview, reset } from '../store/slices/reviewSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const TaskReviewPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [reviewData, setReviewData] = useState({
    decision: '',
    feedback: '',
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { currentTask, isLoading: taskLoading } = useSelector((state) => state.tasks);
  const { isLoading: reviewLoading, isError, isSuccess, message } = useSelector(
    (state) => state.reviews
  );
  
  const isLoading = taskLoading || reviewLoading;

  useEffect(() => {
    // Ensure the user is a reviewer
    if (user && user.role !== 'reviewer' && user.role !== 'admin') {
      navigate('/dashboard');
    }
    
    dispatch(getTaskById(taskId));
    
    return () => {
      dispatch(reset());
    };
  }, [user, taskId, navigate, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/reviews');
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value,
    });
  };

  const handleSubmitReview = () => {
    if (!reviewData.decision) {
      return; // Require a decision to be selected
    }
    
    dispatch(submitReview({ taskId, reviewData }));
  };

  const handleSkipReview = () => {
    dispatch(skipReview(taskId));
    navigate('/reviews');
  };

  const openConfirmation = (decision) => {
    setReviewData({
      ...reviewData,
      decision,
    });
    setConfirmationOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!currentTask) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
        <p>The task you are looking for does not exist or you do not have permission to review it.</p>
        <button
          onClick={() => navigate('/reviews')}
          className="mt-4 btn-primary"
        >
          Return to Review Queue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Review Task
        </h2>
        <button
          onClick={() => navigate('/reviews')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Queue
        </button>
      </div>
      
      {isError && <ErrorMessage message={message} />}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {currentTask.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Submitted by {currentTask.user_email || 'Unknown'} on {formatDate(currentTask.created_at)}
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1 bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-900 whitespace-pre-line">{currentTask.description}</p>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <div className="mt-1 bg-gray-50 p-3 rounded-md min-h-[200px] max-h-[500px] overflow-y-auto">
                <p className="text-sm text-gray-900 whitespace-pre-line">{currentTask.content}</p>
              </div>
            </div>

            {currentTask.parameters && Object.keys(currentTask.parameters).length > 0 && (
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Task Parameters</label>
                <div className="mt-1 bg-gray-50 p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm text-gray-900">
                    {JSON.stringify(currentTask.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Review Decision
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Provide your decision and feedback
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                Feedback
              </label>
              <div className="mt-1">
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Provide feedback for the user about this task..."
                  value={reviewData.feedback}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => openConfirmation('approved')}
                  className="inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Approve
                </button>
                
                <button
                  type="button"
                  onClick={() => openConfirmation('needs_revision')}
                  className="inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Needs Revision
                </button>
                
                <button
                  type="button"
                  onClick={() => openConfirmation('rejected')}
                  className="inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
            
            <div className="sm:col-span-6 flex justify-center">
              <button
                type="button"
                onClick={handleSkipReview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Skip This Review
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {confirmationOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Confirm Review Decision
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {' '}
                        {reviewData.decision === 'approved' ? 'approve' : 
                         reviewData.decision === 'rejected' ? 'reject' : 
                         'request revision for'} this task?
                        {reviewData.feedback.trim() === '' && (
                          <span className="block mt-2 text-yellow-600">
                            You haven't provided any feedback. Consider adding feedback to help the user understand your decision.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmationOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskReviewPage;
