type UrlAPI = string;

export const urlAPI: UrlAPI = 'https://marathon-api.clevertec.ru';
export const urlForImage = 'https://training-api.clevertec.ru';

type EndpointsAPI = {
    auth: {
        google: string,
        logIn: string,
        signUp: string,
        checkEmail: string,
        confirmEmail: string,
        changePassword: string,
    },
    feedback: string,
    training: string,
    catalogs: {
        training: string,
        tariff: string,
    }, 
    user: {
        me: string,
        user: string
    },
    upload: string,
    tariff: string,
}

export const endpointsAPI: EndpointsAPI = {
    auth: {
        google: '/auth/google',
        logIn: '/auth/login',
        signUp: '/auth/registration',
        checkEmail: '/auth/check-email',
        confirmEmail: '/auth/confirm-email',
        changePassword: '/auth/change-password',
    },
    feedback: '/feedback',
    training: '/training',
    catalogs: {
        training: '/catalogs/training-list',
        tariff: '/catalogs/tariff-list',
    },
    user: {
        me: '/user/me',
        user: '/user'
    },
    upload: '/upload-image',
    tariff: '/tariff'
}