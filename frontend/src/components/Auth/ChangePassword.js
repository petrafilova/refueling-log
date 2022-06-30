import React, { useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { password } from '../../lib/api';
import ChangePasswordDialog from '../UI/ChangePasswordDialog';

const ChangePassword = () => {
    const [changePasswordDialogIsVisible, setChangePasswordDialogIsVisible] = useState(false);

    const showChangePasswordDialogHandler = () => {
        setChangePasswordDialogIsVisible(true);
    };

    const authCtx = useContext(AuthContext);

    const navigate = useNavigate();

    const cancel = () => {
        setChangePasswordDialogIsVisible(false);
        navigate('/profile');
    };

    const submitHandler = async (enteredCurrentPassword, enteredNewPassword) => {
        console.log(enteredCurrentPassword, enteredNewPassword);

        const newPassword = {
            username: authCtx.username,
            password: enteredCurrentPassword,
            newPassword: enteredNewPassword,
        };

        console.log(newPassword);
        console.log(authCtx.token);
        const success = await password(newPassword, authCtx.token);
        success && setChangePasswordDialogIsVisible(false);
    };

    return (
        <Fragment>
            <button className="w3-button w3-indigo" onClick={showChangePasswordDialogHandler}>Zmeniť heslo</button>
            {changePasswordDialogIsVisible && <ChangePasswordDialog onCancel={cancel} onSubmit={submitHandler} />}
        </Fragment>
    );
};
export default ChangePassword;