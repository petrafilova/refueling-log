import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { getVehicles, updateVehicleById } from '../../lib/api';
import VehicleItem from './VehicleItem';
import AddVehicle from './AddVehicle';
import ModalDialog from '../UI/ModalDialog';
import { deleteVehicleById } from '../../lib/api';
import VehicleDialog from './VehicleDialog';
import Loading from '../Layout/Loading';

const Vehicles = () => {
    const [vehiclesList, setVehiclesList] = useState([]);
    const [deleteId, setDeleteId] = useState();
    const [editId, setEditId] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const loadVehicles = useCallback(() => {
        const load = async () => {
            setIsLoading(true);
            const availableVehicles = await getVehicles();
            setIsLoading(false);
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
    }, []);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    const cancel = () => {
        setDeleteId();
        setEditId();
    };

    const deleteVehicleItem = async () => {
        setIsLoading(true);
        await deleteVehicleById(deleteId);
        setIsLoading(false);
        setDeleteId();
        loadVehicles();
    };

    const editItem = async (editedVehicle) => {
        setIsLoading(true);
        await updateVehicleById(editId, editedVehicle);
        setIsLoading(false);
        setEditId();
        loadVehicles();
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='w3-bar'>
                <h1 className='w3-left'>Zoznam vozidiel</h1>
                <AddVehicle reloadVehicles={loadVehicles} />
            </div>
            <div className='w3-bar'>
                {vehiclesList.length < 1 && <p>Zoznam vozidiel je prázdny.</p>}
                {vehiclesList.length >= 1 &&
                    <div className='overflow-x-auto'>
                        <table className='w3-table-all'>
                            <thead>
                                <tr className='w3-indigo'>
                                    <th>Výrobca</th>
                                    <th>Model</th>
                                    <th>Štátna poznávacia značka</th>
                                    <th className='w3-center'>Upraviť</th>
                                    <th className='w3-center'>Vymazať</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiclesList}
                            </tbody>
                        </table>
                    </div>}
            </div>
            {deleteId && <ModalDialog text={'Naozaj chcete odstrániť položku?'} onCancel={cancel} onSubmit={deleteVehicleItem} />}
            {editId && <VehicleDialog id={editId} onCancel={cancel} onEdit={editItem} />}
        </Fragment>
    );
};

export default Vehicles;