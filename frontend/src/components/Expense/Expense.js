import React, { useState, useCallback, useContext, useEffect, Fragment } from 'react';
import SelectVehicle from './SelectVehicle';
import ExpenseTypeDialog from './ExpenseTypeDialog';
import ListOfExpenses from './ListOfExpenses';
import AuthContext from '../../store/auth-context';
import { listOfExpenseLogs } from '../../lib/api';
import SelectExpenseType from './SelectExpenseType';
import ExpenseDialog from './ExpenseDialog';


const Expense = () => {
    const [expenseTypeDialog, setExpenseTypeDialog] = useState(false);
    const [expenseDialog, setExpenseDialog] = useState(false);
    const [list, setList] = useState([]);
    const [chosenVehicle, setChosenVehicle] = useState();
    const [chosenType, setChosenType] = useState();


    const authCtx = useContext(AuthContext);

    const expensesTypesHandler = () => {
        setExpenseTypeDialog(true);
    };

    const createExpense = () => {
        setExpenseDialog(true);
    };

    const cancelExpenseType = () => {
        setExpenseTypeDialog(false);
    };

    const cancelExpense = () => {
        setExpenseDialog(false);
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
            {list.length >= 1 && <ListOfExpenses list={list} />}
            {expenseTypeDialog && <ExpenseTypeDialog onCancel={cancelExpenseType} />}
            {expenseDialog && <ExpenseDialog onCancel={cancelExpense} vehicleId={chosenVehicle} expenseId={chosenType} listOfExpenses={getListOfExpenses}/>}





        </Fragment>
    );

};

export default Expense;