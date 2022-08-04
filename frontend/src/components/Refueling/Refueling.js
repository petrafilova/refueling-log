import React, { useEffect, useState, useContext, useCallback } from 'react';
import { listOfFuelLogs, deleteFuelLog} from '../../lib/api';
// import AddRefuelingRecord from './AddRefuelingRecord';
import RefuelingTable from './RefuelingTable';
import Selection from './Selection';
import AuthContext from '../../store/auth-context';
import RefuelingDialog from './RefuelingDialog';
import ModalDialog from '../UI/ModalDialog';

const Refueling = () => {
    const authCtx = useContext(AuthContext);
    const [fuelId, setFuelId] = useState();
    const [list, setList] = useState([]);
    
    const [fuelLogId, setFuelLogId] = useState(false);
    const [editDialogIsVisible, setEditDialogIsVisible] = useState(false);
    const [deleteDialogIsVisible, setDeleteDialogIsVisible] = useState(false);

    console.log('fuelId', fuelId);
    console.log('list', list);

    const records = useCallback(() => {
        listOfFuelLogs(fuelId, authCtx.token, { page: 0, pageSize: 10, order: 'DESC' }).then((data) => {
            setList(data);
        });
    }, [fuelId, authCtx.token]);

    useEffect(() => {
        if (fuelId) {
            records();
            console.log(list);
        }
    }, [records]);

    console.log('list', list);

    const editFuelLog = (id) => {
        setFuelLogId(id);
        setEditDialogIsVisible(true);
    };
    console.log(fuelLogId);

    const cancel = () => {
        setEditDialogIsVisible(false);
        setFuelLogId(false);
        records();
    };

    const createRecordHandler = () => {
        setEditDialogIsVisible(true);
    };

    const delFuelLog = (id) => {
        setFuelLogId(id);
        setDeleteDialogIsVisible(true);
    };

    const cancelDeleteDialog = () => {
        setFuelLogId();
        setDeleteDialogIsVisible(false);
    };

    const deleteSingleFuelLog = async () => {
        await deleteFuelLog(fuelLogId, authCtx.token);
        setFuelLogId();
        setDeleteDialogIsVisible(false);
        records();
    };

    return (
        <div>
            <div className='w3-bar'>
                <h1 className='w3-left'>Záznamy tankovania</h1>
            </div>
            <div>
                <Selection onChangeFuel={setFuelId} fuelId={fuelId} />
            </div>
            <div className='w3-right'>
                <button className="w3-button w3-indigo add-button-margin" onClick={createRecordHandler}>Pridať záznam o tankovaní</button>
            </div>
            <div>
                {list.length < 1 && <div className='w3-padding-64'>Zoznam záznamov tankovania je prázdny.</div>}
                {list.length >= 1 && <RefuelingTable list={list} editSingleFuelLog={editFuelLog} deleteSingleFuelLog={delFuelLog} />}
            </div>
            {editDialogIsVisible && <RefuelingDialog fuelId={fuelId} onCancel={cancel} singleFuelLogId={fuelLogId} />}
            {deleteDialogIsVisible && <ModalDialog text={'Naozaj si prajete vymazať záznam?'} onCancel={cancelDeleteDialog} onSubmit={deleteSingleFuelLog} />}
        </div>
    );
};

export default Refueling;