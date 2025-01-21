import React, { useState, memo, ReactNode } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  SxProps,
  Theme,
} from '@mui/material';

/**
 * TabPanel 接口定义
 * @interface TabPanelProps
 * @property {ReactNode} children - 面板内容
 * @property {number} value - 当前激活的面板索引
 * @property {number} index - 当前面板的索引
 */
interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

/**
 * NavigationComponent 接口定义
 * @interface NavigationComponentProps
 * @property {('tabs'|'stepper')} type - 导航类型，可选标签页或步骤条
 * @property {ReactNode[]} items - 导航项标题数组
 * @property {ReactNode[]} contents - 导航项内容数组
 * @property {number} activeIndex - 初始激活项的索引
 * @property {(index: number) => void} onChange - 导航项切换时的回调函数
 * @property {SxProps<Theme>} sx - Material-UI样式属性
 * @property {('horizontal'|'vertical')} orientation - 导航方向
 */
interface NavigationComponentProps {
  type?: 'tabs' | 'stepper';
  items: ReactNode[];
  contents: ReactNode[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  sx?: SxProps<Theme>;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * TabPanel 组件 - 用于显示标签页内容
 * @param props - 组件属性
 * @returns JSX.Element
 */
const TabPanel = memo(({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
});

/**
 * NavigationComponent 组件 - 可切换的导航组件，支持标签页和步骤条两种模式
 * @param props - 组件属性
 * @returns JSX.Element
 */
const NavigationComponent: React.FC<NavigationComponentProps> = ({
  type = 'tabs',
  items = [],
  contents = [],
  activeIndex = 0,
  onChange,
  sx,
  orientation = 'horizontal',
}) => {
  // 当前激活项的索引状态
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  /**
   * 处理导航项切换事件
   * @param _event - React合成事件
   * @param newValue - 新的索引值
   */
  const handleChange = (_event: React.SyntheticEvent | null, newValue: number) => {
    setCurrentIndex(newValue);
    onChange?.(newValue);
  };

  /**
   * 标签页模式组件
   * @returns JSX.Element
   */
  const TabsComponent = () => (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentIndex} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          orientation={orientation}
        >
          {items.map((item, index) => (
            <Tab key={index} label={item} />
          ))}
        </Tabs>
      </Box>
      {contents.map((content, index) => (
        <TabPanel key={index} value={currentIndex} index={index}>
          {content}
        </TabPanel>
      ))}
    </>
  );

  /**
   * 步骤条模式组件
   * @returns JSX.Element
   */
  const StepperComponent = () => (
    <>
      <Stepper 
        activeStep={currentIndex} 
        orientation={orientation}
        sx={{ p: 3 }}
        nonLinear
      >
        {items.map((label, index) => (
          <Step 
            key={index} 
            onClick={() => handleChange(null, index)}
            sx={{ cursor: 'pointer' }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ p: 3 }}>
        {contents[currentIndex] || <Typography>暂无内容</Typography>}
      </Box>
    </>
  );

  return (
    <Paper elevation={3} sx={{ width: '100%', ...sx }}>
      {type === 'tabs' ? <TabsComponent /> : <StepperComponent />}
    </Paper>
  );
};

export default NavigationComponent;