import React from 'react';

const ModalDialog = (props) => {
    return (
        <div className='w3-modal w3-show'>
            <div className='w3-modal-content dialog'>
                <header className='w3-container w3-light-grey'>
                    <h2>Potvrdenie</h2>
                </header>
                <div className='w3-container'>
                    <p>{props.text}</p>
                </div>
                <footer className='w3-container w3-light-grey'>
                    <p>
                        <button className='w3-button w3-indigo' onClick={props.onCancel}>Zrušiť</button>
                        <button className='w3-button w3-indigo w3-right' onClick={props.onSubmit}>Potvrdiť</button>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ModalDialog;