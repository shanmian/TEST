import { Box } from '@mui/material';
import { PieChart, BarChart } from '../../components/ChartComponent';

const ChartExample = () => {
    // 饼图数据
    const pieData = [
        { id: 1, value: 35, label: '分类A', color: '#2196f3' },
        { id: 2, value: 25, label: '分类B', color: '#4caf50' },
        { id: 3, value: 40, label: '分类C', color: '#ff9800' }
    ];
    const PieChartTitle = `PieChart ${pieData[0].label}`;
    // 柱状图数据
    const barData = [
        { data: [4, 2, 5, 4, 1], stack: 'A', label: '系列A1', color: '#2196f3' },
        { data: [2, 8, 1, 3, 1], stack: 'A', label: '系列A2', color: '#4caf50' }
    ];

    const labels = ['一月', '二月', '三月', '四月', '五月'];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <PieChart
                    data={pieData}
                    title={PieChartTitle}
                    width={500}
                    height={300}
                    handseriseClick={(event, item) => {
                        console.log('点击饼图:', item);
                    }}
                    handleLengedClick={(event, item) => {
                        console.log('点击图例:', item);
                    }}
                />
            </Box>

            <Box>
                <BarChart
                    series={barData}
                    labels={labels}
                    title="BarChart"
                    onItemClick={(event, item) => {
                        console.log('点击柱形:', item);
                    }}
                    handleLengedClick={(event, item) => {
                        console.log('点击 bar图例:', item);
                    }}
                />
            </Box>
        </Box>
    );
};

export default ChartExample;