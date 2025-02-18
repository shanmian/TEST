import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

interface PieChartData {
  id: string | number;
  value: number;
  label: string;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  title?: string;
  handseriseClick?: (event: any, d: any) => void;
  handleLengedClick?: (event: any, d: any) => void;
}

const PieChart = ({
  data,
  width = 400,
  height = 300,
  title,
  handseriseClick,
  handleLengedClick
}: PieChartProps) => {
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <MuiPieChart
      margin={{ bottom: 70 }}
        series={[{
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          innerRadius: 80,
          outerRadius: 100,
          paddingAngle: 2
        }]}
        slotProps={{
          legend: { 
            hidden: false,
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 8,
            itemMarkWidth: 20,
            itemMarkHeight: 20,
            markGap: 5,
            itemGap: 10,
            onItemClick: (event, item) => {
                handleLengedClick?.(event, item);
              }
          }, 
        }}
        width={width}
        height={height}
        onItemClick={handseriseClick}
      />
    </Box>
  );
};

export default PieChart;