import React from 'react';
import ChangePassword from '../Auth/ChangePassword';
import DeleteUser from '../Auth/DeleteUser';

const Profile = () => {
    return (
        <div>
            <h1>Profil</h1>
            <ChangePassword  />
            <DeleteUser />
        </div>
    );
};

export default Profile;