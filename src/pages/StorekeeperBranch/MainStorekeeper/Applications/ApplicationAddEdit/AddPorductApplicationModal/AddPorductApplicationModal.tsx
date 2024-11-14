import React, {FC, useState} from 'react';
import {observer} from 'mobx-react';
import {SearchOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Checkbox, Input, Modal, Typography} from 'antd';
import classnamesBind from 'classnames/bind';
import {mainStorekeeperApi} from '@/api/mainStorekeeper';
import {
  IMainStorekeeperProductList,
  IPostRequstProduct,
} from '@/api/mainStorekeeper/types';
import {DataTable} from '@/components/Datatable/datatable';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import styles from '../../apllications.scss';
import {applicationProductColumn} from '../../constants';
const cn = classnamesBind.bind(styles);

type Props = {
  warehouse?: {
    id: string;
    name: string;
  };
};
export const AddPorductApplicationModal: FC<Props> = observer(
  ({warehouse}) => {
    const isMobile = useMediaQuery('(max-width: 800px)');
    const queryClient = useQueryClient();
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [selectedARowsData, setSelectedRowsData] = useState<
    IMainStorekeeperProductList[]
    >([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const handleModalClose = () => {
      mainStorekeeperStore.setisOpenAddProductApplicationModal(false);
      setSelectedRowKeys([]);
    };

    const onSelectChange = (
      selectedRowKeys: React.Key[],
      selectedRows: IMainStorekeeperProductList[]
    ) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRowsData(selectedRows);
    };


    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const {data: applicationProducts, isLoading: applicationProductsLoading} =
      useQuery({
        queryKey: [
          'getApplicationProducts',
          mainStorekeeperStore.applicationProductSearch,
          mainStorekeeperStore.applicationProductsPageNumber,
          mainStorekeeperStore.applicationProductsPageSize,
          mainStorekeeperStore.isOpenAddProductApplicationModal,
        ],
        queryFn: () =>
          mainStorekeeperApi.getMainStProduct({
            pageNumber: mainStorekeeperStore.applicationProductsPageNumber,
            pageSize: mainStorekeeperStore.applicationProductsPageSize,
            ...(mainStorekeeperStore.applicationProductSearch && {
              name: mainStorekeeperStore.applicationProductSearch,
            }),
            warehouseId: warehouse?.id,
          }),
      });

    const handlePageChange = (page: number, pageSize: number | undefined) => {
      mainStorekeeperStore.setApplicationProductsPageSize(pageSize!);
      mainStorekeeperStore.setApplicationProductsPageNumber(page);
    };

    const {mutate: postReqProducts} = useMutation({
      mutationFn: (params: IPostRequstProduct) =>
        mainStorekeeperStore.postReqProducts(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getAllApplications']});
        queryClient.invalidateQueries({queryKey: ['getByIdProduct']});
        addNotification('Успешно завершено');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setPostLoading(false);
      },
    });

    const handleModalOk = () => {
      if (mainStorekeeperStore?.localApplication && selectedARowsData?.length) {
        const products = selectedARowsData?.map((el) => ({
          productId: el?.id,
          quantity: el?.quantity,
          statusId: el?.productStatus?.id,
        }));

        postReqProducts({
          requestId: mainStorekeeperStore.localApplication?.id,
          products,
        });
      }
    };

    const handleSearchAppProducts = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      mainStorekeeperStore.setApplicationProductSearch(e.target.value.trim());
    };

    return (
      <>
        <Modal
          open={mainStorekeeperStore.isOpenAddProductApplicationModal}
          onOk={handleModalOk}
          onCancel={handleModalClose}
          confirmLoading={postLoading}
          title={`Продукты на складе ${warehouse?.name}`}
          centered
          width={'1200px'}
          footer={
            <>
              <div className={cn('reqProductsModalFooter')}>
                <span>
                  <Checkbox checked={Boolean(selectedRowKeys?.length)} /> &nbsp;
                  <Typography.Text>
                    Выбрали {selectedRowKeys?.length} шт
                  </Typography.Text>
                </span>
                <Button
                  type={'primary'}
                  disabled={Boolean(!selectedARowsData?.length)}
                  loading={postLoading}
                  onClick={handleModalOk}
                >
                  Сохранить
                </Button>
              </div>
            </>
          }
        >
          <div className={cn('reqProductsSearchWrapp')}>
            <Input
              placeholder="введите текст для поиска"
              onChange={handleSearchAppProducts}
              addonAfter={<SearchOutlined />}
            />
          </div>
          <DataTable
            isMobile={isMobile}
            loading={applicationProductsLoading}
            data={applicationProducts?.productList || []}
            columns={applicationProductColumn}
            pagination={{
              total: applicationProducts?.count,
              current: applicationProducts?.pageNumber,
              pageSize: applicationProducts?.pageSize,
              showSizeChanger: true,
              onChange: handlePageChange,
              ...getPaginationParams(applicationProducts?.count),
            }}
            rowSelection={rowSelection}
            rowKey="id"
          />
        </Modal>
      </>
    );
  }
);
