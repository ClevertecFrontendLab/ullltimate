import React, { useEffect, useState } from 'react';
import {
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { ButtonsComment } from '@components/content-comments-page/buttons-comment/buttons-comment';
import { ModalCreateComment } from '@components/content-comments-page/modal-create-comment/modal-create-comment';
import { SettingDrawer } from '@components/content-settings-page/setting-drawer/setting-drawer';
import { TariffModal } from '@components/content-settings-page/tariff-modal/tariff-modal'
import { Header } from '@components/header/header';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { useResize } from '@hooks/use-resize';
import { saveJoinTrainings, savesendNotification, userFullSelector } from '@redux/reducers/user-full-slice';
import { useGetTariffListQuery } from '@services/catalogs';
import { useUpdateUserMutation } from '@services/user';
import { Button, Card, Col, Layout, List, Row, Switch, Tooltip } from 'antd';
import moment from 'moment';

import './settings-page.css';

const { Content } = Layout;

export const SettingsPage: React.FC = () => {
    const { data: tariffList } = useGetTariffListQuery();
    const [isModalReview, setIsModalReview] = useState(false);
    const showModalReview = (): void => setIsModalReview(true);
    const handleCancel = (): void => setIsModalReview(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const windowSize = useResize();
    const showDrawer = () => setOpenDrawer(true);
    const onCloseDrawer = () => setOpenDrawer(false);
    const [isModalResult, setIsModalResult] = useState(false);
    const {email, readyForJointTraining, sendNotification, tariff} = useAppSelector(userFullSelector);
    const [upgateUser] = useUpdateUserMutation();
    const dispatch = useAppDispatch();
    const [isDisabledTheme, setIsDisabledTheme] = useState(true);

    useEffect(() => {
        if(tariff) setIsDisabledTheme(false)
    },[tariff])

    const onChangeJointTraining = (checked: boolean) => {
        dispatch(saveJoinTrainings(checked));
        upgateUser({email, readyForJointTraining: checked})
            .unwrap()
            .then(() => {})
            .catch(() => {});
    };
    const onChangesendNotification = (checked: boolean) => {
        dispatch(savesendNotification(checked));
        upgateUser({email, sendNotification: checked})
            .unwrap()
            .then(() => {})
            .catch(() => {});
    };

    return (
        <React.Fragment>
            <Header />
            <Content style={{ padding: windowSize.windowSize<370 ? '24px 0px' : 24, background: 'var(--color-bg-grey)' }}>
                <Card className='settings' style={{ height: '100%' }}>
                    <h4 className='settings-title'>Мой тариф</h4>
                    <div className='site-card-wrapper'>
                        <Row gutter={16}>
                            <Col>
                                <Card
                                    className='settings-card'
                                    title='FREE tarif'
                                    extra={
                                        <Button type='link' onClick={showDrawer}>
                                            Подробнее
                                        </Button>
                                    }
                                    bordered={true}
                                >
                                    <img src='./free-tariff.jpg' className='settings-card__img' alt='free-tariff' />
                                    <Button type='text' className='setting-card__btn'>
                                        активен <CheckOutlined />
                                    </Button>
                                </Card>
                            </Col>
                            <Col>
                                <Card
                                    className='settings-card'
                                    data-test-id='pro-tariff-card'
                                    title='PRO tarif'
                                    extra={
                                        <Button type='link' onClick={showDrawer}>
                                            Подробнее
                                        </Button>
                                    }
                                    bordered={true}
                                >
                                    <img src={`./pro-tariff${tariff?'':'-disable'}.jpg`} className='settings-card__img' alt='free-tariff' />
                                    <Button
                                        type={`${tariff ? 'text' : 'primary'}`}
                                        className='setting-card__btn'
                                        data-test-id='activate-tariff-btn'
                                        onClick={showDrawer}
                                    >
                                        {tariff ? `активен до ${moment(tariff.expired).format('DD.MM')}` :'Активировать'}
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <List className='settings-list'>
                        <List.Item className='settings-item'>
                            <p className='settings-item__text'>
                                Открыт для совместных тренировок
                                <Tooltip
                                    placement='bottomLeft'
                                    title={
                                        <span>
                                            включеная функция позволит участвовать в совместных
                                            тренировках
                                        </span>
                                    }
                                >
                                    <ExclamationCircleOutlined data-test-id='tariff-trainings-icon' style={{marginLeft: 5, color: 'var(--color-disabled)'}}/>
                                </Tooltip>
                            </p>
                            <Switch
                                data-test-id='tariff-trainings'
                                checked={readyForJointTraining}
                                onChange={onChangeJointTraining}
                            />
                        </List.Item>
                        <List.Item className='settings-item'>
                            <p className='settings-item__text'>
                                Уведомления
                                <Tooltip
                                    placement='bottomLeft'
                                    title={
                                        <span>
                                            включеная функция позволит получать уведомления об
                                            активностях
                                        </span>
                                    }
                                >
                                    <ExclamationCircleOutlined data-test-id='tariff-notifications-icon' style={{marginLeft: 5, color: 'var(--color-disabled)'}}/>
                                </Tooltip>
                            </p>
                            <Switch
                                data-test-id='tariff-notifications'
                                checked={sendNotification}
                                onChange={onChangesendNotification}
                            />
                        </List.Item>
                        <List.Item className='settings-item'>
                            <p className='settings-item__text'>
                                Тёмная тема
                                <Tooltip
                                    placement='bottomLeft'
                                    title={<span>темная тема доступна для PRO tariff</span>}
                                >
                                    <ExclamationCircleOutlined data-test-id='tariff-theme-icon' style={{marginLeft: 5, color: 'var(--color-disabled)'}}/>
                                </Tooltip>
                            </p>
                            <Switch
                                disabled={isDisabledTheme}
                                data-test-id='tariff-theme'
                            />
                        </List.Item>
                    </List>
                    <ButtonsComment showModalReview={showModalReview} />
                    <ModalCreateComment
                        isModalReview={isModalReview}
                        handleCancel={handleCancel}
                        showModalReview={showModalReview}
                    />
                </Card>
                <SettingDrawer openDrawer={openDrawer} tariff={tariff} tariffList={tariffList} onCloseDrawer={onCloseDrawer} setIsModalResult={setIsModalResult}/>
                <TariffModal isModalResult={isModalResult} email={email}/>
            </Content>
        </React.Fragment>
    );
};
