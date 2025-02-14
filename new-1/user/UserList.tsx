import { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useUserApi } from '../../api/user';

const UserList = () => {
  const { 
    data, 
    loading, 
    error,
    run: fetchUsers 
  } = useUserApi.useGetUsers();

  useEffect(() => {
    console.log('开始获取数据...');
    fetchUsers().then(() => {
      console.log('数据获取完成，当前数据:', data);
    });
  }, []);

  // 添加数据结构调试
  console.log('渲染时的数据状态:', {
    loading,
    error,
    hasData: !!data,
    dataStructure: data ? Object.keys(data) : null
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  // 修改数据检查逻辑
  if (!data) {
    return <Typography>暂无数据</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        数据列表
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {Array.isArray(data) ? data.map(item => (
          <Box 
            key={item.id}
            sx={{
              p: 2,
              border: '1px solid #eee',
              borderRadius: 1
            }}
          >
            <Typography variant="subtitle1">{item.title}</Typography>
            <Typography color="text.secondary">{item.body}</Typography>
          </Box>
        )) : (
          <Typography>数据格式不正确</Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserList;