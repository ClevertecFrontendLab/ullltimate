import { FieldValue,IRegExp,ValidationMessage } from '@tstypes/validation';
import { Rule, RuleObject } from 'antd/lib/form';

export const validateMessage: ValidationMessage = {
    require: 'Обязательное поле!',
    email: 'Example@gmail.com',
    password: 'Пароль не менее 8 символов, с заглавной буквой и цифрой',
    repeatPassword: 'Пароли не совпадают',
};

export const regEmail: IRegExp = /^[\w]{1}[\w-.]*@[\w-]+\.[a-z]{2,4}$/i;

export const regPassword: IRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;

export const rulesPassword = [
    {
        validator(_: Rule, value: string) {
            if (regPassword.test(value)) {
                return Promise.resolve();
            }
 
                return Promise.reject(new Error(validateMessage.password));
            
        },
    },
];

export const rulesRepeatPassword = [
    ({ getFieldValue }: FieldValue): RuleObject => ({
        validator(_: Rule, value: string): Promise<void> {
            if (getFieldValue('password') === value) {
                return Promise.resolve();
            }
            
                return Promise.reject(new Error(validateMessage.repeatPassword));
            
        },
    }),
];

export const rulesEmail: Rule[] = [
    {
        required: true,
        message: validateMessage.require,
    },
    {
        type: 'email',
        message: validateMessage.email,
    },
];
