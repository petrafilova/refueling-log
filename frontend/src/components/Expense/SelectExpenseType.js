import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { listOfExpensesTypes } from '../../lib/api';

const SelectExpenseType = (props) => {
    const authCtx = useContext(AuthContext);
    const [listOfTypes, setListOfTypes] = useState([]);

    const { setChosenType } = props;

    useEffect(() => {
        (async () => {
            const expensesTypes = await listOfExpensesTypes(authCtx.token);
            setListOfTypes(expensesTypes);
            if (expensesTypes.length > 0) {
                console.log('SETUJEM', expensesTypes[0].id);
                setChosenType(expensesTypes[0].id);
            }
        })();
    }, [authCtx.token, setChosenType]);

    const selectTypeHandler = (event) => {
        console.log(event.target.value);
        setChosenType(event.target.value);
    };

    return (
        <div className='w3-section'>
            <label className='w3-text-indigo' htmlFor='type'>Vyberte typ výdavku:</label>
            <select className='w3-select w3-border' name='type' id='type' onChange={selectTypeHandler}>
                {listOfTypes.map((l) =>
                    <option key={l.id} value={l.id}>{l.name}</option>
                )};
            </select>
        </div>
    );
};

export default SelectExpenseType;