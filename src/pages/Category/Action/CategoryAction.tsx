import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IAllCategoryWIthSub, ICategories} from '@/api/categories/types';
import {categoriesStore} from '@/stores/categories';

type Props = {
  category: ICategories;
  subCategory: IAllCategoryWIthSub;
};

export const CategoryAction: FC<Props> = observer(({category, subCategory}) => {

  const handleEditProcess = () => {
    categoriesStore.setIsOpenNewCategoryModal(true);
    categoriesStore.setSingleCategory(category);
    categoriesStore.setSubSingleCategory(subCategory);
  };

  return (
    <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
  );
});
