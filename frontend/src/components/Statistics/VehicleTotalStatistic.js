import React, { useContext, useEffect, useState, Fragment } from 'react';
import AuthContext from '../../store/auth-context';
import { getVehicles, vehicleStatisticsSummary } from '../../lib/api';

const VehicleTotalStatistic = () => {
    const authCtx = useContext(AuthContext);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
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

    useEffect(() => {
        if (chosenVehicle) {
            (async () => {
                const data = await vehicleStatisticsSummary(chosenVehicle, authCtx.token);
                setData(data);
            })();
        }
    }, [chosenVehicle, authCtx.token]);

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
            <div>{JSON.stringify(data)}</div>
        </Fragment>
    );
};

export default VehicleTotalStatistic;