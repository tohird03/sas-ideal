import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  Modal,
  Typography,
} from 'antd';
import Table from 'antd/es/table';
import {
  IBaseUpdateWorkOn,
  ICombinationWorkOn,
  IProcessUpdateProcesses,
  IProductUpdateWorkOn,
} from '@/api/product_list/types';
import {basesStore} from '@/stores/base';
import {combinationStore} from '@/stores/combination/combination';
import {processStore} from '@/stores/process';
import {productListStore} from '@/stores/product_list/product_list';
import {workOnStore} from '@/stores/workon';
import {addNotification} from '@/utils';
import {
  workOnCombinationTableColumnModal,
  workOnCompositeTableColumnModal,
  workOnProcessTableColumnModal,
  workOnProductTableModal,
} from '../constants';
import {IWorkOnTabs} from '../types';


export const WorkOnAddModal = observer(() => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const {id} = useParams();
  const [modalLoading, setModalLoading] = useState(false);

  const onSelectChange = (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    setSelectedRows(selectedRows);
    if (workOnStore.isTabsIndex === IWorkOnTabs.Product) {
      productListStore.setSelectedRowData(selectedRows?.map((el) => ({
        id: el?.id,
        quantity: el?.quantity,
      })));
    }

    if (workOnStore.isTabsIndex === IWorkOnTabs.CompositeList) {
      productListStore.setSelectBasesRowData(selectedRows?.map((el) => ({
        id: el?.id,
        quantity: 1,
      })));
    }

  };

  const rowSelection = {
    onChange: onSelectChange,
  };


  const queryClient = useQueryClient();


  const {data: productListData, isLoading: loadingProductList} = useQuery({
    queryKey: ['getProductList',
      productListStore.pageSize,
      productListStore.pageNumber],
    queryFn: () =>
      productListStore.getProductList({
        pageSize: productListStore.pageSize,
        pageNumber: productListStore.pageNumber,
        name: '',
      }),
    enabled: workOnStore.isTabsIndex === IWorkOnTabs.Product && workOnStore.isAddTabsModal,

  });

  const {data: processData, isLoading: loadingProcess} = useQuery({
    queryKey: ['getProcess', processStore.pageNumber, processStore.pageSize, processStore.search],
    queryFn: () =>
      processStore.getProcess({
        pageNumber: processStore.pageNumber,
        pageSize: processStore.pageSize,
        description: processStore.search,
      }),
    enabled: workOnStore.isTabsIndex === IWorkOnTabs.Process && workOnStore.isAddTabsModal,
  });

  const {data: basesData, isLoading: loadingBases} = useQuery({
    queryKey: ['getBases',
      basesStore.name,
      basesStore.pageSize,
      basesStore.pageNumber],
    queryFn: () =>
      basesStore.getBases({
        name: basesStore.name,
        pageSize: basesStore.pageSize,
        pageNumber: basesStore.pageNumber,
        baseCategoryId: basesStore.baseCategoryId!,
      }),
    enabled: workOnStore.isTabsIndex === IWorkOnTabs.CompositeList && workOnStore.isAddTabsModal,
  });

  const {data: combinationData, isLoading: loadingCombination} = useQuery({
    queryKey:
    [
      'getCombination',
      combinationStore.pageSize,
      combinationStore.pageNumber,
    ],
    queryFn: () =>
      combinationStore.getCombination({
        pageSize: combinationStore.pageSize,
        pageNumber: combinationStore.pageNumber,
      }),
    enabled: workOnStore.isTabsIndex === IWorkOnTabs.Combination && workOnStore.isAddTabsModal,
  });

  const {mutate: updateProductWorkOn} = useMutation({
    mutationFn: (params: IProductUpdateWorkOn) => productListStore.patchProductUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setModalLoading(false);
    },
  });

  const {mutate: updateProcesses} = useMutation({
    mutationFn: (params: IProcessUpdateProcesses) => productListStore.patchProcessesUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setModalLoading(false);
    },
  });

  const {mutate: updateBases} = useMutation({
    mutationFn: (params: IBaseUpdateWorkOn) => productListStore.patchBaseUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setModalLoading(false);
    },
  });

  const {mutate: updateCombination} = useMutation({
    mutationFn: (params: ICombinationWorkOn) => productListStore.patchCombinationUpdateWorkOn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['getProductListId']});
      handleModalClose();
    },
    onError: addNotification,
    onSettled: async () => {
      setModalLoading(false);
    },
  });

  const handleSubmit = () => {
    setModalLoading(true);

    const selectedIds = selectedRows.map(row => row.id);

    if (workOnStore.isTabsIndex === IWorkOnTabs.Product){
      updateProductWorkOn({productsToCreate: productListStore.selectedRowdata, productId: id});
    } else if (workOnStore.isTabsIndex === IWorkOnTabs.CompositeList) {
      updateBases({basesToCreate: productListStore.selectBasesRowData, baseId: id});
    } else if (workOnStore.isTabsIndex === IWorkOnTabs.Process){
      updateProcesses({processesToConnect: selectedIds, processId: id});
    } else if (workOnStore.isTabsIndex === IWorkOnTabs.Combination) {
      updateCombination({combinationsToConnect: selectedIds, combinationId: id});
    }
  };

  const handleModalClose = () => {
    workOnStore.setIsAddTabsModal(false);
    productListStore.setSelectedRowData([]);
  };

  const modalTitle =
    workOnStore.isTabsIndex === IWorkOnTabs.Product
      ? 'Новый продукт'
      : workOnStore.isTabsIndex === IWorkOnTabs.CompositeList
        ? 'Новый cостав'
        : workOnStore.isTabsIndex === IWorkOnTabs.Process
          ? 'Новый процесс'
          : 'Комбинация';

  const modalColumns =
  workOnStore.isTabsIndex === IWorkOnTabs.Product
    ? workOnProductTableModal
    : workOnStore.isTabsIndex === IWorkOnTabs.CompositeList
      ? workOnCompositeTableColumnModal
      : workOnStore.isTabsIndex === IWorkOnTabs.Process
        ? workOnProcessTableColumnModal
        : workOnCombinationTableColumnModal;

  let modalData;
  let loading;

  switch (workOnStore.isTabsIndex) {
    case IWorkOnTabs.Product:
      modalData = productListData?.productList;
      loading = loadingProductList;
      break;

    case IWorkOnTabs.CompositeList:
      modalData = basesData?.baseList;
      loading = loadingBases;
      break;

    case IWorkOnTabs.Process:
      modalData = processData?.processList;
      loading = loadingProcess;
      break;

    case IWorkOnTabs.Combination:
      modalData = combinationData?.combinationList;
      loading = loadingCombination;
      break;

    default:
      modalData = [];
      loading = false;
  }

  return (
    <>
      <Modal
        open={workOnStore.isAddTabsModal}
        onOk={handleSubmit}
        onCancel={handleModalClose}
        centered
        width={'60%'}
        confirmLoading={modalLoading}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Typography.Title>{modalTitle}</Typography.Title>
        <Table
          loading={loading}
          columns={modalColumns}
          dataSource={modalData?.filter((el: any) => el?.id !==id)}
          rowSelection={rowSelection}
          rowKey="id"
        />
      </Modal>
    </>
  );
});
