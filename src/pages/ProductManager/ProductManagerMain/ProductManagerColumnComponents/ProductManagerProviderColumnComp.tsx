import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {Typography} from 'antd';
import classNames from 'classnames';
import styles from '../productmanagermain.scss';

const cn = classNames.bind(styles);

type Props = {
  providerName: string;
  providerPhone?: string;
};

export const ProductManagerProviderColumnComp: FC<Props> = observer(({
  providerName, providerPhone,
}) => (
  <>
    <div className={cn('productmanagerPrviderColumnWrapp')}>
      <div>
        <img
          src={'/User.png'} alt={'фотография поставщика'}
          className={cn('suplierImgColumn')}
        />
      </div>
      <div>
        <Typography.Title
          style={{margin: 0}}
          level={5}
        >
          {providerName}
        </Typography.Title>
        <Typography.Text>{providerPhone}</Typography.Text>
      </div>
    </div>
  </>
));
