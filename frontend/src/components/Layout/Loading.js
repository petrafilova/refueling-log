import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = () => {
    return (
        <div className='loadingBackground w3-display-container'>
            <div className='w3-display-middle'>
                {/* <div className='rotate'> */}
                <FontAwesomeIcon icon={faSpinner} className='w3-spin loadingSpinner' />
                {/* </div> */}
            </div>
        </div>
    );
};

export default Loading;