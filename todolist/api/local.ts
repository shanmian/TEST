import { LocalResponse, LocalData } from './types/local';
import useRequest from '../hooks/useRequest';

export const useLocalApi = {
  // 获取本地 JSON 数据
  useGetLocalData() {
    return useRequest<LocalResponse>({
      url: '/data.json',
      method: 'GET'
    }, {
      manual: true,
      onSuccess: (data) => {
        console.log('获取本地数据成功:', data);
      }
    });
  }
};