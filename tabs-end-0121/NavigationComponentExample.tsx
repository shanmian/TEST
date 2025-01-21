import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import NavigationComponent from './NavigationComponent';

const NavigationComponentExample: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // 标签页模式的内容
  const tabItems = ['首页', '产品', '关于我们'];
  const tabContents = [
    <Typography key="1">这是首页内容</Typography>,
    <Typography key="2">这是产品页内容</Typography>,
    <Typography key="3">这是关于我们页内容</Typography>
  ];

  // 步骤条模式的内容
  const stepItems = ['基本信息', '详细信息', '确认提交'];
  const stepContents = [
    <Box key="1">
      <Typography>第一步：填写基本信息</Typography>
      <Typography>请输入您的姓名和联系方式</Typography>
    </Box>,
    <Box key="2">
      <Typography>第二步：填写详细信息</Typography>
      <Typography>请输入您的详细地址和其他信息</Typography>
    </Box>,
    <Box key="3">
      <Typography>第三步：确认信息</Typography>
      <Typography>请确认您填写的所有信息是否正确</Typography>
    </Box>
  ];

  // 处理步骤完成事件
  const handleFinish = () => {
    console.log('所有步骤已完成');
  };

  // 处理取消事件
  const handleCancel = () => {
    console.log('操作已取消');
  };

  // 处理索引变化
  const handleChange = (index: number) => {
    setActiveIndex(index);
    console.log(`当前索引: ${index}`);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5">标签页模式 - 水平方向</Typography>
      <NavigationComponent
        type="tabs"
        items={tabItems}
        contents={tabContents}
        activeIndex={activeIndex}
        onChange={handleChange}
      />

      <Typography variant="h5">标签页模式 - 垂直方向</Typography>
      <NavigationComponent
        type="tabs"
        items={tabItems}
        contents={tabContents}
        orientation="vertical"
      />

      <Typography variant="h5">步骤条模式 - 水平方向</Typography>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        onFinish={handleFinish}
        onCancel={handleCancel}
      />

      <Typography variant="h5">步骤条模式 - 垂直方向</Typography>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        orientation="vertical"
        onFinish={handleFinish}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default NavigationComponentExample;