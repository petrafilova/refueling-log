import React, { useState, useCallback, useEffect, Fragment } from 'react';
import SelectVehicle from './SelectVehicle';
import ExpenseTypeDialog from './ExpenseTypeDialog';
import ListOfExpenses from './ListOfExpenses';
import { listOfExpenseLogs, deleteExpenseLog, listOfExpensesTypes } from '../../lib/api';
import SelectExpenseType from './SelectExpenseType';
import ExpenseDialog from './ExpenseDialog';
import ModalDialog from '../UI/ModalDialog';
import Loading from '../Layout/Loading';

const Expense = () => {
    const [listOfET, setListOfET] = useState([]);
    const [expenseTypeDialog, setExpenseTypeDialog] = useState(false);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [list, setList] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [chosenType, setChosenType] = useState();
    const [singleExpenseId, setSingleExpenseId] = useState();
    const [modalDialog, setModalDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const listOfTypes = useCallback(() => {
        setIsLoading(true);
        listOfExpensesTypes().then((data) => {
            setIsLoading(false);
            setListOfET(data);
        });
    }, []);

    useEffect(() => {
        listOfTypes();
    }, [listOfTypes]);

    const expensesTypesHandler = () => {
        setExpenseTypeDialog(true);
    };

    const createExpense = () => {
        setExpenseDialog(true);
    };

    const editExpense = (id) => {
        setExpenseDialog(true);
        if (id) {
            setSingleExpenseId(id);
        }
    };

    const deleteExpense = (id) => {
        setModalDialog(true);
        if (id) {
            setSingleExpenseId(id);
        }
    };

    const deleteSingleExpense = async () => {
        setIsLoading(true);
        await deleteExpenseLog(singleExpenseId);
        setIsLoading(false);
        setSingleExpenseId('');
        setModalDialog(false);
        getListOfExpenses();
    };

    const cancelDeletion = () => {
        setSingleExpenseId('');
        setModalDialog(false);
    };

    const cancelExpenseType = () => {
        setExpenseTypeDialog(false);
    };

    const cancelExpense = () => {
        setExpenseDialog(false);
        if (singleExpenseId) {
            setSingleExpenseId('');
        }
    };

    const onChangeVehicleHandler = useCallback((vehicle) => {
        setChosenVehicle(vehicle);
        setPage(0);
    }, []);

    const onChangeTypeHandler = useCallback((type) => {
        setChosenType(type);
        setPage(0);
    }, []);

    const getListOfExpenses = useCallback(() => {
        if (chosenType && chosenVehicle) {
            setIsLoading(true);
            listOfExpenseLogs(chosenVehicle, { page: page, pageSize: 10, order: 'DESC', typeId: +chosenType }).then((data) => {
                setIsLoading(false);
                setList(data.rows);
                setCount(data.count);
            });
        }
    }, [chosenType, chosenVehicle, page]);

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

    useEffect(() => {
        getListOfExpenses();
    }, [getListOfExpenses]);

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-bar'>
                <h1 className='w3-left'>Záznamy výdavkov</h1>
            </div>
            <SelectVehicle setChosenVehicle={onChangeVehicleHandler} />
            <SelectExpenseType setChosenType={onChangeTypeHandler} listOfTypes={listOfET} chosenType={chosenType} />
            <div className='w3-left smFullWidth'>
                <button className='w3-button w3-indigo add-button-margin smFullWidth' onClick={expensesTypesHandler}>Spravovať typy výdavkov</button>
            </div>
            <div className='w3-right smFullWidth'>
                <button className='w3-button w3-indigo add-button-margin smFullWidth' disabled={!chosenType || !chosenVehicle || listOfET.length < 1} onClick={createExpense} title={!chosenType || !chosenVehicle || listOfET.length < 1 ? 'Pre pridanie záznamu musíte vybrať vozidlo a typ výdavku.' : undefined} >Pridať záznam výdavku</button>
            </div>
            <div className='w3-bar'>
                {list.length < 1 && <p>Zoznam výdavkov pre dané vozidlo a typ výdavku je prázdny.</p>}
                {list.length >= 1 && <ListOfExpenses list={list} editExpense={editExpense} deleteExpense={deleteExpense} listOfTypes={listOfET} />}
            </div>
            {list.length >= 1 &&
                <div className='w3-bar w3-border w3-margin-bottom'>
                    <button className='w3-button' disabled={page === 0} onClick={previousPageHandler}>&#10094; Predchádzajúca strana</button>
                    <button className='w3-button w3-right' disabled={(count / (page + 1)) <= 10} onClick={nextPageHandler}>Nasledujúca strana &#10095;</button>
                </div>}
            {expenseTypeDialog && <ExpenseTypeDialog onCancel={cancelExpenseType} listOfExpenses={listOfET} loadList={listOfTypes} />}
            {expenseDialog && <ExpenseDialog onCancel={cancelExpense} vehicleId={chosenVehicle} expenseTypeId={chosenType} listOfExpenses={getListOfExpenses} singleExpenseId={singleExpenseId} />}
            {modalDialog && <ModalDialog text={'Naozaj chcete vymazať výdavok?'} onCancel={cancelDeletion} onSubmit={deleteSingleExpense} />}
        </Fragment >
    );
};

export default Expense;