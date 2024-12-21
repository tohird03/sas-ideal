import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from '@tanstack/react-query';
import { Table, Typography } from 'antd';
import classNames from 'classnames';
import { useMediaQuery } from '@/utils/mediaQuery';
import { deedColumns } from './constants';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import styles from './deed.scss';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { clientId } = useParams();

  const { data: clientDeedData, isLoading: loading } = useQuery({
    queryKey: ['getDeed', clientId],
    queryFn: () =>
      singleClientStore.getClientDeed({
        id: clientId!,
      }),
  });

  return (
    <main>
      <div className={cn('deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('deed__filter')}>
          {/* FILTER */}
        </div>
      </div>

      <Table
        columns={deedColumns}
        dataSource={clientDeedData?.data || []}
        loading={loading}
        bordered
        summary={(pageData) => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                10$
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                113$
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} index={2}>
                103$
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />
    </main>
  );
});
