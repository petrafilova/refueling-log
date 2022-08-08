import React, {useState} from 'react';
import SelectVehicle from './SelectVehicle';
import ExpenseTypeDialog from './ExpenseTypeDialog';


const Expense = () => {
    const [dialogIsVisible, setDialogIsVisible] = useState(false);

    const expensesTypesHandler = () => {
        setDialogIsVisible(true);
    };

    const createExpense = () => {};

    const cancel = () => {
        setDialogIsVisible(false);
    };

    return (
        <div>
            <SelectVehicle />
            <div className='w3-left'>
                <button className="w3-button w3-indigo add-button-margin" onClick={expensesTypesHandler}>Spravovať typy výdavkov</button>
            </div>
            <div className='w3-right'>
                <button className="w3-button w3-indigo add-button-margin" onClick={createExpense}>Pridať záznam o výdavku</button>
            </div>
            {dialogIsVisible && <ExpenseTypeDialog onCancel={cancel}/>}



        </div>
    );

};

export default Expense;