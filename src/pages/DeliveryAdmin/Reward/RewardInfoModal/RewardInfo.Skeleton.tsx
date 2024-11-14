import React from 'react';
import {Skeleton} from 'antd';

export const RewardInfoSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', height: '200px', border: '1px solid #d9d9d9'}} block />
  </>
);


export const RewardProductSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
  </>
);
