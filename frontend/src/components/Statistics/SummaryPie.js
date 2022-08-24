import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// const colors = ['rgba(255, 99, 132, 0.2)',
//     'rgba(54, 162, 235, 0.2)',
//     'rgba(255, 206, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
//     'rgba(153, 102, 255, 0.2)',
//     'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)',
//     'rgba(54, 162, 235, 0.2)',
//     'rgba(255, 206, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
//     'rgba(153, 102, 255, 0.2)',
//     'rgba(255, 159, 64, 0.2)',
//     'rgba(255, 99, 132, 0.2)',
//     'rgba(54, 162, 235, 0.2)',
//     'rgba(255, 206, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
//     'rgba(153, 102, 255, 0.2)',
//     'rgba(255, 159, 64, 0.2)'];

const SummaryPie = (props) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    console.log(props.datapie);

    let labels = [];
    let values = [];

    if (props.datapie) {
        for (const el of props.datapie['costOfFuel']) {
            labels.push(el.fuel); // TODO preklad na citatelny text!!!!!
            values.push(el.price);
        }
        for (const el of props.datapie['expenses']) {
            labels.push(el.type);
            values.push(el.price);
        }
    }

    console.log(labels, values);


    /*
        pole farieb ktore bude rovnako dlhe ako pole dataInPie

        rgba - sklada sa z 3 farieb

        const l = dataInPie.length;

        let a = 0;
        for (const i = 0; i < l; i++) {
            if (a >= colors.length) {
                a = 0;
            }
            polefarieb.push(colors[a++]);
        }
        
    */


    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Pie data={data} />
    );
};

export default SummaryPie;