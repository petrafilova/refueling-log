import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const VehicleItem = (props) => {
    const deleteItemHandler = () => {
        props.deleteVehicle(props.id);
    };

    const editItemHandler = () => {
        props.editItem(props.id);
    };

    return (
        <tr>
            <td>{props.brand}</td>
            <td>{props.model}</td>
            <td>{props.licensePlateNo}</td>
            <td className='w3-center'><button className='w3-button' aria-label='upraviť' onClick={editItemHandler}><FontAwesomeIcon icon={faPencil} /></button></td>
            <td className='w3-center'><button className='w3-button' aria-label='zmazať'onClick={deleteItemHandler}><FontAwesomeIcon icon={faTrash} /></button></td>
        </tr>
    );
};

export default VehicleItem;