import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import ModalDialog from '../UI/ModalDialog';
import PasswordDialog from '../UI/PasswordDialog';

const DeleteUser = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
    const [modalDialogIsVisible, setModalDialogIsVisible] = useState(false);
    const [passwordDialogIsVisible, setPasswordDialogIsVisible] = useState(false);

    const cancel = () => {
        setPasswordDialogIsVisible(false);
        setModalDialogIsVisible(false);
        navigate('/profile');
    };

    const deleteAccountHandler = async (password) => {
        const userInfo = { username: authCtx.username, password: password };
        const success = await deleteUserAccount(userInfo, authCtx.token);
        success && authCtx.logout();
    };

    const showModalDialogHandler = () => {
        setModalDialogIsVisible(true);
    };

    const showPasswordDialogHandler = () => {
        setModalDialogIsVisible(false);
        setPasswordDialogIsVisible(true);
    };

    return (
        <Fragment>
            {modalDialogIsVisible && <ModalDialog onCancel={cancel} onSubmit={showPasswordDialogHandler} text={'Naozaj chcete zmazať účet?'} />}
            {passwordDialogIsVisible && <PasswordDialog onCancel={cancel} onSubmit={deleteAccountHandler} />}
            <div className='smFullWidth'>
                <button className='w3-button w3-indigo add-button-margin smFullWidth' onClick={showModalDialogHandler}>Zmazať účet</button>
            </div>
        </Fragment>
    );
};

export default DeleteUser;