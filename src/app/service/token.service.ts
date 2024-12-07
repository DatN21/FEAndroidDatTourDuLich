import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private jwtHelperService = new JwtHelperService();

    constructor() {}

    getToken(): string {
        return localStorage.getItem(this.TOKEN_KEY) ?? '';
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }
}
