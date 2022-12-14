import React, { useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { password } from '../../lib/api';
import ChangePasswordDialog from '../UI/ChangePasswordDialog';
import Loading from '../Layout/Loading';

const ChangePassword = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [changePasswordDialogIsVisible, setChangePasswordDialogIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const showChangePasswordDialogHandler = () => {
        setChangePasswordDialogIsVisible(true);
    };

    const cancel = () => {
        setChangePasswordDialogIsVisible(false);
        navigate('/profile');
    };

    const submitHandler = async (enteredCurrentPassword, enteredNewPassword) => {
        const newPassword = {
            username: authCtx.username,
            password: enteredCurrentPassword,
            newPassword: enteredNewPassword,
        };
        setIsLoading(true);
        const success = await password(newPassword);
        setIsLoading(false);
        success && setChangePasswordDialogIsVisible(false);
    };

    return (
        <Fragment>
            {isLoading && <Loading />}
            <div className='smFullWidth'>
                <button className='w3-button w3-indigo add-button-margin smFullWidth' onClick={showChangePasswordDialogHandler}>Zmeniť heslo</button>
            </div>
            {changePasswordDialogIsVisible && <ChangePasswordDialog onCancel={cancel} onSubmit={submitHandler} />}
        </Fragment>
    );
};
export default ChangePassword;