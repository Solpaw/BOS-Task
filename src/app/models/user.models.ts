export interface IUserModel {
    avatar: string,
    birthDate: string,
    email: string,
    lastName: string,
    firstName: string,
    hasContract: boolean,
    id: string,
}

export enum HasContractFilterEnum {
    All = '1',
    Contract = '2',
    NoContract = '3',
}
