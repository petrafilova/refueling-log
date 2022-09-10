import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { isoDateTimeToString } from '../../lib/dateFormatter';

const ListOfExpenses = (props) => {
    return(
        <table className='w3-table-all w3-section'>
            <thead>
                <tr className='w3-indigo'>
                    <th>typ výdavku</th>
                    <th>celková cena</th>
                    <th>dátum</th>
                    <th className='w3-center'>Upraviť</th>
                    <th className='w3-center'>Vymazať</th>
                </tr>
            </thead>
            <tbody>
                {props.list.map((l) =>
                    <tr key={l.id} id={l.id}>
                        <td>{props.listOfTypes.find(type => type.id === l.typeId)?.name}</td>
                        <td>{l.price}</td>
                        <td>{isoDateTimeToString(l.dateTime)}</td>
                        <td className='w3-center'><button className='w3-button' aria-label='upraviť' onClick={props.editExpense.bind(null, l.id)}><FontAwesomeIcon icon={faPencil} /></button></td>
                        <td className='w3-center'><button className='w3-button' aria-label='zmazať' onClick={props.deleteExpense.bind(null, l.id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                    </tr>)}
            </tbody>
        </table>
    );
};

export default ListOfExpenses;