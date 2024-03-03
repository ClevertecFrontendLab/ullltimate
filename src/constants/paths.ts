type Paths = {
    INITIAL: string,
    MAIN: string,
    AUTH: string,
    REGISTRATION: string,
    CONFIRM_EMAIL: string,
    CHANGE_PASSWORD: string,
    RESULT: {
        ERROR_LOGIN: string,
        ERROR_USER_EXIST: string,
        ERROR: string,
        SUCCESS: string,
        ERROR_EMAIL_NO_EXIST: string,
        ERROR_CHECK_EMAIL: string,
        ERROR_CHANGE_PASSWORD: string,
        SUCCESS_CHANGE_PASSWORD: string,
    },
    FEEDBACKS: string,
}

export const PATHS: Paths = {
    INITIAL: '/',
    MAIN: '/main',
    AUTH: '/auth',
    REGISTRATION: '/auth/registration',
    CONFIRM_EMAIL: '/auth/confirm-email',
    CHANGE_PASSWORD: '/auth/change-password',
    RESULT: {
        ERROR_LOGIN: '/result/error-login',
        ERROR_USER_EXIST: '/result/error-user-exist',
        ERROR: '/result/error',
        SUCCESS: '/result/success',
        ERROR_EMAIL_NO_EXIST: '/result/error-check-email-no-exist',
        ERROR_CHECK_EMAIL: '/result/error-check-email',
        ERROR_CHANGE_PASSWORD: '/result/error-change-password',
        SUCCESS_CHANGE_PASSWORD: '/result/success-change-password',
    },
    FEEDBACKS: '/feedbacks',
};
