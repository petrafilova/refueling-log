import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { getVehicles } from '../../lib/api';


const SelectVehicle = (props) => {
    const authCtx = useContext(AuthContext);
    const [listOfVehicles, setListOfVehicles] = useState([]);

    useEffect(() => {
        (async () => {
            const vehicles = await getVehicles(authCtx.token);
            setListOfVehicles(vehicles);
            if (vehicles.length > 0) {
                props.setChosenVehicle(vehicles[0].id);
            }
        })();
    }, [authCtx.token]);

    console.log(listOfVehicles);

    const selectVehicleHandler = (event) => {
        props.setChosenVehicle(event.target.value);
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