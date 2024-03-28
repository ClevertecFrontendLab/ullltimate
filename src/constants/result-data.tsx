import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons';
import { ResultData } from '@tstypes/result-data';

import { PATHS } from './paths';

export const resultData: ResultData = {
    error_login: {
        icon: <WarningFilled className='result-icon icon-warning' />,
        title: 'Вход не выполнен',
        text: 'Что-то пошло не так. Попробуйте еще раз',
        btnText: 'Повторить',
        btnPath: PATHS.AUTH,
        dataAtribute: 'login-retry-button',
    },
    success_signup: {
        icon: <CheckCircleFilled className='result-icon icon-success' />,
        title: 'Регистрация успешна',
        text: 'Регистрация прошла успешно. Зайдите в приложение, используя свои e-mail и пароль.',
        btnText: 'Войти',
        btnPath: PATHS.AUTH,
        dataAtribute: 'registration-enter-button',
    },
    error_user_exist: {
        icon: <CloseCircleFilled className='result-icon icon-error' />,
        title: 'Данные не сохранились',
        text: 'Такой e-mail уже записан в системе. Попробуйте зарегистрироваться по другому e-mail.',
        btnText: 'Назад к регистрации',
        btnPath: PATHS.REGISTRATION,
        dataAtribute: 'registration-back-button',
    },
    error: {
        icon: <CloseCircleFilled className='result-icon icon-error' />,
        title: 'Данные не сохранились',
        text: 'Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз.',
        btnText: 'Повторить',
        btnPath: PATHS.REGISTRATION,
        dataAtribute: 'registration-retry-button',
    },
    error_change_password: {
        icon: <CloseCircleFilled className='result-icon icon-error' />,
        title: 'Данные не сохранились',
        text: 'Что-то пошло не так попробуйте ещё раз.',
        btnText: 'Повторить',
        btnPath: PATHS.CHANGE_PASSWORD,
        dataAtribute: 'change-retry-button',
    },
    success_change_password: {
        icon: <CheckCircleFilled className='result-icon icon-success' />,
        title: 'Пароль успешно изменен',
        text: 'Теперь можно войти в аккаунт, используя свой логин и новый пароль',
        btnText: 'Вход',
        btnPath: PATHS.AUTH,
        dataAtribute: 'change-entry-button',
    },
    error_email_no_exist: {
        icon: <CloseCircleFilled className='result-icon icon-error' />,
        title: 'Такой e-mail не зарегистрирован',
        text: 'Мы не нашли в базе вашего e-mail. Попробуйте войти с другим e-mail.',
        btnText: 'Попробовать снова',
        btnPath: PATHS.AUTH,
        dataAtribute: 'check-retry-button',
    },
    error_check_email: {
        icon: <img src='/error.svg' alt='error'/>,
        title: 'Что-то пошло не так',
        text: 'Произошла ошибка, попробуйте отправить форму ещё раз.',
        btnText: 'Назад',
        btnPath: PATHS.AUTH,
        dataAtribute: 'check-back-button',
    },
};
