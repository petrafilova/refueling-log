import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ListOfExpenses = (props) => {
    console.log(props.listOfTypes, props.list);
    // const pole = [{id: 4, name: 'pneumatiky'}, {id: 32, name: 'poistenie'}, {id: 5, name: 'výmena oleja'}];
    
    // const xy = (pole.filter(type => type.id === 32)).name;
    // console.log(xy.name);


    return(
        <table className='w3-table-all w3-section'>
            <thead>
                <tr className="w3-indigo">
                    <th>typ výdavku</th>
                    <th>cena</th>
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
                        <td>{new Date(l.dateTime).toLocaleString()}</td>
                        <td className='w3-center'><button className='w3-button' aria-label='upraviť' onClick={props.editExpense.bind(null, l.id)}><FontAwesomeIcon icon={faPencil} /></button></td>
                        <td className='w3-center'><button className='w3-button' aria-label='zmazať' onClick={props.deleteExpense.bind(null, l.id)}><FontAwesomeIcon icon={faTrash} /></button></td>
                    </tr>)}
            </tbody>
        </table>
    );
};

export default ListOfExpenses;