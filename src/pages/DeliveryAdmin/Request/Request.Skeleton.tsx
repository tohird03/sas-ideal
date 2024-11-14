import React from 'react';
import {Skeleton} from 'antd';

export const RequestSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', height: '130px', border: '1px solid #d9d9d9'}} block />
    <Skeleton.Button active style={{width: '100%', height: '130px', border: '1px solid #d9d9d9'}} block />
    <Skeleton.Button active style={{width: '100%', height: '130px', border: '1px solid #d9d9d9'}} block />
    <Skeleton.Button active style={{width: '100%', height: '130px', border: '1px solid #d9d9d9'}} block />
  </>
);
