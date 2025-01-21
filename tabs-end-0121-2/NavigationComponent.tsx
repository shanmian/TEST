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
  Button,
} from '@mui/material';

/**
 * TabPanel interface definition
 * @interface TabPanelProps
 * @property {ReactNode} children - Panel content
 * @property {number} value - Current active panel index
 * @property {number} index - Current panel index
 */
interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

/**
 * NavigationComponent interface definition
 * @interface NavigationComponentProps
 * @property {('tabs'|'stepper')} type - Navigation type, either tabs or stepper
 * @property {ReactNode[]} items - Array of navigation item titles
 * @property {ReactNode[]} contents - Array of navigation item contents
 * @property {number} activeIndex - Initial active item index
 * @property {(index: number) => void} onChange - Callback function when navigation item changes
 * @property {SxProps<Theme>} sx - Material-UI style properties
 * @property {('horizontal'|'vertical')} orientation - Navigation direction
 */
interface NavigationComponentProps {
  type?: 'tabs' | 'stepper';
  items: ReactNode[];
  contents: ReactNode[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  sx?: SxProps<Theme>;
  orientation?: 'horizontal' | 'vertical';
  onFinish?: () => void;
  onCancel?: () => void;
  showNextButton?: boolean;
  showBackButton?: boolean;
  showFinishButton?: boolean;
  showCancelButton?: boolean;
}

/**
 * TabPanel Component - Used to display tab content
 * @param props - Component properties
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
 * NavigationComponent - A switchable navigation component supporting both tabs and stepper modes
 * @param props - Component properties
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
  onFinish,
  onCancel,
  showNextButton = true,
  showBackButton = true,
  showFinishButton = true,
  showCancelButton = true,
}) => {
  // Current active item index state
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  /**
   * Handle navigation item change event
   * @param _event - React synthetic event
   * @param newValue - New index value
   */
  const handleChange = (_event: React.SyntheticEvent | null, newValue: number) => {
    setCurrentIndex(newValue);
    onChange?.(newValue);
  };

  /**
   * Tabs mode component
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
   * Stepper mode component
   * @returns JSX.Element
   */
  const StepperComponent = () => {
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === items.length - 1;

    const handleNext = () => {
      handleChange(null, currentIndex + 1);
    };

    const handleBack = () => {
      handleChange(null, currentIndex - 1);
    };

    return (
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
          {contents[currentIndex] || <Typography>No content available</Typography>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, gap: 1, justifyContent: 'flex-end' }}>
          {showCancelButton && onCancel && (
            <Button
              color="inherit"
              onClick={onCancel}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          )}
          {showBackButton && (
            <Button
              color="inherit"
              disabled={isFirstStep}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          )}
          {!isLastStep && showNextButton && (
            <Button
              onClick={handleNext}
              sx={{ mr: 1 }}
            >
              Next
            </Button>
          )}
          {isLastStep && showFinishButton && onFinish && (
            <Button
              onClick={onFinish}
              variant="contained"
              color="primary"
            >
              Finish
            </Button>
          )}
        </Box>
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', ...sx }}>
      {type === 'tabs' ? <TabsComponent /> : <StepperComponent />}
    </Paper>
  );
};

export default NavigationComponent;