import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { listOfFuelLogs, deleteFuelLog } from '../../lib/api';
import RefuelingTable from './RefuelingTable';
import Selection from './Selection';
import RefuelingDialog from './RefuelingDialog';
import ModalDialog from '../UI/ModalDialog';
import Loading from '../Layout/Loading';

const Refueling = () => {
    const [fuel, setFuel] = useState();
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [fuelLogId, setFuelLogId] = useState(false);
    const [editDialogIsVisible, setEditDialogIsVisible] = useState(false);
    const [deleteDialogIsVisible, setDeleteDialogIsVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const records = useCallback((fId) => {
        if (fId) {
            setIsLoading(true);
            listOfFuelLogs(fId, { page: page, pageSize: 10, order: 'DESC' }).then((data) => {
                setIsLoading(false);
                setList(data.rows);
                setCount(data.count);
            });
        } else {
            setList([]);
        }
    }, [page]);

    useEffect(() => {
        records(fuel?.id);
    }, [records, fuel]);

    const previousPageHandler = () => {
        setPage((page) => {
            if (page === 0) {
                return 0;
            } else {
                return page - 1;
            }
        });
    };

    const nextPageHandler = () => {
        setPage((page) => page + 1);
    };

    const editFuelLog = (id) => {
        setFuelLogId(id);
        setEditDialogIsVisible(true);
    };

    const cancel = () => {
        setEditDialogIsVisible(false);
        setFuelLogId(false);
        records(fuel?.id);
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

    const onChangeFuelHandler = useCallback((fuel) => {
        setFuel(fuel);
        setPage(0);
    }, []);

    const deleteSingleFuelLog = async () => {
        setIsDeleting(true);
        await deleteFuelLog(fuelLogId);
        setIsDeleting(false);
        setFuelLogId();
        setDeleteDialogIsVisible(false);
        records(fuel?.id);
    };

    const fuelsUnitOfMeasure = (fuelType) => {
        let fuelUnit;
        switch (fuelType) {
            case 'GASOLINE':
            case 'DIESEL':
            case 'LPG':
                fuelUnit = 'l';
                break;
            case 'HYDROGEN':
            case 'CNG':
                fuelUnit = 'kg';
                break;
            case 'ELECTRICITY':
                fuelUnit = 'kWh';
                break;
            default:
                fuelUnit = '';
        }
        return fuelUnit;
    };

    return (
        <Fragment>
            {(isLoading || isDeleting) && <Loading />}
            <div className='w3-bar'>
                <h1 className='w3-left'>Záznamy tankovania</h1>
            </div>
            <div>
                <Selection onChangeFuel={onChangeFuelHandler} />
            </div>
            <div className='w3-right smFullWidth'>
                <button className='w3-button w3-indigo add-button-margin smFullWidth' disabled={!fuel} onClick={createRecordHandler} title={!fuel ? 'Pre pridanie záznamu musíte vybrať vozidlo a typ paliva.' : undefined} >Pridať záznam tankovania</button>
            </div>
            <div>
                {list.length < 1 && <div className='w3-padding-64'>Zoznam záznamov tankovania je prázdny.</div>}
                {list.length >= 1 && <RefuelingTable list={list} editSingleFuelLog={editFuelLog} deleteSingleFuelLog={delFuelLog} fuelType={fuel.fuel} unitOfMeasure={fuelsUnitOfMeasure} />}
            </div>
            {list.length >= 1 &&
                <div className='w3-bar w3-border w3-margin-bottom'>
                    <button className='w3-button' disabled={page === 0} onClick={previousPageHandler}>&#10094; Predchádzajúca strana</button>
                    <button className='w3-button w3-right' disabled={(count / (page + 1)) <= 10} onClick={nextPageHandler}>Nasledujúca strana &#10095;</button>
                </div>}
            {editDialogIsVisible && <RefuelingDialog fuelId={fuel?.id} onCancel={cancel} singleFuelLogId={fuelLogId} />}
            {deleteDialogIsVisible && <ModalDialog text={'Naozaj si prajete vymazať záznam?'} onCancel={cancelDeleteDialog} onSubmit={deleteSingleFuelLog} />}
        </Fragment>
    );
};

export default Refueling;