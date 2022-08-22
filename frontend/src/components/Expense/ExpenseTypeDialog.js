import React, { useState, useContext} from 'react';
import { deleteExpenseType } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import AddAndEditExpenseTypeDialog from './AddAndEditExpenseTypeDialog';
import ExpenseTypeTable from './ExpenseTypeTable';
import ModalDialog from '../UI/ModalDialog';

const ExpenseTypeDialog = (props) => {
    const authCtx = useContext(AuthContext);
    const [addAndEditExpenseDialog, setAddAndEditExpenseDialog] = useState(false);
    const [confirmDeletion, setConfirmDeletion] = useState(false);
    const [expenseType, setExpenseType] = useState({id: '', name: ''});

    const editET = (id, name) => {
        setExpenseType({id: id, name: name});
        setAddAndEditExpenseDialog(true);
    };
    
    const deleteET = (id, name) => {
        setExpenseType({id:id, name:name});
        setConfirmDeletion(true);
    };

    const addExpense = () => {
        setAddAndEditExpenseDialog(true);
    };

    const cancelAddAndEditExpenseDialog = () => {
        setAddAndEditExpenseDialog(false);
        setExpenseType({id: '', name: ''});
        props.loadList();
    };

    const cancelConfirmation = () => {
        setConfirmDeletion(false);
        setExpenseType({id: '', name: ''});
    };

    const deleteExpenseTypeById = async() => {
        await deleteExpenseType(expenseType.id, authCtx.token);
        setConfirmDeletion(false);
        setExpenseType({id: '', name: ''});
        props.loadList();
    };

    return (<div className='w3-modal w3-show'>
        <div className='w3-modal-content dialog'>
            <header className='w3-container w3-light-grey'>
                <h2>Typy výdavkov</h2>
            </header>
            <div className='w3-container'>
                {props.listOfExpenses.length < 1 && <p>Žiadne typy výdavkov nie sú uložené.</p>}
                {props.listOfExpenses.length >= 1 && <ExpenseTypeTable list={props.listOfExpenses} editExpenseType={editET} deleteExpenseType={deleteET}/>}
            </div>
            <footer className='w3-container w3-light-grey'>
                <p>
                    <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                    <button className='w3-button w3-indigo w3-right' onClick={addExpense}>Pridať typ výdavku</button>
                </p>
            </footer>
        </div>
        {addAndEditExpenseDialog && <AddAndEditExpenseTypeDialog onCancel={cancelAddAndEditExpenseDialog} expenseType={expenseType}/>}
        {confirmDeletion && <ModalDialog text={`Naozaj chcete vymazať typ pvýdavku? "${expenseType.name}"?`} onCancel={cancelConfirmation} onSubmit={deleteExpenseTypeById}/>}
    </div>);
};

export default ExpenseTypeDialog;