import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FuelItem from './FuelItem';
import { FuelTypes } from '../../lib/fuelNameFormatter';
import { formatFuelName } from '../../lib/fuelNameFormatter';

const FuelTable = (props) => {
    const [fuel, setFuel] = useState('');
    const [editedFuelType, setEditedFuelType] = useState('');

    const selectChangeHandler = (event) => {
        setFuel(event.target.value);
    };

    const listOfFuelHandler = () => {
        props.setFuelList((o) => {
            const n = [...o];
            const index = n.findIndex(y => y.status === 'DELETED');
            if (index >= 0) {
                delete n[index].status;
            } else {
                n.push({ fuel });
            }
            return n;
        });
        setFuel('');
    };

    const deleteFuel = (nameOfFuel) => {
        props.setFuelList((o) => {
            const n = [...o];
            const index = n.findIndex(x => x.fuel === nameOfFuel);
            if (!n[index].id) {
                n.splice(index, 1);
            } else {
                n[index].status = 'DELETED';
            }
            return n;
        });
    };

    const changeFuel = (newFuelType) => {
        props.setFuelList((o) => {
            const n = [...o];
            const index = n.findIndex(x => x.fuel === editedFuelType);
            n[index].fuel = newFuelType;
            if (n[index].id) {
                n[index].status = 'EDITED';
            }
            return n;
        });
        setEditedFuelType('');
    };

    const selectedFuels = props.fuelList.filter((f) => f.status !== 'DELETED').map((f) =>
        <tr key={f.fuel}>
            <td>
                {formatFuelName(f.fuel)}
                <div className='w3-right'>
                    <button className='w3-button' aria-label='upraviť' onClick={setEditedFuelType.bind(null, f.fuel)}  ><FontAwesomeIcon icon={faPencil} /></button>
                    <button className='w3-button' aria-label='zmazať' disabled={props.fuelList.filter((l) => l.status !== 'DELETED').length <= 1} onClick={deleteFuel.bind(null, f.fuel)} ><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            </td>
        </tr>
    );

    return (
        <div>
            <label className='w3-text-indigo' htmlFor='fuel'>palivo: </label>
            <div className='flex'>
                <select className='w3-select w3-border' name='fuel' id='fuel' value={fuel} onChange={selectChangeHandler}>
                    <option value='' disabled>Vyberte typ paliva</option>
                    {FuelTypes.filter((f) => props.fuelList.filter((f) => f.status !== 'DELETED').findIndex(fl => fl.fuel === f) === -1).map((ft) => <option key={ft} value={ft}>{formatFuelName(ft)}</option>)}
                </select>
                <button className='w3-button w3-indigo w3-right' disabled={!fuel} onClick={listOfFuelHandler}>Pridať</button>
            </div>

            <table className='w3-table-all w3-section'>
                <tbody>
                    {selectedFuels}
                </tbody>
            </table>
            {editedFuelType && <FuelItem onCancel={setEditedFuelType.bind(null, '')} onEdit={changeFuel} fuelType={editedFuelType} fuelList={props.fuelList} />}
        </div>
    );
};

export default FuelTable;