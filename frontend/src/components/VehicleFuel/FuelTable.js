import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FuelTable = (props) => {

    const [fuel, setFuel] = useState();

    const selectChangeHandler = (event) => {
        console.log(event);
        setFuel(event.target.value);
    };

    const listOfFuelHandler = () => {
        console.log(fuel);
        console.log(props.fuelList);
        props.setFuelList((o) => {
            const n = [...o];
            console.log(n);
            n.push({ fuel });
            console.log(n);
            return n;
        });
    };

    const formatFuelName = (fuelType) => {
        let fuel;
        switch (fuelType) {
            case 'GASOLINE':
                fuel = 'benzín';
                break;
            case 'DIESEL':
                fuel = 'nafta';
                break;
            case 'HYDROGEN':
                fuel = 'vodík';
                break;
            case 'ELECTRICITY':
                fuel = 'elektrika';
                break;
            default:
                fuel = fuelType;
        }
        return fuel;
    };

    const deleteFuelFromList = (nameOfFuel) => {
        props.setFuelList((o) => {
            const n = [...o];
            console.log(n);
            const index = n.findIndex(x => x.fuel === nameOfFuel);
            if (!n[index].id) {
                n.splice(index, 1);
            } else {
                n[index].status = 'DELETED';
            }
            console.log(n);
            return n;
        });
    };

    const selectedFuels = props.fuelList.filter((f) => f.status !== 'DELETED').map((f) =>
        <tr key={f.fuel}>
            <td>
                {formatFuelName(f.fuel)}
                <div className='w3-right'>
                    <button className='w3-button' aria-label='upraviť' ><FontAwesomeIcon icon={faPencil} /></button>
                    <button className='w3-button' aria-label='zmazať' ><FontAwesomeIcon onClick={deleteFuelFromList.bind(null, f.fuel)} icon={faTrash} /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div>
            <label className='w3-text-indigo' htmlFor='fuel'>palivo: </label>
            <div className='flex'>
                <select className='w3-select w3-border' name='fuel' id='fuel' defaultValue='' onChange={selectChangeHandler}>
                    <option value="" disabled>Vyberte typ paliva</option>
                    <option value="GASOLINE">{formatFuelName('GASOLINE')}</option>
                    <option value="DIESEL">{formatFuelName('DIESEL')}</option>
                    <option value="LPG">LPG</option>
                    <option value="CNG">CNG</option>
                    <option value="HYDROGEN">{formatFuelName('HYDROGEN')}</option>
                    <option value="ELECTRICITY">{formatFuelName('ELECTRICITY')}</option>
                </select>
                <button className='w3-button w3-indigo w3-right' disabled={!fuel} onClick={listOfFuelHandler}>Pridať</button>
            </div>

            <table className='w3-table-all w3-section'>
                {/* <thead>
                    <tr className="w3-indigo">
                        <th>Typ paliva</th>
                        <th className='w3-center'>Upraviť</th>
                        <th className='w3-center'>Vymazať</th>
                    </tr>
                </thead> */}
                <tbody>
                    {selectedFuels}
                </tbody>
            </table>
        </div>
    );
};

export default FuelTable;