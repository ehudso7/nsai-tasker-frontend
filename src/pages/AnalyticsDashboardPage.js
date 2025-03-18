import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getSystemOverview,
  getTaskMetrics,
  getReviewMetrics,
  getAIMetrics,
  getCostAnalysis,
  reset
} from '../store/slices/analyticsSlice';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AnalyticsDashboardPage = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    systemOverview,
    taskMetrics,
    reviewMetrics,
    aiMetrics,
    costAnalysis,
    isLoading,
    isError,
    message
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    // Ensure the user has proper permissions
    if (user && user.role !== 'admin' && user.role !== 'reviewer') {
      navigate('/dashboard');
    }
    
    // Load all analytics data
    dispatch(getSystemOverview(timeframe));
    dispatch(getTaskMetrics({ timeframe }));
    dispatch(getReviewMetrics({ timeframe }));
    dispatch(getAIMetrics({ timeframe }));
    dispatch(getCostAnalysis(timeframe));
    
    return () => {
      dispatch(reset());
    };
  }, [user, dispatch, timeframe]);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (isLoading && (!systemOverview || !taskMetrics || !reviewMetrics || !aiMetrics || !costAnalysis)) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics Dashboard
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
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      {isError && <ErrorMessage message={message} />}
      
      {systemOverview && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              System Overview
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Key performance indicators for the NSAI Tasker system
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Total Tasks</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{systemOverview.totalTasks}</div>
                  <div className="mt-2 flex items-center text-sm">
                    {systemOverview.taskGrowth >= 0 ? (
                      <span className="text-green-600">+{systemOverview.taskGrowth}%</span>
                    ) : (
                      <span className="text-red-600">{systemOverview.taskGrowth}%</span>
                    )}
                    <span className="ml-2 text-gray-500">from previous period</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Completion Rate</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{systemOverview.completionRate}%</div>
                  <div className="mt-2 flex items-center text-sm">
                    {systemOverview.completionRateChange >= 0 ? (
                      <span className="text-green-600">+{systemOverview.completionRateChange}%</span>
                    ) : (
                      <span className="text-red-600">{systemOverview.completionRateChange}%</span>
                    )}
                    <span className="ml-2 text-gray-500">from previous period</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500">Average Review Time</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{systemOverview.avgReviewTime} min</div>
                  <div className="mt-2 flex items-center text-sm">
                    {systemOverview.avgReviewTimeChange <= 0 ? (
                      <span className="text-green-600">{systemOverview.avgReviewTimeChange}%</span>
                    ) : (
                      <span className="text-red-600">+{systemOverview.avgReviewTimeChange}%</span>
                    )}
                    <span className="ml-2 text-gray-500">from previous period</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500">AI Cost / Task</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(systemOverview.costPerTask)}</div>
                  <div className="mt-2 flex items-center text-sm">
                    {systemOverview.costPerTaskChange <= 0 ? (
                      <span className="text-green-600">{systemOverview.costPerTaskChange}%</span>
                    ) : (
                      <span className="text-red-600">+{systemOverview.costPerTaskChange}%</span>
                    )}
                    <span className="ml-2 text-gray-500">from previous period</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {taskMetrics && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Task Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Detailed task performance and status distribution
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Task Volume Over Time</h4>
                  <LineChart 
                    data={taskMetrics.volumeOverTime}
                    xAxisDataKey="date"
                    lines={[
                      { dataKey: 'count', name: 'Tasks', color: '#0284c7' }
                    ]}
                    xAxisLabel="Date"
                    yAxisLabel="Task Count"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Task Status Distribution</h4>
                  <PieChart 
                    data={taskMetrics.statusDistribution}
                    dataKey="value"
                    nameKey="status"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Completion Time by Task Type</h4>
                  <BarChart 
                    data={taskMetrics.completionTimeByType}
                    xAxisDataKey="type"
                    bars={[
                      { dataKey: 'avgMinutes', name: 'Avg. Completion Time (min)', color: '#0284c7' }
                    ]}
                    xAxisLabel="Task Type"
                    yAxisLabel="Minutes"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Task Success Rate by Type</h4>
                  <BarChart 
                    data={taskMetrics.successRateByType}
                    xAxisDataKey="type"
                    bars={[
                      { dataKey: 'successRate', name: 'Success Rate (%)', color: '#0ea5e9' }
                    ]}
                    xAxisLabel="Task Type"
                    yAxisLabel="Success Rate (%)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {reviewMetrics && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Review Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Review performance and decision trends
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Reviews Over Time</h4>
                  <LineChart 
                    data={reviewMetrics.reviewsOverTime}
                    xAxisDataKey="date"
                    lines={[
                      { dataKey: 'count', name: 'Reviews', color: '#7dd3fc' }
                    ]}
                    xAxisLabel="Date"
                    yAxisLabel="Review Count"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Review Decision Distribution</h4>
                  <PieChart 
                    data={reviewMetrics.decisionDistribution}
                    dataKey="value"
                    nameKey="decision"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Average Review Time by Reviewer</h4>
                  <BarChart 
                    data={reviewMetrics.reviewTimeByReviewer}
                    xAxisDataKey="reviewer"
                    bars={[
                      { dataKey: 'avgMinutes', name: 'Avg. Review Time (min)', color: '#38bdf8' }
                    ]}
                    xAxisLabel="Reviewer"
                    yAxisLabel="Minutes"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Review Volume by Reviewer</h4>
                  <BarChart 
                    data={reviewMetrics.volumeByReviewer}
                    xAxisDataKey="reviewer"
                    bars={[
                      { dataKey: 'count', name: 'Review Count', color: '#0ea5e9' }
                    ]}
                    xAxisLabel="Reviewer"
                    yAxisLabel="Count"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {aiMetrics && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              AI Operation Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              AI model performance and utilization metrics
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">AI Operations Over Time</h4>
                  <LineChart 
                    data={aiMetrics.operationsOverTime}
                    xAxisDataKey="date"
                    lines={[
                      { dataKey: 'count', name: 'Operations', color: '#075985' }
                    ]}
                    xAxisLabel="Date"
                    yAxisLabel="Operation Count"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Operation Type Distribution</h4>
                  <PieChart 
                    data={aiMetrics.operationTypeDistribution}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Model Usage Distribution</h4>
                  <PieChart 
                    data={aiMetrics.modelUsageDistribution}
                    dataKey="value"
                    nameKey="model"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Average Latency by Model</h4>
                  <BarChart 
                    data={aiMetrics.latencyByModel}
                    xAxisDataKey="model"
                    bars={[
                      { dataKey: 'avgLatencyMs', name: 'Avg. Latency (ms)', color: '#0c4a6e' }
                    ]}
                    xAxisLabel="Model"
                    yAxisLabel="Milliseconds"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {costAnalysis && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Cost Analysis
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Cost trends and breakdown by model and operation type
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Daily Cost Trend</h4>
                  <LineChart 
                    data={costAnalysis.costOverTime}
                    xAxisDataKey="date"
                    lines={[
                      { dataKey: 'cost', name: 'Cost', color: '#0ea5e9' }
                    ]}
                    xAxisLabel="Date"
                    yAxisLabel="Cost ($)"
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Cost Distribution by Model</h4>
                  <PieChart 
                    data={costAnalysis.costByModel}
                    dataKey="cost"
                    nameKey="model"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Cost Distribution by Operation Type</h4>
                  <PieChart 
                    data={costAnalysis.costByOperationType}
                    dataKey="cost"
                    nameKey="type"
                    innerRadius={60}
                  />
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Cost Per Operation by Model</h4>
                  <BarChart 
                    data={costAnalysis.costPerOperationByModel}
                    xAxisDataKey="model"
                    bars={[
                      { dataKey: 'costPerOperation', name: 'Cost Per Operation', color: '#0284c7' }
                    ]}
                    xAxisLabel="Model"
                    yAxisLabel="Cost ($)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPage;
