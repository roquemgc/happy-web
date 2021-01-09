import api from './api'

export default class AuthenticationService {
    async doLogin (email: string, userPassowrd: string) {
        try {
            const {data: jwt} = await api.post(`auth/login`, {email: email, password: userPassowrd});
            return jwt;
        } catch (err) {
           throw err;
        }
    }
}
