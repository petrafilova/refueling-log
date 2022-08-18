import React, { useContext, useState, useEffect, useCallback, Fragment } from 'react';
import { getVehicles, updateVehicleById } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import VehicleItem from './VehicleItem';
import AddVehicle from './AddVehicle';
import ModalDialog from '../UI/ModalDialog';
import { deleteVehicleById } from '../../lib/api';
import VehicleDialog from '../UI/VehicleDialog';

const Vehicles = () => {
    const authCtx = useContext(AuthContext);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [deleteId, setDeleteId] = useState();
    const [editId, setEditId] = useState();

    const loadVehicles = useCallback(() => {
        const load = async () => {
            const availableVehicles = await getVehicles(authCtx.token);
            setVehiclesList(
                availableVehicles.map((vehicle) =>
                    <VehicleItem
                        id={vehicle.id}
                        key={vehicle.id}
                        brand={vehicle.brand}
                        model={vehicle.model}
                        licensePlateNo={vehicle.licensePlateNo}
                        deleteVehicle={setDeleteId}
                        editItem={setEditId}
                    />
                )
            );
        };
        load();
    }, [authCtx.token]);

    console.log(vehiclesList);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    const cancel = () => {
        setDeleteId();
        setEditId();
    };

    const deleteVehicleItem = async () => {
        await deleteVehicleById(deleteId, authCtx.token);
        setDeleteId();
        loadVehicles();
    };

    const editItem = async (editedVehicle) => {
        await updateVehicleById(editId, editedVehicle, authCtx.token);
        setEditId();
        loadVehicles();
    };

    return (
        <Fragment>
            <div className='w3-bar'>
                <h1 className='w3-left'>Zoznam vozidiel</h1>
                <AddVehicle reloadVehicles={loadVehicles} />
            </div>
            <div className='w3-bar'>
                {vehiclesList.length < 1 && <p>Zoznam vozidiel je prázdny.</p>}
                {vehiclesList.length >= 1 &&
                    <table className='w3-table-all'>
                        <thead>
                            <tr className="w3-indigo">
                                <th>Výrobca</th>
                                <th>Model</th>
                                <th>štátna poznávacia značka</th>
                                <th className='w3-center'>Upraviť</th>
                                <th className='w3-center'>Vymazať</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiclesList}
                        </tbody>
                    </table>}
            </div>
            {deleteId && <ModalDialog text={'Naozaj chcete odstrániť položku?'} onCancel={cancel} onSubmit={deleteVehicleItem} />}
            {editId && <VehicleDialog id={editId} onCancel={cancel} onEdit={editItem} />}
        </Fragment>
    );
};

export default Vehicles;