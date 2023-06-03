import * as React from 'react';
import 'bootstrap-css-only'
import {Stack, Skeleton} from '@mui/material';
import './Skeleton.css'

export const CustomSkeleton: React.FC = () => {

  return (
    <div className='card'>
      <div className='card-body'>
        <Stack spacing={1}>
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={50} />
        </Stack>
      </div>
    </div>
  );
}
