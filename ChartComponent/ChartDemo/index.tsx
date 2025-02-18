import { Box, Grid } from '@mui/material';
import { PieChart, BarChart } from '../../components/ChartComponent';

const ChartDemo = () => {
    // 饼图数据集
    const pieDataSets = [
        {
            title: '收入分布',
            data: [
                { id: 1, value: 40, label: '主营业务', color: '#2196f3' },
                { id: 2, value: 35, label: '副业收入', color: '#4caf50' },
                { id: 3, value: 25, label: '其他收入', color: '#ff9800' }
            ]
        },
        {
            title: '成本构成',
            data: [
                { id: 1, value: 45, label: '原材料', color: '#f44336' },
                { id: 2, value: 30, label: '人工', color: '#9c27b0' },
                { id: 3, value: 25, label: '制造费用', color: '#00bcd4' }
            ]
        }
    ];

    // 将成本数据转换为柱状图数据
    const barSeriesData = [
        {
            data: pieDataSets[1].data.map(item => item.value),
            label: '成本项目',
            color: '#2196f3'
        }
    ];

    const barLabels = pieDataSets[1].data.map(item => item.label);

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {pieDataSets.map((dataset, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <PieChart
                            data={dataset.data}
                            title={dataset.title}
                            width={400}
                            height={300}
                            handseriseClick={(event, item) => {
                                console.log(`点击${dataset.title}饼图:`, item);
                            }}
                            handleLengedClick={(event, item) => {
                                console.log(`点击${dataset.title}图例:`, item);
                            }}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <BarChart
                        series={barSeriesData}
                        labels={barLabels}
                        title="成本项目分布"
                        width={800}
                        height={400}
                        onItemClick={(event, item) => {
                            console.log('点击柱形:', item);
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChartDemo;