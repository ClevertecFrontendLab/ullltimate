export type IRegExp = RegExp;

export interface IValidationMessage {
    require: string,
    email: string,
    password: string,
    repeatPassword: string
}