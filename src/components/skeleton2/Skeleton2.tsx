import 'bootstrap-css-only'
import {Stack, Skeleton} from '@mui/material';
import './Skeleton2.css';
import { get } from '../../services/ApiService';
import { useEffect } from 'react';

export const CustomSkeleton2: React.FC = () => {
  
  useEffect(() => {
    get('/ping').then(response => {
      alert(response.data);
    })
  })


  return (
    <div className='card'>
      <div className='card-body'>
        <Stack spacing={1}>
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="circular" width={60} height={60} />
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="rounded" width={"100%"} height={60} />
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="rounded" width={"100%"} height={60} />
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="rounded" width={"100%"} height={60} />
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="rounded" width={"100%"} height={60} />
          <Skeleton sx={{ bgcolor: '#00B500' }} variant="rounded" width={"100%"} height={50} />
        </Stack>
      </div>
    </div>
  );
}
