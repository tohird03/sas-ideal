import React from 'react';
import {Skeleton} from 'antd';

export const FlightProductSkeleton = () => (
  <>
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
    <Skeleton.Button active style={{width: '100%', marginBottom: '5px', height: '90px'}} block />
  </>
);
