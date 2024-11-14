import React from 'react';
import {observer} from 'mobx-react';
import {UploadOutlined} from '@ant-design/icons';
import {
  Button,
  Upload,
  UploadFile,
} from 'antd';
import classNames from 'classnames';
import {workOnStore} from '@/stores/workon';
import styles from '../workon.scss';

const cn = classNames.bind(styles);

const fileList: UploadFile[] = [];

const handleEditWorkOnProduct = () => {
  workOnStore.seIsOpenEditProductModal(true);
};

export const WorkOnFile = observer(() => (
  <>
    <div className={cn('workon--file__card')}>
      <div className={cn('workon--file__upload-button')}>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture"
          defaultFileList={fileList}
          multiple
          beforeUpload={() => false}
          style={{width: '100%'}}
        >
          <Button icon={<UploadOutlined />}>Добавить файл</Button>
        </Upload>
      </div>

      <div className={cn('workon--file__buttons-card')}>
        <div>
          <span>Оценка продавца</span>
        </div>
        <div className={cn('workon--file__buttons')}>
          {/* <Button onClick={handleEditWorkOnProduct}>
            Редактировать
          </Button> */}
          <Button type="primary">Заканчивать</Button>
        </div>
      </div>
    </div>
  </>
));
