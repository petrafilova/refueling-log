import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ExpenseTypeTable = (props) => {
    return (
    
        <table className='w3-table-all w3-section'>
            <thead>
                <tr className="w3-indigo">
                    <th>typ výdavku</th>
                    <th className='w3-center'>Upraviť</th>
                    <th className='w3-center'>Vymazať</th>
                </tr>
            </thead>
            <tbody>
                {props.list.map((l) =>
                    <tr key={l.id} id={l.id}>
                        <td>{l.name}</td>
                        <td className='w3-center'><button className='w3-button' aria-label='upraviť' onClick={props.editExpenseType.bind(null, l.id, l.name)}><FontAwesomeIcon icon={faPencil} /></button></td>
                        <td className='w3-center'><button className='w3-button' aria-label='zmazať' onClick={props.deleteExpenseType.bind(null, l.id, l.name)}><FontAwesomeIcon icon={faTrash} /></button></td>
                    </tr>)}
            </tbody>
        </table>
    );
};

export default ExpenseTypeTable;