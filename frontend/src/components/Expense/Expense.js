import React, { useState, useCallback, useContext, useEffect, Fragment } from 'react';
import SelectVehicle from './SelectVehicle';
import ExpenseTypeDialog from './ExpenseTypeDialog';
import ListOfExpenses from './ListOfExpenses';
import AuthContext from '../../store/auth-context';
import { listOfExpenseLogs, deleteExpenseLog } from '../../lib/api';
import SelectExpenseType from './SelectExpenseType';
import ExpenseDialog from './ExpenseDialog';
import ModalDialog from '../UI/ModalDialog';


const Expense = () => {
    const [expenseTypeDialog, setExpenseTypeDialog] = useState(false);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [list, setList] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [chosenType, setChosenType] = useState();
    const [singleExpenseId, setSingleExpenseId] = useState();
    const [modalDialog, setModalDialog] = useState(false);

    console.log(list);

    const authCtx = useContext(AuthContext);

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

    const deleteSingleExpense = async() => {
        await deleteExpenseLog(singleExpenseId, authCtx.token);
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

    const getListOfExpenses = useCallback(() => {
        if(chosenType && chosenVehicle) {
            console.log(chosenVehicle, chosenType);
            listOfExpenseLogs(chosenVehicle, authCtx.token, {page: 0, pageSize: 10, order: 'DESC', typeId:+chosenType}).then((data) => {
                setList(data);
            });
        }
       
    }, [authCtx.token, chosenType, chosenVehicle]);

    const setVehicle = (vehicle) => {
        setChosenVehicle(vehicle);
    };
    
    const setType = (type) => {
        setChosenType(type);
    };

    useEffect(() => {
        getListOfExpenses();
    }, [getListOfExpenses]);

   

    return (
        <Fragment>
            <SelectVehicle setChosenVehicle={setVehicle}/>
            <SelectExpenseType setChosenType={setType} />
            <div className='w3-left'>
                <button className="w3-button w3-indigo add-button-margin" onClick={expensesTypesHandler}>Spravovať typy výdavkov</button>
            </div>
            <div className='w3-right'>
                <button className="w3-button w3-indigo add-button-margin" onClick={createExpense}>Pridať záznam o výdavku</button>
            </div>
            {list.length < 1 && <p>Zoznam výdavkov pre dané vozidlo a typ výdavku je prázdny.</p>}
            {list.length >= 1 && <ListOfExpenses list={list} editExpense={editExpense} deleteExpense={deleteExpense}/>}
            {expenseTypeDialog && <ExpenseTypeDialog onCancel={cancelExpenseType} />}
            {expenseDialog && <ExpenseDialog onCancel={cancelExpense} vehicleId={chosenVehicle} expenseId={chosenType} listOfExpenses={getListOfExpenses} singleExpenseId={singleExpenseId}/>}
            {modalDialog && <ModalDialog text={'Naozaj chcete vymazať výdavok?'} onCancel={cancelDeletion} onSubmit={deleteSingleExpense}/>}




        </Fragment>
    );

};

export default Expense;