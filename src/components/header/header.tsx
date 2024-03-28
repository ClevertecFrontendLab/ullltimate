import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import { PATHS } from '@constants/paths';
import { Button, Typography } from 'antd';

import './header.css';

const { Title } = Typography;

export const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <header
            className='header'
            style={{ paddingTop: location.pathname === PATHS.PROFILE ? 'var(--unit-16)' : '' }}
        >
            <div className='header-wrapper'>
                <Title level={location.pathname === PATHS.PROFILE ? 4 : 1} className='header-title'>
                    {location.pathname === PATHS.MAIN && (
                        <span>
                            Приветствуем тебя в CleverFit — приложении,
                            <br /> которое поможет тебе добиться своей мечты!
                        </span>
                    )}
                    {location.pathname === PATHS.PROFILE && <span>Профиль</span>}
                    {location.pathname === PATHS.SETTINGS && (
                        <Button type='text' data-test-id='settings-back' style={{background: 'transparent'}} onClick={() => navigate(location.state)}>
                            <ArrowLeftOutlined /> Настройки
                        </Button>
                    )}
                </Title>
                {location.pathname !== PATHS.SETTINGS && (
                    <Button
                        type='text'
                        className='header-btn'
                        data-test-id='header-settings'
                        onClick={() => navigate(PATHS.SETTINGS, {state: location.pathname})}
                    >
                        <SettingOutlined className='header-btn__icon' />
                        <span className='header-btn__text'>Настройки</span>
                    </Button>
                )}
            </div>
        </header>
    );
};
