import React, { useContext, useState, useEffect } from 'react';
import { getVehicles, listOfVehicleFuels } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { formatFuelName } from '../../lib/fuelNameFormatter';

const Selection = (props) => {
    const authCtx = useContext(AuthContext);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [listOfFuels, setListOfFuels] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();

    const { onChangeFuel } = props;

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
                    onChangeFuel(fuels[0].id);
                }
            })();
        }
    }, [authCtx.token, chosenVehicle, onChangeFuel]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    const selectFuelHandler = (event) => {
        onChangeFuel(event.target.value);
    };

    return (
        <div>
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

        </div>
    );
};

export default Selection;