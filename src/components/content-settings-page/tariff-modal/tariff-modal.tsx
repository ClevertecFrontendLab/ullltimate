import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
import { PATHS } from '@constants/paths';
import { useAppDispatch } from '@hooks/typed-react-redux-hooks';
import { saveToken } from '@redux/reducers/token-slice';
import { resetUser } from '@redux/reducers/user-full-slice';
import { increment } from '@redux/reducers/user-slice';
import { Modal, Result } from 'antd';

type TariffModalProps = {
    isModalResult: boolean;
    email: string;
};

export const TariffModal: React.FC<TariffModalProps> = ({ isModalResult, email }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const logOut = () => {
        localStorage.removeItem('token');
        dispatch(increment({ email: '', password: '' }));
        dispatch(saveToken(''));
        navigate(PATHS.AUTH);
        dispatch(resetUser());
    };

    return (
        <Modal
            open={isModalResult}
            footer={null}
            centered={true}
            closable={true}
            onCancel={logOut}
            data-test-id='tariff-modal-success'
            closeIcon={<CloseOutlined />}
            maskStyle={{ background: '#799cd480', backdropFilter: 'blur(5px)' }}
        >
            <div className='modal-tariff-result'>
                <Result
                    status='success'
                    title='Чек для оплаты у вас на почте'
                    subTitle={
                        <span>
                            Мы отправили инструкцию для оплаты вам на e-mail
                            <span style={{ fontWeight: 'var(--font-weight-700)' }}> {email}</span>.
                            После подтверждения оплаты войдите в приложение заново.
                            <p style={{ margin: 'var(--unit-24)' }}>
                                Не пришло письмо? Проверьте папку Спам.
                            </p>
                        </span>
                    }
                />
            </div>
        </Modal>
    );
};
