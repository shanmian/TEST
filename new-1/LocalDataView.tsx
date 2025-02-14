import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useLocalApi } from '../../api/local';

const LocalDataView = () => {
  const { 
    data, 
    loading, 
    error,
    run: fetchData 
  } = useLocalApi.useGetLocalData();

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        加载失败：{error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        本地数据
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 2 }}>
        {data?.data?.map(item => (
          <Box 
            key={item.id}
            sx={{
              p: 2,
              border: '1px solid #eee',
              borderRadius: 1
            }}
          >
            <Typography variant="h6">{item.name}</Typography>
            <Typography color="text.secondary">
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LocalDataView;