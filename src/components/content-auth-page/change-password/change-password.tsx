import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '@components/loader/loader';
import { PATHS } from '@constants/paths';
import { rulesPassword, rulesRepeatPassword,validateMessage } from '@constants/validation';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { increment, userSelector } from '@redux/reducers/user-slice';
import { useChangePassordMutation } from '@services/auth';
import { RequestChangePass } from '@tstypes/api';
import { Button, Form, Input, Typography } from 'antd';

import './change-password.css';

const { Title } = Typography;

export const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppSelector(userSelector);
    const dispatch = useAppDispatch();
    const [change, { isLoading }] = useChangePassordMutation();

    const onFinish = useCallback(
        (values: RequestChangePass) => {
            dispatch(increment({ email: user.email, password: values.password }));
            change(values)
                .unwrap()
                .then(() =>
                    navigate(PATHS.RESULT.SUCCESS_CHANGE_PASSWORD, {
                        state: PATHS.CHANGE_PASSWORD,
                    }),
                )
                .catch(() =>
                    navigate(PATHS.RESULT.ERROR_CHANGE_PASSWORD, { state: PATHS.CHANGE_PASSWORD }),
                );
        },
        [change, dispatch, navigate, user.email],
    );

    useEffect(() => {
        if (location.state === PATHS.RESULT.ERROR_CHANGE_PASSWORD) {
            onFinish({ password: user.password, confirmPassword: user.password });
        } else if (
            location.state !== PATHS.CONFIRM_EMAIL &&
            location.state !== PATHS.RESULT.ERROR_CHANGE_PASSWORD
        ) {
            navigate(PATHS.AUTH);
        }
    }, [location.state, navigate, onFinish, user.password]);

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            <Form
                name='normal_registration'
                className='change-password-form'
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Title level={3} className='change-password__title'>
                    Восстановление аккауанта
                </Title>
                <Form.Item name='password' help={validateMessage.password} rules={rulesPassword}>
                    <Input.Password
                        type='password'
                        placeholder='Пароль'
                        data-test-id='change-password'
                    />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={rulesRepeatPassword}
                >
                    <Input.Password
                        type='password'
                        placeholder='Повторите пароль'
                        data-test-id='change-confirm-password'
                    />
                </Form.Item>

                <Form.Item shouldUpdate={true}>
                    {() => (
                        <Button
                            type='primary'
                            data-test-id='change-submit-button'
                            htmlType='submit'
                            className='login-form-button'
                        >
                            Войти
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};
