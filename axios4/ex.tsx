import React, { useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const CancelExample = () => {
  // 自动发起请求
  const { 
    data: autoData, 
    loading: autoLoading, 
    error: autoError 
  } = useAxios<UserData>({
    url: '/api/user',
    method: 'GET'
  });

  // 手动控制请求
  const { 
    data: manualData, 
    loading: manualLoading, 
    error: manualError,
    refetch,
    cancel 
  } = useAxios<UserData>({
    url: '/api/user/detail',
    method: 'GET'
  }, false);

  // 长时间请求示例
  const { 
    loading: longLoading,
    refetch: startLongRequest,
    cancel: cancelLongRequest 
  } = useAxios({
    url: '/api/long-task',
    method: 'GET',
    timeout: 30000
  }, false);

  const handleStartLongRequest = () => {
    startLongRequest();
  };

  const handleCancelRequest = () => {
    cancelLongRequest();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 自动请求示例 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">自动请求示例</Typography>
        {autoLoading && <CircularProgress size={20} />}
        {autoError && (
          <Typography color="error">
            错误：{autoError.message}
          </Typography>
        )}
        {autoData && (
          <Box>
            <Typography>用户名：{autoData.name}</Typography>
            <Typography>邮箱：{autoData.email}</Typography>
          </Box>
        )}
      </Box>

      {/* 手动请求示例 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">手动请求示例</Typography>
        <Button 
          variant="contained" 
          onClick={() => refetch()}
          disabled={manualLoading}
          sx={{ mr: 2 }}
        >
          获取数据
        </Button>
        {manualLoading && <CircularProgress size={20} />}
        {manualError && (
          <Typography color="error">
            错误：{manualError.message}
          </Typography>
        )}
        {manualData && (
          <Box sx={{ mt: 2 }}>
            <Typography>用户详情：</Typography>
            <pre>{JSON.stringify(manualData, null, 2)}</pre>
          </Box>
        )}
      </Box>

      {/* 可取消的长时间请求示例 */}
      <Box>
        <Typography variant="h6">可取消的请求示例</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleStartLongRequest}
            disabled={longLoading}
          >
            开始长时间请求
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancelRequest}
            disabled={!longLoading}
          >
            取消请求
          </Button>
          {longLoading && (
            <Typography color="primary">
              请求进行中... <CircularProgress size={20} />
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CancelExample;