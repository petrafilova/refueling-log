import React, { useState, useEffect, Fragment } from 'react';
import { getVehicles, listOfVehicleFuels, vehicleFuelConsumptionStatistic, vehicleStatisticsSummary, vehicleFuelCostsStatistic, vehicleExpensesStatistic } from '../../lib/api';
import { formatFuelName } from '../../lib/fuelNameFormatter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import getYear from 'date-fns/getYear';
import getMonth from 'date-fns/getMonth';
import { padNumber } from '../../lib/dateFormatter';
import SummaryPie from './SummaryPie';
import FuelLineChart from './FuelLineChart';
import ExpensesBarChart from './ExpensesBarChart';
import ConsumptionLineChart from './ConsumptionLineChart';
import Loading from '../Layout/Loading';


const Stats = (props) => {
    registerLocale('sk', sk);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [listOfFuels, setListOfFuels] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [chosenFuel, setChosenFuel] = useState();
    const [startDate, setStartDate] = useState(new Date().setFullYear(new Date().getFullYear() - 1));
    const [endDate, setEndDate] = useState(new Date());
    const [summaryData, setSummaryData] = useState();
    const [fuelData, setFuelData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [consumptionData, setConsumptionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const vehicles = await getVehicles();
            setIsLoading(false);
            setListOfVehicles(vehicles);
            if (vehicles.length > 0) {
                setChosenVehicle(vehicles[0].id);
            }
        })();
    }, []);

    useEffect(() => {
        if (chosenVehicle) {
            (async () => {
                setIsLoading(true);
                const fuels = await listOfVehicleFuels(chosenVehicle);
                setIsLoading(false);
                setListOfFuels(fuels);
                if (fuels.length > 0) {
                    setChosenFuel(fuels[0].id);
                }
            })();
        }
    }, [chosenVehicle]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    const selectFuelHandler = (event) => {
        setChosenFuel(event.target.value);
    };

    useEffect(() => {
        setIsLoading(true);
        if (props.tab === 'summary') {
            if (chosenVehicle) {
                (async () => {
                    const data = await vehicleStatisticsSummary(chosenVehicle);
                    setSummaryData(data);
                })();
            }
        }

        if (props.tab === 'fuel') {
            if (chosenVehicle && startDate && endDate && chosenFuel) {
                (async () => {
                    const startMonth = padNumber(getMonth(startDate) + 1);
                    const endMonth = padNumber(getMonth(endDate) + 1);
                    const display = {
                        vehicleFuelId: chosenFuel,
                        dateFrom: `${getYear(startDate)}-${startMonth}`,
                        dateTo: `${getYear(endDate)}-${endMonth}`,
                    };
                    const data = await vehicleFuelCostsStatistic(chosenVehicle, display);
                    setFuelData(data);
                })();
            }
        }

        if (props.tab === 'expenses') {
            if (chosenVehicle && startDate && endDate) {
                (async () => {
                    const startMonth = padNumber(getMonth(startDate) + 1);
                    const endMonth = padNumber(getMonth(endDate) + 1);
                    const selectedDate = {
                        dateFrom: `${getYear(startDate)}-${startMonth}`,
                        dateTo: `${getYear(endDate)}-${endMonth}`,
                    };
                    const data = await vehicleExpensesStatistic(chosenVehicle, selectedDate);
                    setExpensesData(data);
                })();
            }
        }

        if (props.tab === 'consumption') {
            if (chosenVehicle && startDate && endDate && chosenFuel) {
                (async () => {
                    const startMonth = padNumber(getMonth(startDate) + 1);
                    const endMonth = padNumber(getMonth(endDate) + 1);
                    const display = {
                        vehicleFuelId: chosenFuel,
                        dateFrom: `${getYear(startDate)}-${startMonth}`,
                        dateTo: `${getYear(endDate)}-${endMonth}`,
                    };
                    const data = await vehicleFuelConsumptionStatistic(chosenVehicle, display);
                    setConsumptionData(data);
                })();
            }
        }
        setIsLoading(false);
    }, [chosenVehicle, chosenFuel, startDate, endDate, props.tab]);

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='vehicle'>Vyberte vozidlo:</label>
                <select className='w3-select w3-border' name='vehicle' id='vehicle' onChange={selectVehicleHandler}>
                    {listOfVehicles.map((l) =>
                        <option key={l.id} value={l.id}>{`${l.brand} ${l.model}, ${l.licensePlateNo}`}</option>
                    )};
                </select>
            </div>
            {(props.tab === 'fuel' || props.tab === 'consumption') && <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='fuel'>Vyberte palivo:</label>
                <select className='w3-select w3-border' name='fuel' id='fuel' value={chosenFuel} onChange={selectFuelHandler}>
                    {listOfFuels.map((l) =>
                        <option key={l.id} value={l.id}>{formatFuelName(l.fuel)}</option>
                    )};
                </select>
            </div>}
            {(props.tab === 'expenses' || props.tab === 'fuel' || props.tab === 'consumption') && <div>   
                <label className='w3-text-indigo' htmlFor='date'>Vyberte dátum:</label>
                <div>
                    <div className='w3-left w3-margin-top smFullWidth w3-'>
                        <label className='w3-text-indigo' htmlFor='date'>od:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat='MM/yyyy'
                            showMonthYearPicker
                            name='date'
                            id='date'
                            locale='sk'
                            value={startDate}
                            className='w3-input w3-border'
                        />
                    </div>
                    <div className='w3-right w3-section smFullWidth'>
                        <label className='w3-text-indigo' htmlFor='date'>do:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat='MM/yyyy'
                            showMonthYearPicker
                            name='date'
                            id='date'
                            locale='sk'
                            value={endDate}
                            className='w3-input w3-border'
                        />
                    </div>
                </div>
            </div>}
            {(props.tab === 'summary') && <SummaryPie summaryData={summaryData}/>}
            {(props.tab === 'fuel') && <FuelLineChart fuelData={fuelData}/>}
            {(props.tab === 'expenses') && <ExpensesBarChart expensesData={expensesData}/>}
            {(props.tab === 'consumption') && <ConsumptionLineChart consumptionData={consumptionData}/>}
        </Fragment>
    );
};

export default Stats;