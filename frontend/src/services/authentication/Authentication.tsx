import { Registration } from '../../interfaces/user/Registration';
import { Tokens } from '../../interfaces/user/Tokens';
import { User } from '../../interfaces/user/User';

const API_URL = process

class Authentication{
    private setTokens(tokens: Tokens): void{
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh)
    }

    getAccessToken(): string | null{
        return localStorage.getItem('access');
    }

    getRefreshToken(): string | null{
        return localStorage.getItem('refresh');
    }

    clearTokens(): void{
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }

    setUser(user: User): void{
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): User | null {
        const userStr = localStorage.getItem('user');

        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }
};