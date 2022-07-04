import React, { useContext, useState } from 'react';
import AuthContext from '../../store/auth-context';
import VehicleDialog from '../UI/VehicleDialog';
import { createVehicle } from '../../lib/api';

const AddVehicle = (props) => {
    const authCtx = useContext(AuthContext);
    const [createVehicleDialogIsVisible, setCreateVehicleDialogIsVisible] = useState(false);

    const showDialog = () => {
        setCreateVehicleDialogIsVisible(true);
    };

    const cancel = () => {
        setCreateVehicleDialogIsVisible(false);
    };

    const submitHandler = async (createdVehicle) => {
        const success = await createVehicle(createdVehicle, authCtx.token);
        console.log(success);
        !success && setCreateVehicleDialogIsVisible(true);
        success && setCreateVehicleDialogIsVisible(false);
        props.reloadVehicles();
    };

    return (
        <div className='w3-right'>

            {createVehicleDialogIsVisible && <VehicleDialog onCancel={cancel} onSubmit={submitHandler} />}
            <button className="w3-button w3-indigo add-button-margin" onClick={showDialog}>Pridať vozidlo</button>
        </div>

    );
};

export default AddVehicle;