import React, { useEffect, useState } from 'react';
import { Button, Card, Layout, Modal, Result, Row } from 'antd';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { ContentCard } from '@components/content-main-page/card';
import { contentCards } from '@constants/main-content-cards';
import { CardInfo } from '@tstypes/types';
import { trainingAPI } from '@services/trainings';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';

import './main-page.css';

const { Content } = Layout;

export const MainPage: React.FC = () => {
    const handleCancelError = (): void => setIsModalError(false);
    const [isModalError, setIsModalError] = useState(false);
    const isError = useAppSelector((state) => trainingAPI.endpoints.getTraining.select()(state).error)

    useEffect(() => {
        isError && setIsModalError(true)
    },[isError])
    
    return (
        <>
            
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
                            (e: CardInfo, i: number): React.ReactNode => (
                                <ContentCard
                                    key={i}
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
                centered
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
        </>
    );
};
