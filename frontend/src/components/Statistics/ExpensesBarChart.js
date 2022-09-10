import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { borderColor } from '../../lib/graphColors';
import { padNumber } from '../../lib/dateFormatter';


const ExpensesBarChart = (props) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'graf vývoja jednotkových cien za iné výdavky',
            },
        },
    };

    let labels = [];
    let dataset = [];

    if (props.expensesData.length > 0) {
        props.expensesData.forEach((expense) => {
            expense.stats.forEach((val) => {
                const index = labels.findIndex((a) => a === val.date);
                if (index < 0) {
                    labels.push(val.date);
                }
            });
        });
    }

    labels.sort((a, b) => {
        const aa = a.split('-');
        const bb = b.split('-');
        if (+aa[0] > +bb[0]) {
            return 1;
        } else if (+aa[0] === +bb[0]) {
            if (+aa[1] > +bb[1]) {
                return 1;
            } else if (+aa[1] === +bb[1]) {
                return 0;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    });

    props.expensesData.forEach((expense, idx) => {
        const values = [];
        for (let i = 0; i < labels.length; i++) {
            values.push(0);
        }
        expense.stats.forEach((val) => {
            const index = labels.findIndex((a) => a === val.date);
            if (index >= 0) {
                values.splice(index, 1, val.price);
            }
        });

        dataset.push({
            label: expense.type,
            data: values,
            backgroundColor: borderColor[idx],
        });
    });

    const formatLabels = (labels) => {
        const dates = labels.map(label => {
            const aa = label.split('-');
            const lab = `${padNumber(aa[1])}.${aa[0]}`;
            return lab;
        });
        return dates;
    };

    const data = {
        labels: formatLabels(labels),
        datasets: dataset,
    };

    return (
        <Bar options={options} data={data} />
    );
};

export default ExpensesBarChart;