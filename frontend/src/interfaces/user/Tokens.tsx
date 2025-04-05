export interface Tokens{
    access: string;
    refresh: string;
};

import { User } from './User';
export interface LoginResponse extends Tokens{
    user: User;
};