import React, {FC, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {CloseCircleTwoTone, EditTwoTone} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from 'antd';
import {ROUTES} from '@/constants';
import {mainStorekeeperStore} from '@/stores/mainStorekkeper';
import {addNotification} from '@/utils';

type Props = {
  id: string;
  statusName: string;
};

export const ApplicationsActions: FC<Props> = ({id, statusName}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const {mutate: deleteApplicationFunc} = useMutation({
    mutationFn: (id: string) =>
      mainStorekeeperStore.deleteApplication(id),
    onSuccess: () => {

      queryClient.invalidateQueries({queryKey: ['getAllApplications']});
      addNotification('Успешно завершено');

    },
    onError: addNotification,
    onSettled: async () => {
      setDeleteLoading(false);
    },
  });
  const handleDelete = () => {
    deleteApplicationFunc(id);
  };

  const handleEdit = () => {
    navigate(`${ROUTES.mainStorekeeperApplicationAddEdit}/${id}`);
  };

  return (
    <>
      <div>
        <Button
          disabled={Boolean(statusName !== 'active')}
          onClick={handleEdit}
          icon={<EditTwoTone />}
          type="text"
          size="large"
        />
        <Button
          onClick={handleDelete}
          loading={deleteLoading}
          icon={<CloseCircleTwoTone twoToneColor={'#F75050'} />}
          type="text"
          size="large"
        />
      </div>
    </>
  );
};
