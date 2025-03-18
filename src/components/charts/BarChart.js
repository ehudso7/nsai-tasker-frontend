import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const BarChart = ({
  data,
  xAxisDataKey,
  bars,
  height = 300,
  colors = ['#0284c7', '#7dd3fc', '#0ea5e9', '#38bdf8', '#0369a1'],
  gridEnabled = true,
  xAxisLabel = '',
  yAxisLabel = '',
  stacked = false,
  barSize = null
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        barSize={barSize}
      >
        {gridEnabled && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          dataKey={xAxisDataKey}
          label={{
            value: xAxisLabel,
            position: 'insideBottomRight',
            offset: -10
          }}
        />
        <YAxis
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft'
          }}
        />
        <Tooltip />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color || colors[index % colors.length]}
            stackId={stacked ? 'stack' : null}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
