import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '@constants/paths';
import { Tabs } from 'antd';

import { LogIn } from '../login/login';
import { SignUp } from '../signup/signup';

import './tabs.css';

type AuthItemsTab = {
    label: string,
    key: string,
    children: React.ReactNode,
}

export const CustomTabs: React.FC = () => {
    const [key, setKey] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();
    const itemsTab: AuthItemsTab[] = [
        {
            label: 'Вход',
            key: 'login',
            children: <LogIn />,
        },
        {
            label: 'Регистрация',
            key: 'signup',
            children: <SignUp />,
        },
    ];

    const onChangeHandler = (k: string) => {
        setKey(k);
        if(key === 'signup') {
            navigate(PATHS.AUTH)
        } else {
            navigate(PATHS.REGISTRATION)
        };
    }

    useEffect(() => {
        const keyTab = location.pathname === PATHS.REGISTRATION ? 'signup' : 'login'

        setKey(keyTab);
    }, [location.pathname]);

    return (
        <React.Fragment>
            <img src='/logo.svg' className='logo' alt='logo' />
            <Tabs
                activeKey={key}
                centered={true}
                tabBarGutter={0}
                items={itemsTab}
                onChange={onChangeHandler}
            />
        </React.Fragment>
    );
};
