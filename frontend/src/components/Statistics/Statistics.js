import React, { useState, Fragment } from 'react';
import VehicleTotalStatistic from '../Statistics/VehicleTotalStatistic';
import VehicleExpensesStatistic from '../Statistics/VehicleExpensesStatistic';
import VehicleFuelStatistic from '../Statistics/VehicleFuelStatistic';
import VehicleConsumptionStatistic from '../Statistics/VehicleConsumptionStatistic';

const Statistics = () => {
    const [summaryStyle, setSummaryStyle] = useState(true);
    const [expensesStyle, setExpensesStyle] = useState(false);
    const [fuelStyle, setFuelStyle] = useState(false);
    const [consumptionStyle, setConsumptionStyle] = useState(false);

    const openCity = (type) => {
        setSummaryStyle(false);
        setExpensesStyle(false);
        setFuelStyle(false);
        setConsumptionStyle(false);

        if (type === 'summary') {
            setSummaryStyle(true);
        } else if (type === 'expenses') {
            setExpensesStyle(true);
        } else if (type === 'fuel') {
            setFuelStyle(true);
        } else if (type === 'consumption') {
            setConsumptionStyle(true);
        }
    };

    return (
        <Fragment>
            <div className='w3-bar'>
                <h1 className='w3-left'>Štatistiky</h1>
            </div>

            <div className='w3-row'>
                <button className={`w3-quarter w3-button w3-bottombar${summaryStyle ? ' w3-border-indigo' : ''}`} onClick={openCity.bind(null, 'summary')}>Všetky výdavky</button>
                <button className={`w3-quarter w3-button w3-bottombar${fuelStyle ? ' w3-border-indigo' : ''}`} onClick={openCity.bind(null, 'fuel')}>Palivo</button>
                <button className={`w3-quarter w3-button w3-bottombar${expensesStyle ? ' w3-border-indigo' : ''}`} onClick={openCity.bind(null, 'expenses')}>Iné výdavky</button>
                <button className={`w3-quarter w3-button w3-bottombar${consumptionStyle ? ' w3-border-indigo' : ''}`} onClick={openCity.bind(null, 'consumption')}>Spotreba</button>
            </div>

            <div className='w3-container w3-padding-top-24'>
                {summaryStyle && <VehicleTotalStatistic />}
                {fuelStyle && <VehicleFuelStatistic />}
                {expensesStyle && <VehicleExpensesStatistic />}
                {consumptionStyle && <VehicleConsumptionStatistic />}
            </div>
        </Fragment>
    );
};

export default Statistics;