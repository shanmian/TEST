import { Box, Grid } from '@mui/material';
import { PieChart, BarChart } from '../../components/ChartComponent';

const ChartDemo = () => {
    // 生成多组饼图数据
    const generatePieDataSets = () => {
        const datasets = [
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
            },
            {
                title: '客户分布',
                data: [
                    { id: 1, value: 50, label: '企业客户', color: '#3f51b5' },
                    { id: 2, value: 30, label: '个人客户', color: '#009688' },
                    { id: 3, value: 20, label: '政府机构', color: '#ffc107' }
                ]
            },
            {
                title: '地区分布',
                data: [
                    { id: 1, value: 35, label: '华东', color: '#795548' },
                    { id: 2, value: 25, label: '华北', color: '#607d8b' },
                    { id: 3, value: 40, label: '华南', color: '#e91e63' }
                ]
            }
        ];
        return datasets;
    };

    const pieDataSets = generatePieDataSets();

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
            </Grid>
        </Box>
    );
};

export default ChartDemo;