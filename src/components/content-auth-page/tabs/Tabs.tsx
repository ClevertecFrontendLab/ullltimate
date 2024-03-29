import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { LogIn } from '../login/LogIn';
import { SignUp } from '../signup/SignUp';
import { PATHS } from '@constants/paths';

import './tabs.css';

type AuthItemsTab = {
    label: string,
    key: string,
    children: React.ReactNode,
}

export const CustomTabs: React.FC = () => {
    const [key, setKey] = useState('1');
    const navigate = useNavigate();
    const location = useLocation();
    const itemsTab: AuthItemsTab[] = [
        {
            label: `Вход`,
            key: '1',
            children: <LogIn />,
        },
        {
            label: `Регистрация`,
            key: '2',
            children: <SignUp />,
        },
    ];

    useEffect(() => {
        location.pathname === PATHS.REGISTRATION ? setKey('2') : setKey('1');
    }, [location.pathname]);

    return (
        <>
            <img src='/logo.svg' className='logo' alt='logo' />
            <Tabs
                activeKey={key}
                centered
                tabBarGutter={0}
                items={itemsTab}
                onChange={(k: string) => {
                    setKey(k);
                    key === '2' ? navigate(PATHS.AUTH) : navigate(PATHS.REGISTRATION);
                }}
            />
        </>
    );
};
