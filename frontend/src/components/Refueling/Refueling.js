import React, { useEffect, useState, useContext, useCallback } from 'react';
import { listOfFuelLogs, createFuelLog } from '../../lib/api';
import AddRefuelingRecord from './AddRefuelingRecord';
import RefuelingTable from './RefuelingTable';
import Selection from './Selection';
import AuthContext from '../../store/auth-context';
import RefuelingDialog from './RefuelingDialog';

const Refueling = () => {
    const authCtx = useContext(AuthContext);
    const [fuelId, setFuelId] = useState();
    const [list, setList] = useState([]);
    const [fuelLog, setFuelLog] = useState();
    const [fuelLogId, setFuelLogId] = useState(false);
    const [editDialogIsVisible, setEditDialogIsVisible] = useState(false);

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
    console.log('fuelLog', fuelLog);

    useEffect(()=>{
        if (fuelLog) {
            console.log('useEffect - fuelLog', fuelLog);
            (async () => {
                await createFuelLog(fuelLog, authCtx.token);
                records();
            })();
        }
    }, [fuelLog, authCtx.token]);

    const editFuelLog = (id) => {
        setFuelLogId(id);
        setEditDialogIsVisible(true);
        
    };
    console.log(fuelLogId);

    const cancel = () => {
        setEditDialogIsVisible(false);
        setFuelLogId(false);
    };


    return (
        <div>
            <div className='w3-bar'>
                <h1 className='w3-left'>Záznamy tankovania</h1>
            </div>
            <div>
                <Selection onChangeFuel={setFuelId} fuelId={fuelId} />
                <AddRefuelingRecord fuelId={fuelId} fuelLog={setFuelLog}/>
            </div>
            <div>
                {list.length < 1 && <div className='w3-padding-64'>Zoznam záznamov tankovania je prázdny.</div>}
                {list.length >= 1 && <RefuelingTable list={list} editSingleFuelLog={editFuelLog}/>}
            </div>
            <div>
                {editDialogIsVisible && <RefuelingDialog singleFuelLogId={fuelLogId} onCancel={cancel}/>}
            </div>
        </div>
    );
};

export default Refueling;