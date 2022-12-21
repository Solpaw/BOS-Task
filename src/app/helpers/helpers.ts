import { IUserModel } from './../models/user.models';

export const filterFirstAndLastName = (ele: IUserModel, term: string): boolean => {
    return ele.firstName.toLowerCase().includes(term.toLowerCase()) || ele.lastName.toLowerCase().includes(term.toLowerCase());
}
