import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '@constants/paths';
import { Button,Typography } from 'antd';

import './result.css';

const { Title, Text } = Typography;

type PropsResult = {
    icon: React.ReactNode,
    title: string,
    text: string,
    btnText: string,
    btnPath: string,
    dataAtribute: string,
}

export const Result: React.FC<PropsResult> = ({
    icon,
    title,
    text,
    btnText,
    btnPath,
    dataAtribute,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(!location.state) navigate(PATHS.AUTH);
    }, [location.state, navigate]);

    return (
        <div className='result'>
            {icon}
            <Title level={3} className='result-title'>
                {title}
            </Title>
            <Text disabled={true} className='result-text'>
                {text}
            </Text>
            <Button
                type='primary'
                className='result-button'
                data-test-id={dataAtribute}
                onClick={() => {
                    navigate('.', { replace: true });
                    navigate(btnPath, { state: location.pathname });
                }}
            >
                {btnText}
            </Button>
        </div>
    );
};
