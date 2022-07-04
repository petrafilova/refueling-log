import React, { useState } from 'react';

const FuelTable = () => {

    const [fuel, setFuel] = useState();
    const [fuelList, setFuelList] = useState([]);

    const selectChangeHandler = (event) => {
        console.log(event);
        setFuel(event.target.value);
    };

    const listOfFuelHandler = () => {
        console.log(fuel);
        console.log(fuelList);
        setFuelList((o) => {
            const n = [...o];
            n.push(fuel);
            return n;
        });
    };

    const selectedFuels = fuelList.map((f) =>
        <tr key={f}>
            <td>
                {f}
            </td>
        </tr>
    );

    return (
        <div>
            <label className='w3-text-indigo' htmlFor='fuel'>palivo: </label>
            <div className='flex'>
                <select className='w3-select w3-border' name='fuel' id='fuel' defaultValue='' onChange={selectChangeHandler}>
                    <option value="" disabled>Vyberte typ paliva</option>
                    <option value="GASOLINE">benzín</option>
                    <option value="DIESEL">nafta</option>
                    <option value="LPG">LPG</option>
                    <option value="CNG">CNG</option>
                    <option value="HYDROGEN">vodík</option>
                    <option value="ELEKTRICITY">elektrika</option>
                </select>
                <button className='w3-button w3-indigo w3-right' disabled={!fuel} onClick={listOfFuelHandler}>Pridať</button>
            </div>

            <table className='w3-table-all w3-section'>
                {/* <thead>
                    <tr className="w3-indigo">
                        <th>Typ paliva</th>
                        <th className='w3-center'>Upraviť</th>
                        <th className='w3-center'>Vymazať</th>
                    </tr>
                </thead> */}
                <tbody>
                    {selectedFuels}
                </tbody>
            </table>
        </div>
    );
};

export default FuelTable;