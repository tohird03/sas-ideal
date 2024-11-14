import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {warehouseStore} from '@/stores/warehouse';
import {Tasks} from './Users';

export const Canban = observer(() => {
  const {data: getAllWarehouses} = useQuery({
    queryKey: ['getAllWarehouse'],
    queryFn: () => warehouseStore.getAllWarehouses(),
  });

  const columns = getAllWarehouses?.warehouseList?.map(warehouse => ({
    id: warehouse?.id,
    name: warehouse?.name,
    location: warehouse?.location,
    warehouseType: warehouse?.warehouseType?.id,
    description: warehouse?.description,
    companyId: warehouse?.companyId,
  }));

  return <Tasks tasks={warehouseStore?.warehouseUsers} columns={columns || []} />;
});
