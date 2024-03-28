import React, { useEffect, useState } from 'react';
import { ContentCard } from '@components/content-main-page/card';
import { Footer } from '@components/footer/footer';
import { Header } from '@components/header/header';
import { contentCards } from '@constants/main-content-cards';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { trainingAPI } from '@services/trainings';
import { CardInfo } from '@tstypes/types';
import { Button, Card, Layout, Modal, Result, Row } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import './main-page.css';

const { Content } = Layout;

export const MainPage: React.FC = () => {
    const [isModalError, setIsModalError] = useState(false);
    const handleCancelError = (): void => setIsModalError(false);
    const isError = useAppSelector((state) => trainingAPI.endpoints.getTraining.select()(state).error)

    useEffect(() => {
        if(isError) setIsModalError(true);
    },[isError])
    
    return (
        <React.Fragment>
            <Header />
            <Content style={{ margin: 24 }}>
                <Card bordered={false} className='content-discription'>
                    <p className='content-text'>
                        С CleverFit ты сможешь: <br />
                        — планировать свои тренировки на календаре, выбирая тип и уровень нагрузки;
                        <br />
                        — отслеживать свои достижения в разделе статистики, сравнивая свои
                        результаты с нормами и рекордами;
                        <br />
                        — создавать свой профиль, где ты можешь загружать свои фото, видео и отзывы
                        о тренировках;
                        <br />— выполнять расписанные тренировки для разных частей тела, следуя
                        подробным инструкциям и советам профессиональных тренеров.
                    </p>
                </Card>
                <Card bordered={false} className='content-discription'>
                    <h4 className='content-subtitle'>
                        CleverFit — это не просто приложение, а твой личный помощник в мире фитнеса.
                        Не откладывай на завтра — начни тренироваться уже сегодня!
                    </h4>
                </Card>
                <div className='cards-wrapper'>
                    <Row gutter={16} className='wrap'>
                        {contentCards.map(
                            (e: CardInfo): React.ReactNode => (
                                <ContentCard
                                    key={uuidv4()}
                                    title={e.title}
                                    btnText={e.btnText}
                                    btnIcon={e.btnIcon}
                                    path={e.path}
                                    dataTest={e.dataTest}
                                />
                            ),
                        )}
                    </Row>
                </div>
            </Content>
            <Footer />
            <Modal
                open={isModalError}
                footer={null}
                centered={true}
                closable={false}
                data-test-id='modal-no-review'
                maskStyle={{ background: '#799cd480', backdropFilter: 'blur(5px)' }}
            >
                <div className='comments-modal'>
                    <Result
                        status='500'
                        title='Что-то пошло не так'
                        subTitle='Произошла ошибка, попробуйте ещё раз.'
                        extra={
                            <Button type='primary' onClick={handleCancelError}>
                                Назад
                            </Button>
                        }
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
};
