import React from 'react';
import Lottie from 'lottie-react';

import animationData from './lottie.json';

import './loader.css';

export const Loader: React.FC = () => (
    <div className='loader'>
        <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: '150px' }}
            data-test-id='loader'
        />
    </div>
);
