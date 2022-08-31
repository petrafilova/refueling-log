import React, { useState, Fragment } from 'react';
// import VehicleTotalStatistic from '../Statistics/VehicleTotalStatistic';
// import VehicleExpensesStatistic from '../Statistics/VehicleExpensesStatistic';
// import VehicleFuelStatistic from '../Statistics/VehicleFuelStatistic';
// import VehicleConsumptionStatistic from '../Statistics/VehicleConsumptionStatistic';
import Stats from './Stats';

const Statistics = () => {
    const [tab, setTab] = useState('summary');

    const selectTab = (selectedTab) => {
        setTab(selectedTab);
    };

    return (
        <Fragment>
            <div className='w3-bar'>
                <h1 className='w3-left'>Štatistiky</h1>
            </div>
            <div className='w3-row'>
                <button className={`w3-quarter w3-button w3-bottombar${tab === 'summary' ? ' w3-border-indigo' : ''}`} onClick={selectTab.bind(null, 'summary')}>Všetky výdavky</button>
                <button className={`w3-quarter w3-button w3-bottombar${tab === 'fuel' ? ' w3-border-indigo' : ''}`} onClick={selectTab.bind(null, 'fuel')}>Palivo</button>
                <button className={`w3-quarter w3-button w3-bottombar${tab === 'expenses' ? ' w3-border-indigo' : ''}`} onClick={selectTab.bind(null, 'expenses')}>Iné výdavky</button>
                <button className={`w3-quarter w3-button w3-bottombar${tab === 'consumption' ? ' w3-border-indigo' : ''}`} onClick={selectTab.bind(null, 'consumption')}>Spotreba</button>
            </div>
            <div className='w3-container w3-padding-top-24'>
                <Stats tab={tab}/>
            </div>
        </Fragment>
    );
};

export default Statistics;