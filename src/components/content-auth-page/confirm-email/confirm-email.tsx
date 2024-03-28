import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerificationInput from 'react-verification-input';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Loader } from '@components/loader/loader';
import { PATHS } from '@constants/paths';
import { useAppSelector } from '@hooks/typed-react-redux-hooks';
import { userSelector } from '@redux/reducers/user-slice';
import { useConfirmEmailMutation } from '@services/auth';
import { Typography } from 'antd';

import './confirm-email.css';

const { Title, Text } = Typography;

export const ConfirmEmail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAppSelector(userSelector);
    const [confirm, { isLoading }] = useConfirmEmailMutation();
    const [borderStyle, setBorderStyle] = useState('character');
    const [valueInput, setValueInput] = useState('');

    const onComplete = (value: string) => {
        confirm({ email: user.email, code: value })
            .unwrap()
            .then(() => {
                navigate(PATHS.CHANGE_PASSWORD, { state: PATHS.CONFIRM_EMAIL });
            })
            .catch(() => {
                setBorderStyle('character-error'); 
                setValueInput('');
            });
    };

    useEffect(() => {
        if(location.state !== PATHS.AUTH) navigate(PATHS.AUTH);
    }, [location.state, navigate]);

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            <div className='confirm-email'>
                <ExclamationCircleFilled className='confirm-email__icon' />
                <Title level={3}>Введите код для восстановления аккауанта</Title>
                <Text disabled={true}>
                    Мы отправили вам на e-mail victorbyden@gmail.com шестизначный код. Введите его в
                    поле ниже.
                </Text>
                <VerificationInput
                    value={valueInput}
                    placeholder=''
                    inputProps={{ 'data-test-id': 'verification-input' }}
                    classNames={{
                        container: 'container',
                        character: `${borderStyle}`,
                        characterInactive: 'character__inactive',
                        characterSelected: 'character__selected',
                        characterFilled: 'character__filled',
                    }}
                    onChange={(value) => setValueInput(value)}
                    onComplete={onComplete}
                />
                <Text disabled={true}>Не пришло письмо? Проверьте папку Спам.</Text>
            </div>
        </React.Fragment>
    );
};
