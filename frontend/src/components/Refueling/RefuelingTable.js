import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { isoDateTimeToString } from '../../lib/dateFormatter';

const RefuelingTable = (props) => {
    return (
        <div className='overflow-x-auto'>
            <table className='w3-table-all w3-section'>
                <thead>
                    <tr className='w3-indigo'>
                        <th>množstvo</th>
                        <th>celková cena</th>
                        <th>dátum</th>
                        <th className='w3-center'>Upraviť</th>
                        <th className='w3-center'>Vymazať</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map((l) =>
                        <tr key={l.id} id={l.id}>
                            <td>{l.quantity}</td>
                            <td>{l.totalPrice}</td>
                            <td>{isoDateTimeToString(l.dateTime)}</td>
                            <td className='w3-center'><button className='w3-button' aria-label='upraviť' onClick={props.editSingleFuelLog.bind(null, l.id)}><FontAwesomeIcon icon={faPencil} /></button></td>
                            <td className='w3-center'><button className='w3-button' aria-label='zmazať' onClick={props.deleteSingleFuelLog.bind(null, l.id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default RefuelingTable;