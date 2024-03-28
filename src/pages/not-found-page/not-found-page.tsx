import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@constants/paths';
import { Button, Card, Layout, Result } from 'antd';

import './not-found-page.css';

const { Content } = Layout;

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
    <Content style={{ margin: 24 }}>
        <Card className='not-found-card'>
            <Result
                status='404'
                title='Такой страницы нет'
                subTitle='Извините, страница не найдена, возможно, она была удалена или перемещена.'
                extra={<Button type='primary' onClick={() => navigate(PATHS.MAIN)}>На главную</Button>}
            />
        </Card>
    </Content>
);}
