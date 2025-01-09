import React, { FC, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, DownOutlined, DownloadOutlined, EditOutlined, EyeOutlined, MoreOutlined, PrinterOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import { addNotification } from '@/utils';
import { IOrder } from '@/api/order/types';
import { ordersStore } from '@/stores/products';
import { ordersApi } from '@/api/order';
import { jsPDF as JsPdf } from 'jspdf';
import { Pdf } from './PDF/pdf';
import Item from 'antd/es/list/Item';

type Props = {
  orders: IOrder;
};

export const Action: FC<Props> = observer(({ orders }) => {
  const queryClient = useQueryClient();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { mutate: deleteOrder } =
    useMutation({
      mutationKey: ['deleteOrder'],
      mutationFn: (id: string) => ordersApi.deleteOrder(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      },
      onError: addNotification,
    });

  const handleShowOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setIsOpenShowOrderModal(true);
  };

  const handleEditOrder = () => {
    ordersStore.setSingleOrder(orders);
    ordersStore.setOrder(orders);
    ordersStore.setIsOpenAddEditNewOrderModal(true);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    ordersApi.getUploadOrderToExel({
      startDate: ordersStore?.startDate!,
      endDate: ordersStore?.endDate!,
      orderId: orders?.id,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'order.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const handleDelete = () => {
    deleteOrder(orders?.id);
  };

  const targetRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    if (targetRef.current) {
      const doc = new JsPdf({ unit: 'mm', format: 'a4' }); // You can change 'a4' to 'letter', 'a3', etc.

      const fontSize = 40;

      doc.setFontSize(fontSize);

      doc.html(targetRef.current, {
        callback: (doc) => {
          doc.save(`${orders?.client?.name}.pdf`);
        },
        x: 10,
        y: 10,
      });
    }
  };

  const menuSaveOptions = (
    <Menu style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Item key="excel">
        <Button
          onClick={handleDownloadExcel}
          icon={<DownloadOutlined />}
          loading={downloadLoading}
        >
          Excelda yuklash
        </Button>
      </Item>
      <Item key="check">
        <Button
          onClick={generatePDF}
          icon={<PrinterOutlined />}
        >
          Chekka chiqarish
        </Button>
      </Item>
    </Menu>
  );

  const menuOrderOptions = (
    <Menu style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Item key="edit">
        <Button onClick={handleEditOrder} icon={<EditOutlined />} >
          Sotuvni tahrirlash
        </Button>
      </Item>
      <Item key="delete">
        <Popconfirm
          title="Sotuvni o'chirish"
          description="Rostdan ham bu sotuvni o'chirishni xohlaysizmi?"
          onConfirm={handleDelete}
          okText="Ha"
          okButtonProps={{ style: { background: 'red' } }}
          cancelText="Yo'q"
        >
          <Button icon={<DeleteOutlined />} danger >
            Sotuvni o&lsquo;chirish
          </Button>
        </Popconfirm>
      </Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip placement="top" title="Sotuvni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
      <Dropdown placement="bottomRight" overlay={menuSaveOptions} trigger={['click']}>
        <Button icon={<DownloadOutlined />} />
      </Dropdown>
      <Dropdown placement="bottomRight" overlay={menuOrderOptions} trigger={['click']}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>

      <div style={{display: 'none'}}>
        <Pdf order={orders} ref={targetRef} />
      </div>
    </div>
  );
});
