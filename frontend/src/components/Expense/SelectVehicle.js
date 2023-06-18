import React, { Fragment, useEffect, useState } from 'react';
import { getVehicles } from '../../lib/api';
import Loading from '../Layout/Loading';

const SelectVehicle = (props) => {
    const [visible, setVisible] = useState(false);
    const [listOfVehicles, setListOfVehicles] = useState([]);
    const { setChosenVehicle } = props;
    const [isLoading, setIsLoading] = useState(false);

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
    }, [setChosenVehicle]);

    const selectVehicleHandler = (event) => {
        setChosenVehicle(event.target.value);
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
        </Fragment>
    );
};

export default SelectVehicle;
