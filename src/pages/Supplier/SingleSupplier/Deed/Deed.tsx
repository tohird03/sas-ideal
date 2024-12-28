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
import { singleSupplierStore } from '@/stores/supplier';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { supplierId } = useParams();

  const { data: supplierDeedData, isLoading: loading } = useQuery({
    queryKey: ['getSupplierDeed', supplierId],
    queryFn: () =>
      singleSupplierStore.getSupplierDeed({
        id: supplierId!,
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
        dataSource={supplierDeedData?.data || []}
        loading={loading}
        bordered
        summary={(pageData) => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'center' }}>10;</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'center' }}>10;</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} index={2}>
                <div style={{ textAlign: 'center' }}>10;</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />
    </main>
  );
});
