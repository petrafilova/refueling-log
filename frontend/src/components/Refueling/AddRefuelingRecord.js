import React, { useState} from 'react';
import RefuelingDialog from './RefuelingDialog';

const AddRefuelingRecord = (props) => {
    const [addDialogIsVisible, setAddDialogIsVisible] = useState(false);

    const createRecordHandler = () => {
        setAddDialogIsVisible(true);
    };

    console.log('AddRefuelingRecord', props);

    return (
        <div className='w3-right'>
            <button className="w3-button w3-indigo add-button-margin" onClick={createRecordHandler}>Pridať záznam o tankovaní</button>
            {addDialogIsVisible && <RefuelingDialog fuelId={props.fuelId} onCancel={setAddDialogIsVisible.bind(null, false)} setFuelLog={props.fuelLog} />}
        </div>

    );
};

export default AddRefuelingRecord;