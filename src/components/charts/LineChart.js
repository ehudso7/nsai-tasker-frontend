import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const LineChart = ({
  data,
  xAxisDataKey,
  lines,
  height = 300,
  colors = ['#0284c7', '#7dd3fc', '#0ea5e9', '#38bdf8', '#0369a1'],
  gridEnabled = true,
  xAxisLabel = '',
  yAxisLabel = '',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
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
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
