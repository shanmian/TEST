将上述代码转换为 TypeScript (TS) 版本，主要是为状态、动作、Context 等添加类型定义。以下是完整的 TypeScript 实现：

---

### 1. 创建 Context 和 Reducer（TypeScript 版本）

```tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Tabs, Tab } from '@mui/material';

// 定义状态类型
type TabState = {
  value: number; // 当前选中的 Tab 索引
};

// 定义动作类型
type TabAction = {
  type: 'CHANGE_TAB';
  payload: number;
};

// 初始状态
const initialState: TabState = {
  value: 0,
};

// Reducer 函数
const tabReducer = (state: TabState, action: TabAction): TabState => {
  switch (action.type) {
    case 'CHANGE_TAB':
      return {
        ...state,
        value: action.payload,
      };
    default:
      return state;
  }
};

// 创建 Context
type TabContextType = {
  state: TabState;
  dispatch: React.Dispatch<TabAction>;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

// 创建 Provider 组件
type TabProviderProps = {
  children: ReactNode;
};

export const TabProvider = ({ children }: TabProviderProps) => {
  const [state, dispatch] = useReducer(tabReducer, initialState);

  return (
    <TabContext.Provider value={{ state, dispatch }}>
      {children}
    </TabContext.Provider>
  );
};

// 自定义 hook 以便在组件中使用 Context
export const useTab = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};
```

---

### 2. 使用 Context 和 Reducer 扩展 Tab 组件（TypeScript 版本）

```tsx
import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { TabProvider, useTab } from './TabContext';

const CustomTabs = () => {
  const { state, dispatch } = useTab();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch({ type: 'CHANGE_TAB', payload: newValue });
  };

  return (
    <Tabs value={state.value} onChange={handleChange}>
      <Tab label="Tab 1" />
      <Tab label="Tab 2" />
      <Tab label="Tab 3" />
    </Tabs>
  );
};

const App = () => {
  return (
    <TabProvider>
      <CustomTabs />
    </TabProvider>
  );
};

export default App;
```

---

### 3. 代码解释（TypeScript 部分）

1. **类型定义**：
   - `TabState`：定义了状态的结构，包含 `value` 字段。
   - `TabAction`：定义了动作的类型，包含 `type` 和 `payload`。
   - `TabContextType`：定义了 Context 的类型，包含 `state` 和 `dispatch`。

2. **Context 默认值**：
   - 使用 `createContext<TabContextType | undefined>(undefined)`，因为 Context 的默认值可能为 `undefined`，需要在 `useTab` 中进行检查。

3. **类型安全的 `dispatch`**：
   - `dispatch` 的类型是 `React.Dispatch<TabAction>`，确保只能派发符合 `TabAction` 类型的动作。

4. **事件类型**：
   - `handleChange` 函数的 `event` 参数类型为 `React.SyntheticEvent`，`newValue` 参数类型为 `number`，与 MUI 的 `Tabs` 组件的 `onChange` 事件类型一致。

5. **自定义 Hook 的类型检查**：
   - 在 `useTab` 中，检查 `context` 是否为 `undefined`，如果未在 `TabProvider` 中使用，则抛出错误。

---

### 4. 扩展功能（TypeScript 版本）

如果需要扩展功能（例如添加更多状态或动作），只需更新类型定义和 `reducer` 逻辑。例如：

#### 添加禁用 Tab 的功能

```tsx
type TabState = {
  value: number;
  disabledTabs: number[]; // 禁用的 Tab 索引
};

type TabAction =
  | { type: 'CHANGE_TAB'; payload: number }
  | { type: 'DISABLE_TAB'; payload: number[] };

const initialState: TabState = {
  value: 0,
  disabledTabs: [],
};

const tabReducer = (state: TabState, action: TabAction): TabState => {
  switch (action.type) {
    case 'CHANGE_TAB':
      return {
        ...state,
        value: action.payload,
      };
    case 'DISABLE_TAB':
      return {
        ...state,
        disabledTabs: action.payload,
      };
    default:
      return state;
  }
};
```

在组件中使用：

```tsx
const CustomTabs = () => {
  const { state, dispatch } = useTab();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch({ type: 'CHANGE_TAB', payload: newValue });
  };

  return (
    <Tabs value={state.value} onChange={handleChange}>
      <Tab label="Tab 1" disabled={state.disabledTabs.includes(0)} />
      <Tab label="Tab 2" disabled={state.disabledTabs.includes(1)} />
      <Tab label="Tab 3" disabled={state.disabledTabs.includes(2)} />
    </Tabs>
  );
};
```

---

### 5. 总结

通过 TypeScript，我们可以为 MUI 的 `Tab` 组件添加类型安全的 `Context` 和 `Reducer` 管理。这种方式不仅提高了代码的可维护性，还能在开发阶段捕获潜在的类型错误。如果需要扩展功能，只需更新类型定义和 `reducer` 逻辑即可。
