import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AndroidFilled, AppleFilled } from '@ant-design/icons';
import { Loader } from '@components/loader/loader';
import { PATHS } from '@constants/paths';
import { useLazyGetFeedbacksQuery } from '@services/feedbacks';
import { Button, Card,Col, Row } from 'antd';

import './footer.css';

const { Meta } = Card;

export const Footer: React.FC = () => {
    const navigate = useNavigate();
    const [getFeedbacks, { isLoading }] = useLazyGetFeedbacksQuery();

    const showReviews = async () => {
        await getFeedbacks()
            .unwrap()
            .then(() => navigate(PATHS.FEEDBACKS))
            .catch((error) => {
                navigate(PATHS.FEEDBACKS);
                if (error.status === 403) {
                    localStorage.removeItem('token');
                    navigate(PATHS.AUTH);
                }
            });
    };

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            <footer className='footer'>
                <Row justify='space-between' wrap={true} style={{ flexWrap: 'wrap-reverse' }}>
                    <Col flex='none'>
                        <Button type='link' onClick={showReviews} data-test-id='see-reviews'>
                            Смотреть отзывы
                        </Button>
                    </Col>
                    <Col flex='none' className='footer-card'>
                        <Card
                            bordered={false}
                            actions={[
                                <Button type='text'>
                                    <AndroidFilled />
                                    Android OS
                                </Button>,
                                <Button type='text'>
                                    <AppleFilled />
                                    Apple iOS
                                </Button>,
                            ]}
                        >
                            <Meta
                                title={<a>Скачать на телефон </a>}
                                description='Доступно в PRO-тарифе'
                            />
                        </Card>
                    </Col>
                </Row>
            </footer>
        </React.Fragment>
    );
};
