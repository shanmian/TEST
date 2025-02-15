# useRequest Hook

一个基于 Axios 的 React 请求 Hook，用于处理 HTTP 请求。

## 特性

- 自动/手动触发请求
- 请求状态管理（loading, error, data）
- 请求取消和防重复
- 支持请求重试和刷新
- TypeScript 支持
- 错误处理
## 基础用法
### 自动发起请求
const { data, loading, error } = useRequest<UserInfo>({
  url: '/api/user',
  method: 'GET'
});
### 手动触发请求
const { run, data, loading } = useRequest<UserInfo>({
  url: '/api/user',
  method: 'GET'
}, {
  manual: true
});

### 带参数请求
```typescript
const { run } = useRequest({
  url: '/api/user',
  method: 'POST'
}, { manual: true });

// 发送请求
run({
  data: {
    name: 'test',
    age: 18
  }
});
 ```

 ## 注意事项
1. 组件卸载时会自动取消未完成的请求
2. refresh 方法会使用最后一次请求的配置重新发起请求
3. reset 方法会重置所有状态到初始值
4. 默认情况下，重复请求会被自动取消