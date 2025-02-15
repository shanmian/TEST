import { Post, PostListParams, PostCreateParams } from './types/post';
import useRequest from '../hooks/useRequest';

export const usePostApi = {
  // 获取文章列表
  useGetPosts(params?: PostListParams) {
    return useRequest<Post[]>({
      url: '/posts',
      method: 'GET',
      params
    }, {
      manual: true,
      onSuccess: (data) => {
        console.log('获取文章列表成功:', data?.length);
      }
    });
  },

  // 获取文章详情
  useGetPostDetail(id: number) {
    return useRequest<Post>({
      url: `/posts/${id}`,
      method: 'GET'
    }, { 
      manual: true 
    });
  },

  // 创建文章
  useCreatePost() {
    return useRequest<Post>({  // 只需要定义响应数据类型
      url: '/posts',
      method: 'POST'
    }, { 
      manual: true,
      onSuccess: (data) => {
        console.log('创建文章成功:', data);
      }
    });
  }
};