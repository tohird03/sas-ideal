import React from 'react';
import {Skeleton} from 'antd';

export const RequestInfoSkeleton = () => (
  <>
    <Skeleton active />
    <Skeleton active />
  </>
);

export const RequestInfoProductSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
  </>
);
