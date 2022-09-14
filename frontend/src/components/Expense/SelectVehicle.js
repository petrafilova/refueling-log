import React, { useEffect, useState } from 'react';
import { getVehicles } from '../../lib/api';

const SelectVehicle = (props) => {
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const { setChosenVehicle } = props;

    useEffect(() => {
        (async () => {
            const vehicles = await getVehicles();
            setListOfVehicles(vehicles);
            if (vehicles.length > 0) {
                setChosenVehicle(vehicles[0].id);
            }
        })();
    }, [setChosenVehicle]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
    };

    return (
        <div className='w3-section'>
            <label className='w3-text-indigo' htmlFor='vehicle'>Vyberte vozidlo:</label>
            <select className='w3-select w3-border' name='vehicle' id='vehicle' onChange={selectVehicleHandler}>
                {listOfVehicles.map((l) =>
                    <option key={l.id} value={l.id}>{`${l.brand} ${l.model}, ${l.licensePlateNo}`}</option>
                )};
            </select>
        </div>
    );
};

export default SelectVehicle;