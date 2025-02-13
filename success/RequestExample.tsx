import { useState, useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';

// 定义数据类型
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const RequestExample = () => {
  const [todoId, setTodoId] = useState(1);

  // 获取待办列表
  const { 
    data: todos, 
    loading: listLoading,
    error: listError,
    run: fetchTodos 
  } = useRequest<Todo[]>({
    url: '/todos',
    method: 'GET',
    params: { _limit: 5 }
  }, {
    manual: true,
    onSuccess: (data) => {
      console.log('获取列表成功:', data.length);
    }
  });

  // 获取单个待办
  const { 
    data: todo, 
    loading: detailLoading,
    error: detailError,
    run: fetchTodo 
  } = useRequest<Todo>({
    url: `/todos/${todoId}`,
    method: 'GET'
  }, { 
    manual: true 
  });

  // 创建待办
  const { 
    loading: createLoading,
    error: createError,
    run: createTodo 
  } = useRequest<Todo>({
    url: '/todos',
    method: 'POST'
  }, { 
    manual: true,
    onSuccess: () => {
      fetchTodos();  // 创建成功后刷新列表
    }
  });

  // 初始加载
  useEffect(() => {
    fetchTodos();
  }, []);

  // 创建待办
  const handleCreate = () => {
    createTodo({
      data: {
        title: '新待办事项',
        completed: false,
        userId: 1
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 待办列表 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          待办列表
          <Button 
            size="small" 
            onClick={() => fetchTodos()}
            sx={{ ml: 2 }}
          >
            刷新
          </Button>
        </Typography>
        
        {listError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            获取列表失败: {listError.message}
          </Alert>
        )}

        {listLoading ? (
          <CircularProgress />
        ) : (
          <Box>
            {todos?.map(item => (
              <Box 
                key={item.id} 
                sx={{ 
                  mb: 1, 
                  p: 2, 
                  border: '1px solid #eee',
                  borderRadius: 1
                }}
              >
                <Typography>
                  {item.completed ? '✅' : '⭕️'} {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* 获取单个待办 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>获取单个待办</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="number"
            label="待办ID"
            value={todoId}
            onChange={(e) => setTodoId(Number(e.target.value))}
            size="small"
          />
          <Button 
            variant="contained"
            onClick={() => fetchTodo()}
            disabled={detailLoading}
          >
            获取
          </Button>
        </Box>

        {detailError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            获取详情失败: {detailError.message}
          </Alert>
        )}

        {detailLoading ? (
          <CircularProgress />
        ) : todo ? (
          <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              {todo.completed ? '✅' : '⭕️'} {todo.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {todo.id}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {/* 创建待办 */}
      <Box>
        <Typography variant="h6" gutterBottom>创建待办</Typography>
        {createError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            创建失败: {createError.message}
          </Alert>
        )}
        <Button 
          variant="contained"
          onClick={handleCreate}
          disabled={createLoading}
        >
          {createLoading ? '创建中...' : '创建待办'}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestExample;