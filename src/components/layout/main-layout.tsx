import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CustomBreadcrumb } from '@components/breadcrumb/custom-breadcrumb';
import { SiderBar } from '@components/sider-bar/sider-bar';
import { PATHS } from '@constants/paths';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { tokenSelector } from '@redux/reducers/token-slice';
import { saveEmail, saveFirstName, saveImage,saveJoinTrainings,saveLastName, savesendNotification,saveTariff } from '@redux/reducers/user-full-slice';
import { useLazyGetUserQuery } from '@services/user';
import { Layout } from 'antd';

export const MainLayout: React.FC = () => {
    const { token } = useAppSelector(tokenSelector);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [getUser, { data }] = useLazyGetUserQuery();

    useEffect(() => {
        if (token === '' && !localStorage.getItem('token')){ 
            navigate(PATHS.AUTH)
        } else {
            getUser();
        }
    }, [getUser, navigate, token]);

    useEffect(() => {
        if (data) {
            dispatch(saveEmail(data.email));
            dispatch(saveFirstName(data.firstName));
            dispatch(saveLastName(data.lastName));
            dispatch(saveImage(data.imgSrc));
            dispatch(saveJoinTrainings(data.readyForJointTraining));
            dispatch(savesendNotification(data.sendNotification));
            dispatch(saveTariff(data.tariff));
        }
    }, [data, dispatch]);


    return (
        <div className='main-wrapper wrapper'>
            <Layout>
                <SiderBar />
                <Layout className='site-layout'>
                    {(location.pathname === PATHS.CALENDAR ||
                        location.pathname === PATHS.MAIN ||
                        location.pathname === PATHS.FEEDBACKS) && <CustomBreadcrumb />}
                    <Outlet />
                </Layout>
            </Layout>
        </div>
    );
};
