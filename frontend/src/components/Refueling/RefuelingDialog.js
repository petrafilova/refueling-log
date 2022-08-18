import React, { useRef, useState, useContext, useEffect } from 'react';
import { getSingleFuelLog, createFuelLog, updateFuelLog } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { formatDate } from '../../lib/dateFormatter';

const RefuelingDialog = (props) => {
    const authCtx = useContext(AuthContext);
    const [full, setFull] = useState();
    const [prevMissing, setPrevMissing] = useState();

    const quantityInputRef = useRef();
    const unitPriceInputRef = useRef();
    const totalPriceInputRef = useRef();
    const mileageInputRef = useRef();
    const dateTimeInputRef = useRef();
    const consumptionInputRef = useRef();
    const vehicleFuelIdInputRef = useRef();
    const createdAtInputRef = useRef();
    const updatedAtInputRef = useRef();

    const [quantityIsValid, setQuantityIsValid] = useState(true);
    const [unitPriceIsValid, setUnitPriceIsValid] = useState(true);
    const [totalPriceIsValid, setTotalPriceIsValid] = useState(true);
    const [mileageIsValid, setMileageIsValid] = useState(true);
    const [dateTimeIsValid, setDateTimeIsValid] = useState(true);
    const [fullIsValid, setFullIsValid] = useState(true);
    const [prevMissingIsValid, setPrevMissingIsValid] = useState(true);

    const fullChanged = (event) => {
        setFull(event.target.value === 'false' ? false : true);
    };

    const prevMissingChanged = (event) => {
        setPrevMissing(event.target.value === 'true');
    };

    const submitHandler = async () => {
        setQuantityIsValid(true);
        setUnitPriceIsValid(true);
        setTotalPriceIsValid(true);
        setMileageIsValid(true);
        setDateTimeIsValid(true);
        setFullIsValid(true);
        setPrevMissingIsValid(true);

        const quantityInput = quantityInputRef.current.value;
        const unitPriceInput = unitPriceInputRef.current.value;
        const totalPriceInput = totalPriceInputRef.current.value;
        const mileageInput = mileageInputRef.current.value;
        const dateTimeInput = dateTimeInputRef.current.value;

        let formIsInvalid = false;

        if (quantityInput < 0 || (quantityInput.trim().length === 0)) {
            setQuantityIsValid(false);
            formIsInvalid = true;
        } 
         
        if (unitPriceInput < 0  || (unitPriceInput.trim().length === 0)) {
            setUnitPriceIsValid(false);
            formIsInvalid = true;
        }
        
        if (totalPriceInput < 0  || (totalPriceInput.trim().length === 0)) {
            setTotalPriceIsValid(false);
            formIsInvalid = true;
        }
        
        if (mileageInput < 0  || (mileageInput.trim().length === 0)) {
            setMileageIsValid(false);
            formIsInvalid = true;
        }
        
        if (dateTimeInput.trim().length === 0) {
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

        const fuelLog = {
            quantity: quantityInput,
            unitPrice: unitPriceInput,
            totalPrice: totalPriceInput,
            mileage: mileageInput,
            dateTime: new Date(dateTimeInput),
            full: full,
            previousMissing: prevMissing,
            vehicleFuelId: props.fuelId,
        };
        
        if (props.singleFuelLogId) {
            await updateFuelLog(props.singleFuelLogId, fuelLog, authCtx.token);
        } else {
            await createFuelLog(fuelLog, authCtx.token);
        }

        props.onCancel();
    };

    useEffect(() => {
        if (props.singleFuelLogId) {
            console.log('useEffect - singlefuelLog', props.singleFuelLogId);
            const getData = async () => {
                const data = await getSingleFuelLog(props.singleFuelLogId, authCtx.token);
                quantityInputRef.current.value = data.quantity;
                unitPriceInputRef.current.value = data.unitPrice;
                totalPriceInputRef.current.value = data.totalPrice;
                mileageInputRef.current.value = data.mileage;
                dateTimeInputRef.current.value = formatDate(data.dateTime);
                setFull(data.full);
                setPrevMissing(data.previousMissing);
                consumptionInputRef.current.value = data.consumption;
                vehicleFuelIdInputRef.current.value = data.vehicleFuelId;
                createdAtInputRef.current.value = new Date(data.createdAt).toLocaleString();
                updatedAtInputRef.current.value = new Date(data.updatedAt).toLocaleString();
            };
            getData();
        }
    }, [props.singleFuelLogId, authCtx.token]);

    return (
        <div className="w3-modal w3-show">
            <div className="w3-modal-content dialog">
                <header className="w3-container w3-light-grey">
                    <h2>{props.singleFuelLogId ? 'Úprava záznamu o tankovaní' : 'Pridanie záznamu o tankovaní'}</h2>
                </header>
                <div className="w3-container">
                    <p>
                        <label className="w3-text-indigo" htmlFor="quantity">množstvo: </label>
                        <input className="w3-input w3-border" type="number" id="quantity" ref={quantityInputRef}></input>
                    </p>
                    {!quantityIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className="w3-text-indigo" htmlFor="unitPrice">jednotková cena: </label>
                        <input className="w3-input w3-border" type="number" id="unitPrice" ref={unitPriceInputRef}></input>
                    </p>
                    {!unitPriceIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className="w3-text-indigo" htmlFor="totalPrice">celková cena: </label>
                        <input className="w3-input w3-border" type="number" id="totalPrice" ref={totalPriceInputRef}></input>
                    </p>
                    {!totalPriceIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className="w3-text-indigo" htmlFor="mileage">najazdené kilometre: </label>
                        <input className="w3-input w3-border" type="number" id="mileage" ref={mileageInputRef}></input>
                    </p>
                    {!mileageIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <p>
                        <label className="w3-text-indigo" htmlFor="dateTime">dátum a čas: </label>
                        <input className="w3-input w3-border" type="datetime-local" id="dateTime" ref={dateTimeInputRef}></input>
                    </p>
                    {!dateTimeIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <div>
                        <p className="w3-text-indigo">plná nádrž: </p>
                        <input type="radio" id="fullTrue" name="full" value="true" checked={full === true} onChange={fullChanged}></input>
                        <label htmlFor='fullTrue'> áno</label><br></br>
                        <input type="radio" id="fullFalse" name="full" value="false" checked={full === false} onChange={fullChanged}></input>
                        <label htmlFor='fullFalse'> nie</label>
                    </div>
                    {!fullIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    <div>
                        <p className="w3-text-indigo">chýbajúce predchádzajúce údaje: </p>
                        <input type="radio" id="previousMissingTrue" name="previousMissing" value="true" checked={prevMissing === true} onChange={prevMissingChanged}></input>
                        <label htmlFor='previousMissingTrue'> áno</label><br></br>
                        <input type="radio" id="previousMissingFalse" name="previousMissing" value="false" checked={prevMissing === false} onChange={prevMissingChanged}></input>
                        <label htmlFor='previousMissingFalse'> nie</label>
                    </div>
                    {!prevMissingIsValid && <p className='w3-red'>Neplatný údaj</p>}
                    {props.singleFuelLogId && <p>
                        <label className="w3-text-indigo" htmlFor="consumption">spotreba: </label>
                        <input className="w3-input w3-border" type="number" id="consumption" readOnly ref={consumptionInputRef}></input>
                    </p>}
                    {props.singleFuelLogId && <p>
                        <label className="w3-text-indigo" htmlFor="vehicleFuelId">Id paliva: </label>
                        <input className="w3-input w3-border" type="number" id="vehicleFuelId" readOnly ref={vehicleFuelIdInputRef}></input>
                    </p>}
                    {props.singleFuelLogId && <p>
                        <label className="w3-text-indigo" htmlFor="createdAt">vytvorené: </label>
                        <input className="w3-input w3-border" type="text" id="createdAt" readOnly ref={createdAtInputRef}></input>
                    </p>}
                    {props.singleFuelLogId && <p>
                        <label className="w3-text-indigo" htmlFor="updatedAt">upravené: </label>
                        <input className="w3-input w3-border" type="text" id="updatedAt" readOnly ref={updatedAtInputRef}></input>
                    </p>}
                </div>
                <footer className="w3-container w3-light-grey">
                    <p>
                        <button className="w3-button w3-indigo" onClick={props.onCancel}>Zrušiť</button>
                        <button className="w3-button w3-indigo w3-right" onClick={submitHandler}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default RefuelingDialog;