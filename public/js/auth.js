export const Auth = {
    getToken() {
        return localStorage.getItem('authToken');
    },

    setToken(token, remember = false) {
        localStorage.setItem('authToken', token);
        if (remember) {
            localStorage.setItem('rememberedToken', token);
        } else {
            localStorage.removeItem('rememberedToken');
        }
    },

    clear() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberedToken');
    },

    async checkAuth() {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            const valid = await ApiService.validateToken(token);
            return valid ? token : false;
        } catch {
            this.clear();
            return false;
        }
    }
};