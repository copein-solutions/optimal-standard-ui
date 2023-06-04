import * as React from 'react';
import { Stack, Skeleton } from "@mui/material";
import { MainContainer } from "../mainContainer/MainContainer";
import "bootstrap-css-only";
import "./Skeleton.css";

export const CustomSkeleton: React.FC = () => {
  return (
    <MainContainer>
      <Stack spacing={1}>
        <Skeleton variant="circular" width={60} height={60} />
        <Skeleton variant="rounded" width={"100%"} height={60} />
        <Skeleton variant="rounded" width={"100%"} height={60} />
        <Skeleton variant="rounded" width={"100%"} height={60} />
        <Skeleton variant="rounded" width={"100%"} height={60} />
        <Skeleton variant="rounded" width={"100%"} height={50} />
      </Stack>
    </MainContainer>
  );
};
