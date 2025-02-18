import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { Box, Typography } from '@mui/material';

interface SeriesData {
  data: number[];
  stack?: string;
  label?: string;
  color?: string;
}

interface BarChartProps {
  series: SeriesData[];
  width?: number;
  height?: number;
  title?: string;
  labels?: string[];
  onItemClick?: (event: any, itemData: any) => void;
  handleLengedClick?: (event: any, itemData: any) => void;
}

const BarChart = ({
  series,
  width = 400,
  height = 300,
  title,
  labels,
  onItemClick,
  handleLengedClick
}: BarChartProps) => {
  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <MuiBarChart
        margin={{ bottom: 70 }}
        xAxis={[{
          data: labels,
          scaleType: 'band'
        }]}
        series={series.map(item => ({
          ...item,
          valueFormatter: (value) => `${value}`,
          highlightScope: {
            highlighted: 'item',
            faded: 'global'
          }
        }))}
        slotProps={{
          legend: {
            hidden: false,
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding:8,
            itemMarkWidth: 20,
            itemMarkHeight: 20,
            markGap: 5,
            itemGap: 10,
            onItemClick: (event, item) => {
                handleLengedClick?.(event, item); 
              }
          }
        }}
        // barLabel={(item, context) => {
        //   if ((item.value ?? 0) > 10) {
        //     return 'High';
        //   }
        //   return context.bar.height < 60 ? null : item.value?.toString();
        // }}
        width={width}
        height={height}
        onItemClick={onItemClick}
      />
    </Box>
  );
};

export default BarChart;