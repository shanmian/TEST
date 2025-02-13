import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserResponse {
  users: User[];
  code:number;
  data: {
    users: User[];
  }
}

const UserExample = () => {
  const { 
    data, 
    loading, 
    error,
    run: fetchUsers 
  } = useRequest<UserResponse>({
    url: '/user.json',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (data) => {
      console.log('获取用户列表成功:', data);
    },
    onError: (error) => {
      console.log('获取用户列表失败:', error);
    }
  });

  useEffect(() => {
    fetchUsers();
  }, []);
const a =data?.data.users;
console.log(a)
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        用户列表
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          加载失败：{error.message}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {data?.data.users?.map(user => (
            <Box 
              key={user.id}
              sx={{
                p: 2,
                border: '1px solid #eee',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {user.name}
                <Typography 
                  component="span" 
                  sx={{ 
                    ml: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: user.role === 'admin' ? 'error.100' : 'info.100',
                    color: user.role === 'admin' ? 'error.700' : 'info.700',
                    fontSize: '0.75rem'
                  }}
                >
                  {user.role}
                </Typography>
              </Typography>
              <Typography color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserExample;