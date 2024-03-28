import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonGoogle } from '@components/content-auth-page/buttons/button-google';
import { Loader } from '@components/loader/loader';
import { PATHS } from '@constants/paths';
import { regEmail, rulesEmail,rulesPassword } from '@constants/validation';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { saveToken } from '@redux/reducers/token-slice';
import { increment, userSelector } from '@redux/reducers/user-slice';
import { useCheckEmailMutation, useLoginMutation } from '@services/auth';
import { Button,Checkbox, Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';

import './logIn.css';

type ValuesLoginForm = {
    email: string,
    password: string,
    remember: boolean
}

export const LogIn: React.FC = () => {
    const [forgotDisabled, setForgotDisabled] = useState(true);
    const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
    const [checkEmail, { isLoading: isLoadingEmail }] = useCheckEmailMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(userSelector);

    const onFinish = (values: ValuesLoginForm) => {
        login({ email: values.email, password: values.password })
            .unwrap()
            .then((res) => {
                if(values.remember){
                    localStorage.setItem('token', res.accessToken)
                } else {
                    dispatch(saveToken(res.accessToken))
                };
                dispatch(saveToken(res.accessToken));
                dispatch(increment({ email: values.email, password: values.password }));
                navigate(PATHS.MAIN);
            })
            .catch(() => navigate(PATHS.RESULT.ERROR_LOGIN, { state: PATHS.AUTH }));
    };

    const check = useCallback(
        (email: string) => {
            checkEmail({ email })
                .unwrap()
                .then(() => {
                    navigate(PATHS.CONFIRM_EMAIL, { state: PATHS.AUTH });
                })
                .catch((error) => {
                    if (error.status === 404 && error.data.message === 'Email не найден') {
                        navigate(PATHS.RESULT.ERROR_EMAIL_NO_EXIST, { state: PATHS.AUTH });
                    } else {
                        dispatch(increment({ email, password: '' }));
                        navigate(PATHS.RESULT.ERROR_CHECK_EMAIL, { state: PATHS.AUTH });
                    }
                });
        },
        [checkEmail, dispatch, navigate],
    );

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate(PATHS.MAIN);
        }
        if (location.state === PATHS.RESULT.ERROR_CHECK_EMAIL) {
            check(user.email);
        }
    }, [check, location.state, navigate, user.email]);

    return (
        <React.Fragment>
            {(isLoadingLogin || isLoadingEmail) && <Loader />}
            <Form name='normal_login' className='login-form' onFinish={onFinish}>
                <Form.Item
                    name='email'
                    rules={[
                        rulesEmail,
                        {
                            validator: (_: Rule, value: string) => {
                                if (regEmail.test(value)) {
                                    dispatch(increment({ email: value, password: '' }));

                                    return Promise.resolve(setForgotDisabled(false));
                                }
 
                                    return Promise.reject(setForgotDisabled(true));
                            },
                        },
                    ].flat()}
                >
                    <Input addonBefore='e-mail' data-test-id='login-email' />
                </Form.Item>
                <Form.Item name='password' rules={rulesPassword}>
                    <Input.Password
                        type='password'
                        placeholder='Пароль'
                        data-test-id='login-password'
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name='remember' valuePropName='checked' noStyle={true}>
                        <Checkbox data-test-id='login-remember'>Запомнить меня</Checkbox>
                    </Form.Item>
                    <Button
                        type='link'
                        className='login-form-forgot'
                        data-test-id='login-forgot-button'
                        onClick={() => !forgotDisabled && check(user.email)}
                    >
                        Забыли пароль?
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        onSubmit={(e) => e.preventDefault()}
                        className='login-form-button'
                        data-test-id='login-submit-button'
                    >
                        Войти
                    </Button>
                </Form.Item>

                <ButtonGoogle />
            </Form>
        </React.Fragment>
    );
};
