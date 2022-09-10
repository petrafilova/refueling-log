import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatFuelName } from '../../lib/fuelNameFormatter';
import { isoDateTimeToString } from '../../lib/dateFormatter';

const ConsumptionLineChart = (props) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'graf vývoja spotreby paliva',
            },
        },
    };

    let labels = [];
    let values = [];

    if (props.consumptionData.length > 0) {
        props.consumptionData[0].stats?.map((l) => labels.push(isoDateTimeToString(l.dateTime)));
        props.consumptionData[0].stats?.map((v) => values.push(v.consumption));
    }

    const data = {
        labels,
        datasets: [
            {
                label: `${formatFuelName(props.consumptionData[0]?.type)}`,
                data: values,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <Line options={options} data={data} />
    );
};

export default ConsumptionLineChart;