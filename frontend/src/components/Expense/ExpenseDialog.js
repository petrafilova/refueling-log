import React, { useRef, useState, useContext, useEffect } from 'react';
import { createExpenseLog, getSingleExpenseLog, updateExpenseLog } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import { isoDateTimeToString } from '../../lib/dateFormatter';

const ExpenseDialog = (props) => {
    registerLocale('sk', sk);
    const authCtx = useContext(AuthContext);

    const priceInputRef = useRef();
    const mileageInputRef = useRef();
    const commentInputRef = useRef();
    const createdAtInputRef = useRef();
    const updatedAtInputRef = useRef();

    const [priceInputIsInvalid, setPriceInputIsInvalid] = useState(false);
    const [mileageInputIsInvalid, setMileageInputIsInvalid] = useState(false);
    const [dateTimeInputIsInvalid, setDateTimeInputIsInvalid] = useState(false);

    const [date, setDate] = useState(new Date());

    const expenseHandler = async () => {
        setPriceInputIsInvalid(false);
        setMileageInputIsInvalid(false);
        setDateTimeInputIsInvalid(false);

        const priceInput = priceInputRef.current.value;
        const mileageInput = mileageInputRef.current.value;
        const commentInput = commentInputRef.current.value;

        let formIsInvalid = false;

        if (priceInput.trim().length === 0 || priceInput < 0) {
            setPriceInputIsInvalid(true);
            formIsInvalid = true;
        }

        if (mileageInput.trim().length === 0 || mileageInput < 0) {
            setMileageInputIsInvalid(true);
            formIsInvalid = true;
        }

        if (!(date instanceof Date)) {
            setDateTimeInputIsInvalid(true);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        const expenseLog = {
            price: priceInput,
            mileage: mileageInput,
            dateTime: date,
            comment: commentInput,
            typeId: props.expenseTypeId,
            vehicleId: props.vehicleId,
        };

        if (props.singleExpenseId) {
            await updateExpenseLog(props.singleExpenseId, expenseLog, authCtx.token);
        } else {
            await createExpenseLog(expenseLog, authCtx.token);
        }

        props.onCancel();
        props.listOfExpenses();
    };

    useEffect(() => {
        if (props.singleExpenseId) {
            console.log(props.singleExpenseId);
            const getData = async () => {
                const data = await getSingleExpenseLog(props.singleExpenseId, authCtx.token);
                priceInputRef.current.value = data.price;
                mileageInputRef.current.value = data.mileage;
                setDate(isoDateTimeToString(data.dateTime));
                commentInputRef.current.value = data.comment;
                createdAtInputRef.current.value = isoDateTimeToString(data.createdAt);
                updatedAtInputRef.current.value = isoDateTimeToString(data.updatedAt);
            };
            getData();
        }
    }, [props.singleExpenseId, authCtx.token]);

    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>Pridanie výdavku</h2>
                </header>
                <div className='w3-container'>
                    <p>
                        <label className='w3-text-indigo' htmlFor='price'>cena: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='number' id='price' ref={priceInputRef}></input>
                    </p>
                    {priceInputIsInvalid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='mileage'>najazdené kilometre: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='number' id='mileage' ref={mileageInputRef}></input>
                    </p>
                    {mileageInputIsInvalid && <p className='w3-red'>Neplatný údaj</p>}
                    <div>
                        <label className='w3-text-indigo' htmlFor='dateTime'>dátum a čas: <span className='w3-text-red'>*</span></label>
                        <DatePicker
                            className='w3-input w3-border'
                            type='datetime-local'
                            id='dateTime'
                            selected={date}
                            onChange={(date) => setDate(date)}
                            timeInputLabel="Time:"
                            dateFormat="dd.MM.yyyy HH:mm"
                            showTimeInput
                            locale="sk"
                        />
                    </div>
                    {dateTimeInputIsInvalid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='comment'>komentár: </label>
                        <input className='w3-input w3-border' type='text' id='comment' ref={commentInputRef}></input>
                    </p>
                    {props.singleExpenseId && <p>
                        <label className='w3-text-indigo' htmlFor='createdAt'>vytvorené: </label>
                        <input className='w3-input w3-border' type='text' id='createdAt' readOnly ref={createdAtInputRef}></input>
                    </p>}
                    {props.singleExpenseId && <p>
                        <label className='w3-text-indigo' htmlFor='updatedAt'>upravené: </label>
                        <input className='w3-input w3-border' type='text' id='updatedAt' readOnly ref={updatedAtInputRef}></input>
                    </p>}
                </div>
                <footer className='w3-container w3-light-grey'>
                    <p>
                        <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                        <button className='w3-button w3-indigo w3-right' onClick={expenseHandler}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ExpenseDialog;