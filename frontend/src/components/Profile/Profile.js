import React, { Fragment } from 'react';
import ChangePassword from '../Auth/ChangePassword';
import DeleteUser from '../Auth/DeleteUser';

const Profile = () => {
    return (
        <Fragment>
            <h1>Profil</h1>
            <ChangePassword  />
            <DeleteUser />
        </Fragment>
    );
};

export default Profile;