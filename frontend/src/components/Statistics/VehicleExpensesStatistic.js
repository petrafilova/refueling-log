import React, { useContext, useEffect, useState, Fragment } from 'react';
import AuthContext from '../../store/auth-context';
import { getVehicles, vehicleExpensesStatistic } from '../../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import getYear from 'date-fns/getYear';
import getMonth from 'date-fns/getMonth';
import { padNumber } from '../../lib/dateFormatter';

const VehicleExpensesStatistic = () => {
    registerLocale('sk', sk);
    const authCtx = useContext(AuthContext);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [startDate, setStartDate] = useState(new Date().setFullYear(new Date().getFullYear() - 1));
    const [endDate, setEndDate] = useState(new Date());
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            const vehicles = await getVehicles(authCtx.token);
            setListOfVehicles(vehicles);
            if (vehicles.length > 0) {
                setChosenVehicle(vehicles[0].id);
            }
        })();
    }, [authCtx.token, setChosenVehicle]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    console.log(chosenVehicle);
    console.log(startDate);
    console.log(endDate);

    useEffect(() => {
        if (chosenVehicle && startDate && endDate) {
            (async () => {
                const startMonth = padNumber(getMonth(startDate) + 1);
                const endMonth = padNumber(getMonth(endDate) + 1);
                const selectedDate = {
                    dateFrom: `${getYear(startDate)}-${startMonth}`,
                    dateTo: `${getYear(endDate)}-${endMonth}`,
                };
                console.log(selectedDate);
                const data = await vehicleExpensesStatistic(chosenVehicle, selectedDate, authCtx.token);
                setData(data);
            })();
        }
    }, [chosenVehicle, authCtx.token, startDate, endDate]);

    console.log(data);

    return (
        <Fragment>
            <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='vehicle'>Vyberte vozidlo:</label>
                <select className='w3-select w3-border' name='vehicle' id='vehicle' onChange={selectVehicleHandler}>
                    {listOfVehicles.map((l) =>
                        <option key={l.id} value={l.id}>{`${l.brand} ${l.model}, ${l.licensePlateNo}`}</option>
                    )};
                </select>
            </div>
            <div>
                <label className='w3-text-indigo' htmlFor='date'>Vyberte dátum:</label>
                <div>
                    <div className='w3-left'>
                        <label className='w3-text-indigo' htmlFor='date'>od:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            // selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            name='date'
                            id='date'
                            locale="sk"
                        />
                    </div>
                    <div className='w3-right'>
                        <label className='w3-text-indigo' htmlFor='date'>do:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            // selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            name='date'
                            id='date'
                            locale="sk"
                        />
                    </div>
                </div>
            </div>
            <div className='w3-container'>{JSON.stringify(data)}</div>
        </Fragment >
    );
};

export default VehicleExpensesStatistic;