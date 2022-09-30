import React, { useState, Fragment } from 'react';
import VehicleDialog from './VehicleDialog';
import { createVehicle } from '../../lib/api';
import Loading from '../Layout/Loading';

const AddVehicle = (props) => {
    const [createVehicleDialogIsVisible, setCreateVehicleDialogIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showDialog = () => {
        setCreateVehicleDialogIsVisible(true);
    };

    const cancel = () => {
        setCreateVehicleDialogIsVisible(false);
    };

    const submitHandler = async (createdVehicle) => {
        setIsLoading(true);
        const success = await createVehicle(createdVehicle);
        setIsLoading(false);
        success && setCreateVehicleDialogIsVisible(false);
        props.reloadVehicles();
        return success ? success.id : success;
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-right smFullWidth'>
                {createVehicleDialogIsVisible && <VehicleDialog onCancel={cancel} onSubmit={submitHandler} />}
                <button className='w3-button w3-indigo add-button-margin smFullWidth' onClick={showDialog}>Pridať vozidlo</button>
            </div>
        </Fragment>
    );
};

export default AddVehicle;