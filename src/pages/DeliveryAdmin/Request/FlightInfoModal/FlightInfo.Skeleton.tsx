import React from 'react';
import {Skeleton} from 'antd';

export const FlightInfoSkeleton = () => (
  <>
    <Skeleton active />
    <Skeleton active />
  </>
);

export const FlightInfoProductSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '80px'}} block />
  </>
);
