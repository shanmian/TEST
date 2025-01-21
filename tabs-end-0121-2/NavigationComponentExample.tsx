import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import NavigationComponent from './NavigationComponent';

const NavigationComponentExample: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Tab mode content
  const tabItems = ['Home', 'Products', 'About Us'];
  const tabContents = [
    <Typography key="1">Welcome to our homepage! Here you can find all the latest updates and news.</Typography>,
    <Typography key="2">Browse through our extensive product catalog and discover amazing deals.</Typography>,
    <Typography key="3">Learn more about our company's mission, vision, and values.</Typography>
  ];

  // Stepper mode content
  const stepItems = ['Basic Info', 'Details', 'Review'];
  const stepContents = [
    <Box key="1">
      <Typography variant="h6" gutterBottom>Step 1: Basic Information</Typography>
      <Typography>Please enter your name and contact information below.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>This information will be used for account creation.</Typography>
    </Box>,
    <Box key="2">
      <Typography variant="h6" gutterBottom>Step 2: Additional Details</Typography>
      <Typography>Please provide your address and other relevant information.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>This helps us personalize your experience.</Typography>
    </Box>,
    <Box key="3">
      <Typography variant="h6" gutterBottom>Step 3: Review & Submit</Typography>
      <Typography>Please review all the information you've entered.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Make sure everything is correct before submitting.</Typography>
    </Box>
  ];

  // Handle step completion
  const handleFinish = () => {
    console.log('All steps completed successfully');
  };

  // Handle cancellation
  const handleCancel = () => {
    console.log('Operation cancelled');
  };

  // Handle index change
  const handleChange = (index: number) => {
    setActiveIndex(index);
    console.log(`Current index: ${index}`);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h5">Tabs Mode - Horizontal</Typography>
      <NavigationComponent
        type="tabs"
        items={tabItems}
        contents={tabContents}
        activeIndex={activeIndex}
        onChange={handleChange}
      />

      <Typography variant="h5">Tabs Mode - Vertical</Typography>
      <NavigationComponent
        type="tabs"
        items={tabItems}
        contents={tabContents}
        orientation="vertical"
      />

      <Typography variant="h5">Stepper Mode - Horizontal (Full Controls)</Typography>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        onFinish={handleFinish}
        onCancel={handleCancel}
        showNextButton={true}
        showBackButton={true}
        showFinishButton={true}
        showCancelButton={true}
      />

      <Typography variant="h5">Stepper Mode - Vertical (Minimal Controls)</Typography>
      <NavigationComponent
        type="stepper"
        items={stepItems}
        contents={stepContents}
        orientation="vertical"
        onFinish={handleFinish}
        onCancel={handleCancel}
        showNextButton={true}
        showBackButton={true}
        showFinishButton={false}
        showCancelButton={false}
      />
    </Box>
  );
};

export default NavigationComponentExample;