import React, { useState, useEffect, Fragment } from 'react';
import { getVehicles, listOfVehicleFuels } from '../../lib/api';
import { formatFuelName } from '../../lib/fuelNameFormatter';
import Loading from '../Layout/Loading';

const Selection = (props) => {
    const [visible, setVisible] = useState(false);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const [listOfFuels, setListOfFuels] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { onChangeFuel } = props;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const vehicles = await getVehicles();
            setIsLoading(false);
            setListOfVehicles(vehicles);
            if (vehicles.length > 0) {
                setChosenVehicle(vehicles[0].id);
                if (vehicles.length > 1) {
                    setVisible(true);
                }
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
                    onChangeFuel(fuels[0]);
                    if (fuels.length > 1) {
                        setVisible(true);
                    }
                }
            })();
        }
    }, [chosenVehicle, onChangeFuel]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    const selectFuelHandler = (event) => {
        const fuel = listOfFuels.find(
            (element) => element.id === +event.target.value
        );
        onChangeFuel(fuel);
    };

    if (!visible) {
        return null;
    }

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='vehicle'>
                    Vyberte vozidlo:
                </label>
                <select
                    className='w3-select w3-border'
                    name='vehicle'
                    id='vehicle'
                    onChange={selectVehicleHandler}
                >
                    {listOfVehicles.map((l) => (
                        <option
                            key={l.id}
                            value={l.id}
                        >{`${l.brand} ${l.model}, ${l.licensePlateNo}`}</option>
                    ))}
                    ;
                </select>
            </div>
            <div className='w3-section'>
                <label className='w3-text-indigo' htmlFor='fuel'>
                    Vyberte palivo:
                </label>
                <select
                    className='w3-select w3-border'
                    name='fuel'
                    id='fuel'
                    onChange={selectFuelHandler}
                >
                    {listOfFuels.map((l) => (
                        <option key={l.id} value={l.id}>
                            {formatFuelName(l.fuel)}
                        </option>
                    ))}
                    ;
                </select>
            </div>
        </Fragment>
    );
};

export default Selection;
