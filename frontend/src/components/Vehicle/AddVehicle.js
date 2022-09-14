import React, { useState } from 'react';
import VehicleDialog from './VehicleDialog';
import { createVehicle } from '../../lib/api';

const AddVehicle = (props) => {
    const [createVehicleDialogIsVisible, setCreateVehicleDialogIsVisible] = useState(false);

    const showDialog = () => {
        setCreateVehicleDialogIsVisible(true);
    };

    const cancel = () => {
        setCreateVehicleDialogIsVisible(false);
    };

    const submitHandler = async (createdVehicle) => {
        const success = await createVehicle(createdVehicle);
        success && setCreateVehicleDialogIsVisible(false);
        props.reloadVehicles();
        return success ? success.id : success;
    };

    return (
        <div className='w3-right smFullWidth'>
            {createVehicleDialogIsVisible && <VehicleDialog onCancel={cancel} onSubmit={submitHandler} />}
            <button className='w3-button w3-indigo add-button-margin smFullWidth' onClick={showDialog}>Pridať vozidlo</button>
        </div>
    );
};

export default AddVehicle;