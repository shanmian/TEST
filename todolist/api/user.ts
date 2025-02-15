import { User, UserListResponse, CreateUserParams } from './types/user';
import useRequest from '../hooks/useRequest';

// 用户相关 API 封装
export const useUserApi = {
  // 获取用户列表
  useGetUsers() {
    return useRequest<UserListResponse>({
      url: '/posts',  // 修改为实际可用的测试接口
      method: 'GET'
    }, {
      manual: true,
      onSuccess: (data) => {
        console.log('获取数据成功:', data);
      },
      onError: (error) => {
        console.log('获取数据失败:', error);
      }
    });
  }
};