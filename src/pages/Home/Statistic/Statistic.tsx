import React from 'react';
import Chart from 'react-apexcharts';
import { observer } from 'mobx-react';
import { Calendar, Card } from 'antd';
import classNames from 'classnames';
import styles from './statistic.scss';
import { CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { ordersStore } from '@/stores/products';
import { dateFormat } from '@/utils/getDateFormat';
// eslint-disable-next-line import/no-extraneous-dependencies
import CountUp from 'react-countup';

const cn = classNames.bind(styles);
const formatter = (value: number) => <CountUp duration={2} end={value} separator="." />;

export const Statistic = observer(() => {
  const { data: ordersStatisticData, isLoading: loading } = useQuery({
    queryKey: ['getOrdersStatistic'],
    queryFn: () => ordersStore.getOrdersStatistic(),
  });

  const chartOptions = {
    options: {
      chart: {
        id: 'basic-bar',
        toolbar: {
          show: true, // Set to false to hide the entire toolbar
          tools: {
            zoom: false, // Disables zoom button
            zoomin: false, // Disables zoom-in button
            zoomout: false, // Disables zoom-out button
            pan: false,
            reset: false,
          },
        },
      },
      stroke: {
        stroke: {
          curve: 'smooth', // Makes the line smooth
          dashArray: 0, // Solid line
        },
        fill: {
          color: 'red',
          pattern: {
            strokeWidth: 10,
            style: 'none',
            width: 100,
          },
        },
      },
      xaxis: {
        categories: ordersStatisticData?.weeklyChart?.map(value => dateFormat(value?.date)),
      },
      yaxis: {
        tickAmount: 10, // Adjust the number of Y-axis grid lines
      },
      markers: {
        size: 6, // Size of markers
        colors: ['#fff'], // Marker color
        strokeColors: '#f18024', // Border color of markers
        strokeWidth: 2, // Border width of markers
        hover: {
          size: 8,
        },
      },
      dataLabels: {
        enabled: false, // Yozuvlarni (value) o'chirish
      },
      colors: ['#f18024'],
    },
    series: [
      {
        name: 'Sotuv',
        data: ordersStatisticData?.weeklyChart?.map(value => value?.sum || 0) || [],
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', padding: '30px' }}>
      <div className={cn('statistic__top-wrapper')}>
        <div className={cn('statistic__top-order')}>
          <h3 className={cn('statistic__top-heading')}>Sotuvlar</h3>
          <div className={cn('statistic__top-order-card')}>
            <Card className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Bugun</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.todaySales || 0)}
              </p>
            </Card>
            <Card className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Shu hafta</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.weeklySales || 0)}
              </p>
            </Card>
            <Card className={cn('statistic__top-card')}>
              <CalendarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Shu oy</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.monthlySales || 0)}
              </p>
            </Card>
          </div>
        </div>
        <div className={cn('statistic__top-order')}>
          <h3 className={cn('statistic__top-heading')}>O&apos;zaro hisob kitoblar</h3>
          <div className={cn('statistic__top-order-card-calc')}>
            <Card className={cn('statistic__top-card')}>
              <DollarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Bizga qarz</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.fromDebt || 0)}
              </p>
            </Card>
            <Card className={cn('statistic__top-card')}>
              <DollarOutlined style={{ fontSize: '40px', color: '#f18024', marginBottom: 5 }} />
              <p className={cn('statistic__top-card-info')}>Bizning qarzimiz</p>
              <p className={cn('statistic__top-card-value')}>
                {formatter(ordersStatisticData?.ourDebt || 0)}
              </p>
            </Card>
          </div>
        </div>
      </div>
      <Card>
        <h1>Bir haftalik sotuv</h1>
        <Chart
          options={chartOptions.options}
          series={chartOptions.series}
          type="area"
          height={350}
        />
      </Card>
    </div>
  );
});
