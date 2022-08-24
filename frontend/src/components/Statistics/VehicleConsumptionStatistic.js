import React, { useContext, useState, useEffect, Fragment } from 'react';
import { getVehicles, listOfVehicleFuels, vehicleFuelConsumptionStatistic} from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { formatFuelName } from '../../lib/fuelNameFormatter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import getYear from 'date-fns/getYear';
import getMonth from 'date-fns/getMonth';
import { padNumber } from '../../lib/dateFormatter';

const VehicleConsumptionStatistic = () => {
    registerLocale('sk', sk);
    const authCtx = useContext(AuthContext);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [listOfFuels, setListOfFuels] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [chosenFuel, setChosenFuel] = useState();
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
    }, [authCtx.token]);

    useEffect(() => {
        if (chosenVehicle) {
            (async () => {
                const fuels = await listOfVehicleFuels(chosenVehicle, authCtx.token);
                setListOfFuels(fuels);
                if (fuels.length > 0) {
                    setChosenFuel(fuels[0].id);
                }
            })();
        }
    }, [authCtx.token, chosenVehicle]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    const selectFuelHandler = (event) => {
        setChosenFuel(event.target.value);
    };

    useEffect(() => {
        if (chosenVehicle && startDate && endDate && chosenFuel) {
            (async () => {
                const startMonth = padNumber(getMonth(startDate) + 1);
                const endMonth = padNumber(getMonth(endDate) + 1);
                const display = {
                    vehicleFuelId: chosenFuel,
                    dateFrom: `${getYear(startDate)}-${startMonth}`,
                    dateTo: `${getYear(endDate)}-${endMonth}`,
                };
                const data = await vehicleFuelConsumptionStatistic(chosenVehicle, display, authCtx.token);
                setData(data);
            })();
        }
    }, [chosenVehicle, chosenFuel, authCtx.token, startDate, endDate]);

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
            <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='fuel'>Vyberte palivo:</label>
                <select className='w3-select w3-border' name='fuel' id='fuel' onChange={selectFuelHandler}>
                    {listOfFuels.map((l) =>
                        <option key={l.id} value={l.id}>{formatFuelName(l.fuel)}</option>
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
        </Fragment>
    );
};

export default VehicleConsumptionStatistic;