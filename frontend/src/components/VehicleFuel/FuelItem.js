import React, { useState } from 'react';
import { FuelTypes } from '../../lib/fuelNameFormatter';
import { formatFuelName } from '../../lib/fuelNameFormatter';

const FuelItem = (props) => {
    const [fuel, setFuel] = useState();

    const selectChangeHandler = (event) => {
        console.log(event);
        setFuel(event.target.value);
    };

    return (
        <div className="w3-modal w3-show">
            <div className="w3-modal-content dialog">
                <header className="w3-container w3-light-grey">
                    <h2>Zmena paliva</h2>
                </header>
                <div className="w3-container w3-section">

                    <label className='w3-text-indigo' htmlFor='fuel'>zmeniť typ paliva na: </label>
                    <div className='flex'>
                        <select className='w3-select w3-border' name='fuel' id='fuel' defaultValue={props.fuelType} onChange={selectChangeHandler}>
                            {FuelTypes.filter((f) => (props.fuelList.findIndex(fl => fl.fuel === f) === -1) || f === props.fuelType).map((ft) => <option key={ft} value={ft}>{formatFuelName(ft)}</option>)}
                        </select>

                    </div>

                </div>
                <footer className="w3-container w3-light-grey">
                    <p>
                        <button className="w3-button w3-indigo" onClick={props.onCancel}>Zrušiť</button>
                        <button className="w3-button w3-indigo w3-right" onClick={props.onEdit.bind(null, fuel)}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default FuelItem;