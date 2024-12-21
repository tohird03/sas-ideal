import React from 'react';
import Chart from 'react-apexcharts';
import { observer } from 'mobx-react';
import { Line } from '@ant-design/plots';
import { Card } from 'antd';

export const Statistic = observer(() => {
  const data = [
    { year: '1991', value: 0 },
    { year: '1992', value: 0 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 130 },
  ];
  const chartOptions = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: data?.map(value => value?.year),
      },
      yaxis: {
        tickAmount: 10, // Adjust the number of Y-axis grid lines
      },
      markers: {
        size: 6, // Size of the circles
        strokeWidth: 0, // Removes the border around circles
      },
      colors: ['#46923c'],
    },
    series: [
      {
        name: 'Sotuv',
        data: data?.map(value => value?.value),
      },
    ],
  };

  return (
    <Card>
      <Chart
        options={chartOptions.options}
        series={chartOptions.series}
        type="area"
        height={400}
      />
    </Card>
  );
});
