import { useEffect, useState } from 'react';
import { useTodoApi } from '../../api/todo';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button,
  TextField,
  Alert
} from '@mui/material';

const TodoList = () => {
  const [newTitle, setNewTitle] = useState('');
  
  const { 
    data: todos, 
    loading, 
    error,
    refresh,
    run: fetchTodos  // 添加 run 方法
  } = useTodoApi.useGetTodos();

  // 添加初始化请求
  useEffect(() => {
    console.log('开始获取待办列表...');
    fetchTodos().catch(err => {
      console.error('获取待办列表失败:', err);
    });
  }, []);

  // 创建待办
  const {
    run: createTodo,
    loading: creating
  } = useTodoApi.useCreateTodo();

  // 处理创建
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    try {
      await createTodo({
        data: {
          title: newTitle,
          completed: false,
          userId: 1
        }
      });
      setNewTitle('');
      refresh(); // 刷新列表
    } catch (err) {
      console.error('创建失败:', err);
    }
  };

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
        待办事项 ({todos?.length || 0})
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="输入待办事项"
        />
        <Button 
          variant="contained"
          onClick={handleCreate}
          disabled={creating}
        >
          添加
        </Button>
        <Button 
          variant="contained"
          onClick={refresh}
        >
          refresh
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {todos?.map(todo => (
          <Box 
            key={todo.id}
            sx={{
              p: 2,
              border: '1px solid #eee',
              borderRadius: 1
            }}
          >
            <Typography>{todo.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TodoList;