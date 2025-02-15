import { Todo, CreateTodoParams } from './types/todo';
import useRequest from '../hooks/useRequest';

export const useTodoApi = {
  // 获取待办列表
  useGetTodos() {
    return useRequest<Todo[]>({
      url: '/todos',
      method: 'GET',
      params: {
        _limit: 10  // 限制返回数量
      }
    }, {
      manual: false,  // 改为自动触发
      onSuccess: (data) => {
        console.log('获取待办列表成功:', data);
      }
    });
  },

  // 创建待办
  useCreateTodo() {
    return useRequest<Todo>({
      url: '/todos',
      method: 'POST'
    }, { 
      manual: true,
      onSuccess: (data) => {
        console.log('创建成功:', data);
      }
    });
  }
};