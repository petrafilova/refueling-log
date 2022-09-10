import React, { useContext, useRef, useState, useEffect } from 'react';
import { createVehicleFuel, getVehicleById, listOfVehicleFuels, deleteVehicleFuel, updateVehicleFuel } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import FuelTable from '../VehicleFuel/FuelTable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import sk from 'date-fns/locale/sk';
import getYear from 'date-fns/getYear';
import getMonth from 'date-fns/getMonth';
import getDate from 'date-fns/getDate';
import { padNumber } from '../../lib/dateFormatter';
import { isoDateTimeToString } from '../../lib/dateFormatter';

const VehicleDialog = (props) => {
    registerLocale('sk', sk);
    const authCtx = useContext(AuthContext);
    const vehicleId = props.id;

    const brandInputRef = useRef();
    const modelInputRef = useRef();
    const licensePlateNoInputRef = useRef();
    const colorInputRef = useRef();
    const vinInputRef = useRef();
    const createdAtInputRef = useRef();
    const updatedAtInputRef = useRef();

    const [brandIsInvalid, setBrandIsInvalid] = useState(false);
    const [modelIsInvalid, setModelIsInvalid] = useState(false);
    const [licenseIsInvalid, setLicenseIsInvalid] = useState(false);
    const [colorIsInvalid, setColorIsInvalid] = useState(false);
    const [vinIsInvalid, setVinIsInvalid] = useState(false);
    const [vehicleFuelIsInvalid, setVehicleFuelIsInvalid] = useState(false);
    const [vehicleFuel, setVehicleFuel] = useState([]);

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (vehicleId) {
            const getData = async () => {
                const data = await getVehicleById(vehicleId, authCtx.token);
                console.log(data);
                brandInputRef.current.value = data.brand;
                modelInputRef.current.value = data.model;
                licensePlateNoInputRef.current.value = data.licensePlateNo;
                setDate(new Date(data.dateOfReg));
                colorInputRef.current.value = data.color;
                vinInputRef.current.value = data.vin;
                createdAtInputRef.current.value = isoDateTimeToString(data.createdAt);
                updatedAtInputRef.current.value = isoDateTimeToString(data.updatedAt);
            };
            getData();
            const getFuels = async () => {
                const fuels = await listOfVehicleFuels(vehicleId, authCtx.token);
                setVehicleFuel(fuels);
            };
            getFuels();
        }
    }, [vehicleId, authCtx.token]);

    const submitHandler = async () => {
        setBrandIsInvalid(false);
        setModelIsInvalid(false);
        setLicenseIsInvalid(false);
        setColorIsInvalid(false);
        setVinIsInvalid(false);

        const brand = brandInputRef.current.value;
        const model = modelInputRef.current.value;
        const licensePlateNo = licensePlateNoInputRef.current.value;
        let dateOfReg = date;
        const color = colorInputRef.current.value;
        const vin = vinInputRef.current.value;

        let formIsInvalid = false;

        if (brand.trim().length < 1 || brand.trim().length > 20) {
            setBrandIsInvalid(true);
            formIsInvalid = true;
        }

        if (model.trim().length < 1 || model.trim().length > 60) {
            setModelIsInvalid(true);
            formIsInvalid = true;
        }

        if (licensePlateNo.trim().length < 1 || licensePlateNo.trim().length > 10) {
            setLicenseIsInvalid(true);
            formIsInvalid = true;
        }

        if (color.trim().length > 20) {
            setColorIsInvalid(true);
            formIsInvalid = true;
        }

        if (vin.trim().length > 17) {
            setVinIsInvalid(true);
            formIsInvalid = true;
        }

        if (vehicleFuel.length < 1) {
            setVehicleFuelIsInvalid(true);
            formIsInvalid = true;
        }

        if (formIsInvalid) {
            return;
        }

        if (date) {
            const year = getYear(date);
            const month = padNumber(getMonth(date) + 1);
            const day = padNumber(getDate(date));
            console.log(date);
            dateOfReg = `${year}-${month}-${day}`;
        }

        const createdVehicle = {
            brand,
            model,
            licensePlateNo,
            dateOfReg,
            color,
            vin,
        };

        if (vehicleId) {
            await props.onEdit(createdVehicle);
            for (let i = 0; i < vehicleFuel.length; i++) {
                if (!vehicleFuel[i].id) {
                    await createVehicleFuel({ fuel: vehicleFuel[i].fuel, vehicleId: vehicleId }, authCtx.token);
                } else if (vehicleFuel[i].status === 'DELETED') {
                    await deleteVehicleFuel(vehicleFuel[i].id, authCtx.token);
                } else if (vehicleFuel[i].status === 'EDITED') {
                    await updateVehicleFuel(vehicleFuel[i].id, { fuel: vehicleFuel[i].fuel, vehicleId: vehicleId }, authCtx.token);
                }
            }
        } else {
            const createdId = await props.onSubmit(createdVehicle);
            if (createdId) {
                for (let i = 0; i < vehicleFuel.length; i++) {
                    await createVehicleFuel({ fuel: vehicleFuel[i].fuel, vehicleId: createdId }, authCtx.token);
                }
            }
        }
    };

    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>{props.id ? 'Úprava vozidla' : 'Pridanie vozidla'}</h2>
                </header>
                <div className='w3-container'>
                    <p>
                        <label className='w3-text-indigo' htmlFor='brand'>výrobca: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='text' id='brand' ref={brandInputRef}></input>
                    </p>
                    {brandIsInvalid && <p className='w3-red'>Neplatný údaj. Zadajte min 1 a max 20 znakov.</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='model'>model: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='text' id='model' ref={modelInputRef}></input>
                    </p>
                    {modelIsInvalid && <p className='w3-red'>Neplatný údaj. Zadajte min 1 a max 60 znakov.</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='licensePlateNo'>štátna poznávacia značka: <span className='w3-text-red'>*</span></label>
                        <input className='w3-input w3-border' type='text' id='licensePlateNo' ref={licensePlateNoInputRef}></input>
                    </p>
                    {licenseIsInvalid && <p className='w3-red'>Neplatný údaj. Zadajte min 1 a max 10 znakov.</p>}
                    <div>
                        <label className='w3-text-indigo' htmlFor='dateOfReg'>dátum registrácie: </label>
                        <DatePicker
                            className='w3-input w3-border'
                            type='date'
                            id='dateOfReg'
                            locale="sk"
                            dateFormat="dd.MM.yyyy"
                            selected={date}
                            onChange={(date) => setDate(date)}
                        />
                    </div>
                    <p>
                        <label className='w3-text-indigo' htmlFor='color'>farba: </label>
                        <input className='w3-input w3-border' type='text' id='color' ref={colorInputRef}></input>
                    </p>
                    {colorIsInvalid && <p className='w3-red'>Neplatný údaj. Zadajte max 20 znakov.</p>}
                    <p>
                        <label className='w3-text-indigo' htmlFor='vin'>výrobné číslo: </label>
                        <input className='w3-input w3-border' type='text' id='vin' ref={vinInputRef}></input>
                    </p>
                    {vinIsInvalid && <p className='w3-red'>Neplatný údaj. Zadajte max 17 znakov.</p>}
                    <FuelTable setFuelList={setVehicleFuel} fuelList={vehicleFuel} />
                    {vehicleFuelIsInvalid && <p className='w3-red'>Povinný údaj.</p>}
                    {vehicleId && <p>
                        <label className='w3-text-indigo' htmlFor='createdAt'>vytvorené: </label>
                        <input className='w3-input w3-border' type='text' id='createdAt' readOnly ref={createdAtInputRef}></input>
                    </p>}
                    {vehicleId && <p>
                        <label className='w3-text-indigo' htmlFor='updatedAt'>upravené: </label>
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
    );
};

export default VehicleDialog;