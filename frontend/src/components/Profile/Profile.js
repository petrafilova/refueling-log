import React, { useState } from 'react';
import ChangePassword from '../Auth/ChangePassword';
import DeleteUser from '../Auth/DeleteUser';

const Profile = () => {

    const [radio, setRadio] = useState(false);

    const changeHandler = (e) => {
        setRadio(e.target.value === 'true');
    };

    return (
        <div>
            <h1>Profil</h1>

            SELECTED: {radio.toString()}<br/>

            <input id="radioTrue" type="radio" name="test" value="true" checked={radio === true} onChange={changeHandler}></input> <label htmlFor='radioTrue'>Áno</label>
            <input id="radioFalse" type="radio" name="test" value="false" checked={radio === false} onChange={changeHandler}></input> <label htmlFor='radioFalse'>Nie</label>

            <br />

            <ChangePassword  />
            <DeleteUser />
        </div>
    );

};

export default Profile;