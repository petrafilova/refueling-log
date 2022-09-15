import React, { useEffect } from 'react';

const SelectExpenseType = (props) => {
    const { setChosenType, listOfTypes, chosenType } = props;

    useEffect (()=> {
        if(listOfTypes.length > 0) {
            if (!chosenType) {
                setChosenType(listOfTypes[0].id);
            }
        }   
    }, [listOfTypes, setChosenType, chosenType]);
    
    const selectTypeHandler = (event) => {
        setChosenType(event.target.value);
    };

    return (
        <div className='w3-section'>
            <label className='w3-text-indigo' htmlFor='type'>Vyberte typ výdavku:</label>
            <select className='w3-select w3-border' name='type' id='type' onChange={selectTypeHandler}>
                {props.listOfTypes && props.listOfTypes.map((l) =>
                    <option key={l.id} value={l.id}>{l.name}</option>
                )};
            </select>
        </div>
    );
};

export default SelectExpenseType;