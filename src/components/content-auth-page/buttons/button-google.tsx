import React from 'react';
import { GooglePlusOutlined } from '@ant-design/icons';
import { endpointsAPI, urlAPI } from '@constants/api';
import { Button, Form, Grid } from 'antd';

const { useBreakpoint } = Grid;

export const ButtonGoogle: React.FC = () => {
    const { xs } = useBreakpoint();

    const loginWithGoogle = () => {
        window.location.href = `${urlAPI}${endpointsAPI.auth.google}`;
    };
    
    return (
        <Form.Item>
            <Button type='text' className='login-form-button' onClick={loginWithGoogle}>
                {!xs && <GooglePlusOutlined />} Войти через Google
            </Button>
        </Form.Item>
    );
};
