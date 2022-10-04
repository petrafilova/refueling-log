import React, { useRef, useState, useEffect, Fragment } from 'react';
import { getSingleFuelLog, createFuelLog, updateFuelLog } from '../../lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import { isoDateTimeToString } from '../../lib/dateFormatter';
import Loading from '../Layout/Loading';

const RefuelingDialog = (props) => {
    console.log(props);
    registerLocale('sk', sk);
    const [full, setFull] = useState(true);
    const [prevMissing, setPrevMissing] = useState(false);

    const quantityInputRef = useRef();
    const unitPriceInputRef = useRef();
    const totalPriceInputRef = useRef();
    const mileageInputRef = useRef();
    const consumptionInputRef = useRef();
    const createdAtInputRef = useRef();
    const updatedAtInputRef = useRef();

    const [quantityIsValid, setQuantityIsValid] = useState(true);
    const [unitPriceIsValid, setUnitPriceIsValid] = useState(true);
    const [totalPriceIsValid, setTotalPriceIsValid] = useState(true);
    const [mileageIsValid, setMileageIsValid] = useState(true);
    const [dateTimeIsValid, setDateTimeIsValid] = useState(true);
    const [fullIsValid, setFullIsValid] = useState(true);
    const [prevMissingIsValid, setPrevMissingIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [date, setDate] = useState(new Date());

    const fullChanged = (event) => {
        setFull(event.target.value === 'false' ? false : true);
    };

    const prevMissingChanged = (event) => {
        setPrevMissing(event.target.value === 'true' ? true : false);
    };

    const submitHandler = async () => {
        setQuantityIsValid(true);
        setUnitPriceIsValid(true);
        setTotalPriceIsValid(true);
        setMileageIsValid(true);
        setDateTimeIsValid(true);
        setFullIsValid(true);
        setPrevMissingIsValid(true);

        let quantityInput = quantityInputRef.current.value;
        let unitPriceInput = unitPriceInputRef.current.value;
        let totalPriceInput = totalPriceInputRef.current.value;
        const mileageInput = mileageInputRef.current.value;

        let formIsInvalid = false;

        if (quantityInput.trim().length === 0 || quantityInput < 0) {
            setQuantityIsValid(false);
            formIsInvalid = true;
        }

        if (unitPriceInput.trim().length === 0 || unitPriceInput < 0) {
            setUnitPriceIsValid(false);
            formIsInvalid = true;
        }

        if (totalPriceInput.trim().length === 0 || totalPriceInput < 0) {
            setTotalPriceIsValid(false);
            formIsInvalid = true;
        }

        if (mileageInput.trim().length === 0 || mileageInput < 0) {
            setMileageIsValid(false);
            formIsInvalid = true;
        }

        if (!(date instanceof Date)) {
            setDateTimeIsValid(false);
            formIsInvalid = true;
        }

        if (full !== true && full !== false) {
            setFullIsValid(false);
            formIsInvalid = true;
        }

        if (prevMissing !== true && prevMissing !== false) {
            setPrevMissingIsValid(false);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        console.log(props.fuelId);

        const fuelLog = {
            quantity: quantityInput,
            unitPrice: unitPriceInput,
            totalPrice: totalPriceInput,
            mileage: mileageInput,
            dateTime: new Date(date),
            full: full,
            previousMissing: prevMissing,
            vehicleFuelId: props.fuelId,
        };

        setIsLoading(true);
        if (props.singleFuelLogId) {
            await updateFuelLog(props.singleFuelLogId, fuelLog);
        } else {
            await createFuelLog(fuelLog);
        }
        setIsLoading(false);

        props.onCancel();
    };

    useEffect(() => {
        if (props.singleFuelLogId) {
            const getData = async () => {
                setIsLoading(true);
                const data = await getSingleFuelLog(props.singleFuelLogId);
                setIsLoading(false);
                quantityInputRef.current.value = data.quantity;
                unitPriceInputRef.current.value = data.unitPrice;
                totalPriceInputRef.current.value = data.totalPrice;
                mileageInputRef.current.value = data.mileage;
                setDate(new Date(data.dateTime));
                setFull(data.full);
                setPrevMissing(data.previousMissing);
                consumptionInputRef.current.value = data.consumption;
                createdAtInputRef.current.value = isoDateTimeToString(data.createdAt);
                updatedAtInputRef.current.value = isoDateTimeToString(data.updatedAt);
            };
            getData();
        }
    }, [props.singleFuelLogId]);


    const count = (event) => {
        const targetId = event.target.id;

        const quantity = quantityInputRef.current.value;
        const unitPrice = unitPriceInputRef.current.value;
        const totalPrice = totalPriceInputRef.current.value;

        if ((targetId === 'quantity') && quantity && totalPrice) {
            unitPriceInputRef.current.value = totalPrice / quantity;
        } else if (targetId === 'quantity' && unitPrice && quantity) {
            totalPriceInputRef.current.value = quantity * unitPrice;
        }

        if (targetId === 'unitPrice' && unitPrice && quantity) {
            totalPriceInputRef.current.value = quantity * unitPrice;
        }

        if ((targetId === 'totalPrice') && totalPrice && quantity) {
            unitPriceInputRef.current.value = totalPrice / quantity;
        }
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-modal w3-show'>
                <div className='w3-modal-content dialog'>
                    <header className='w3-container w3-light-grey'>
                        <h2>{props.singleFuelLogId ? 'Úprava záznamu o tankovaní' : 'Pridanie záznamu o tankovaní'}</h2>
                    </header>
                    <div className='w3-container'>
                        <p>
                            <label className='w3-text-indigo' htmlFor='quantity'>Množstvo: <span className='w3-text-red'>*</span></label>
                            <input className='w3-input w3-border' type='number' id='quantity' ref={quantityInputRef} onChange={count}></input>
                        </p>
                        {!quantityIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <p>
                            <label className='w3-text-indigo' htmlFor='unitPrice'>Jednotková cena: <span className='w3-text-red'>*</span></label>
                            <input className='w3-input w3-border' type='number' id='unitPrice' ref={unitPriceInputRef} onChange={count}></input>
                        </p>
                        {!unitPriceIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <p>
                            <label className='w3-text-indigo' htmlFor='totalPrice'>Celková cena: <span className='w3-text-red'>*</span></label>
                            <input className='w3-input w3-border' type='number' id='totalPrice' ref={totalPriceInputRef} onChange={count}></input>
                        </p>
                        {!totalPriceIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <p>
                            <label className='w3-text-indigo' htmlFor='mileage'>Najazdené kilometre: <span className='w3-text-red'>*</span></label>
                            <input className='w3-input w3-border' type='number' id='mileage' ref={mileageInputRef}></input>
                        </p>
                        {!mileageIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <div>
                            <label className='w3-text-indigo' htmlFor='dateTime'>Dátum a čas: <span className='w3-text-red'>*</span></label>
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
                        {!dateTimeIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <div>
                            <p className='w3-text-indigo'>Plná nádrž: <span className='w3-text-red'>*</span></p>
                            <input type='radio' id='fullTrue' name='full' value='true' checked={full === true} onChange={fullChanged}></input>
                            <label htmlFor='fullTrue'> áno</label><br></br>
                            <input type='radio' id='fullFalse' name='full' value='false' checked={full === false} onChange={fullChanged}></input>
                            <label htmlFor='fullFalse'> nie</label>
                        </div>
                        {!fullIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        <div>
                            <p className='w3-text-indigo'>Chýbajúce predchádzajúce údaje: <span className='w3-text-red'>*</span></p>
                            <input type='radio' id='previousMissingTrue' name='previousMissing' value='true' checked={prevMissing === true} onChange={prevMissingChanged}></input>
                            <label htmlFor='previousMissingTrue'> áno</label><br></br>
                            <input type='radio' id='previousMissingFalse' name='previousMissing' value='false' checked={prevMissing === false} onChange={prevMissingChanged}></input>
                            <label htmlFor='previousMissingFalse'> nie</label>
                        </div>
                        {!prevMissingIsValid && <p className='w3-red'>Neplatný údaj.</p>}
                        {props.singleFuelLogId && <p>
                            <label className='w3-text-indigo' htmlFor='consumption'>Spotreba: </label>
                            <input className='w3-input w3-border' type='number' id='consumption' readOnly ref={consumptionInputRef}></input>
                        </p>}
                        {props.singleFuelLogId && <p>
                            <label className='w3-text-indigo' htmlFor='createdAt'>Vytvorené: </label>
                            <input className='w3-input w3-border' type='text' id='createdAt' readOnly ref={createdAtInputRef}></input>
                        </p>}
                        {props.singleFuelLogId && <p>
                            <label className='w3-text-indigo' htmlFor='updatedAt'>Upravené: </label>
                            <input className='w3-input w3-border' type='text' id='updatedAt' readOnly ref={updatedAtInputRef}></input>
                        </p>}
                    </div>
                    <footer className='w3-container w3-light-grey'>
                        <p>
                            <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                            <button className='w3-button w3-indigo w3-right' onClick={submitHandler}>Potvrdiť</button>
                        </p>
                    </footer>
                </div>
            </div>
        </Fragment>
    );
};

export default RefuelingDialog;