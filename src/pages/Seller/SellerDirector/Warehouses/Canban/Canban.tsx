import React from 'react';
import {observer} from 'mobx-react';
import {useQuery} from '@tanstack/react-query';
import {showroomApi} from '@/api/showroom';
import {sellerShowroomsStore} from '@/stores/seller';
import {Tasks} from './Users';

export const Canban = observer(() => {
  const {data: getAllShowroom} = useQuery({
    queryKey: ['getAllShowrooms'],
    queryFn: () => showroomApi.getAllShowroom(),
  });

  const columns = getAllShowroom?.map(showroom => ({
    id: showroom?.id,
    name: showroom?.name,
    address: showroom?.address,
  }));

  return <Tasks tasks={sellerShowroomsStore?.showroomUsers} columns={columns || []} />;
});
