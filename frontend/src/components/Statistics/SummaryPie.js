import React, { Fragment } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatFuelName } from '../../lib/fuelNameFormatter';
import { backgroundColor, borderColor } from '../../lib/graphColors';

const SummaryPie = (props) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    let labels = [];
    let values = [];

    if (props.summaryData) {
        for (const el of props.summaryData['costOfFuel']) {
            labels.push(formatFuelName(el.fuel));
            values.push(el.price);
        }
        for (const el of props.summaryData['expenses']) {
            labels.push(el.type);
            values.push(el.price);
        }
    }

    const colorOfBackground = [];
    const colorOfBorder = [];

    let a = 0;
    for (let i = 0; i < labels.length; i++) {
        if (a >= labels.length) {
            a = 0;
        }
        colorOfBackground.push(backgroundColor[a]);
        colorOfBorder.push(borderColor[a++]);

    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: values,
                backgroundColor: colorOfBackground,
                borderColor: colorOfBorder,
                borderWidth: 1,
            },
        ],
    };

    return (
        <Fragment>
            <div className='summaryPie'>
                <Pie data={data} />
            </div>
            <div className='overflow-x-auto'>
                <table className='w3-table-all w3-section'>
                    <thead>
                        <tr className='w3-indigo'>
                            <th>názov</th>
                            <th>spolu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td>najazdené kilometre</td>
                            <td>{props.summaryData?.mileage}</td>
                        </tr>
                        <tr >
                            <td>výdavky za palivo</td>
                            <td>{props.summaryData?.costOfFuelTotal}</td>
                        </tr>
                        <tr >
                            <td>iné výdavky</td>
                            <td>{props.summaryData?.expensesTotal}</td>
                        </tr>
                        <tr >
                            <td>spolu za výdavky</td>
                            <td>{props.summaryData?.sum}</td>
                        </tr>
                    </tbody>
                    <thead>
                        <tr className='w3-indigo'>
                            <th>výdavky za palivo</th>
                            <th>spolu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.summaryData?.costOfFuel.map((l) =>
                            <tr key={l.fuel} >
                                <td>{formatFuelName(l.fuel)}</td>
                                <td>{l.price}</td>
                            </tr>)}
                    </tbody>
                    <thead>
                        <tr className='w3-indigo'>
                            <th>iné výdavky</th>
                            <th>spolu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.summaryData?.expenses.map((l) =>
                            <tr key={l.type} >
                                <td>{l.type}</td>
                                <td>{l.price}</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </Fragment >
    );
};

export default SummaryPie;