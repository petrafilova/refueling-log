import React, { useRef, useEffect, useState } from 'react';
import { createExpensesType, updateExpenseType } from '../../lib/api';


const AddAndEditExpenseTypeDialog = (props) => {
    const nameInputRef = useRef();
    const [nameInputIsInvalid, setNameInputIsInvalid] = useState();

    useEffect (()=>{
        if (props.expenseType.name) {
            nameInputRef.current.value = props.expenseType.name;
        }
    }, [props.expenseType.name, nameInputRef]);

    const newExpenseTypeHandler = async () => {
        const nameInput = nameInputRef.current.value;

        if (nameInput.trim().length < 1 || nameInput.trim().length > 30){
            setNameInputIsInvalid(true);
            return;
        }

        const nameOfExpenseType = { name: nameInput };
        
        if (props.expenseType.id) {
            await updateExpenseType(props.expenseType.id, nameOfExpenseType);
        } else {
            await createExpensesType(nameOfExpenseType);
        }
        
        props.onCancel();
    };

    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>Pridanie typu výdavku</h2>
                </header>
                <div className='w3-container'>
                    <p>
                        <label className='w3-text-indigo' htmlFor='name'>typ výdavku: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='text' id='name' ref={nameInputRef}></input>
                    </p>
                    {nameInputIsInvalid && <p className='w3-red'>Neplatný údaj.Zadajte min 1 a max 30 znakov.</p>}
                </div>
                <footer className='w3-container w3-light-grey'>
                    <p>
                        <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                        <button className='w3-button w3-indigo w3-right' onClick={newExpenseTypeHandler}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AddAndEditExpenseTypeDialog;