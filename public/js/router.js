import { Auth } from './auth.js';

export const Router = {
    async init() {
        // 检查登录状态
        const isAuthenticated = await Auth.checkAuth();
        
        // 路由守卫
        if (!isAuthenticated && !location.pathname.includes('/login')) {
            return redirectToLogin();
        }
        
        // 初始化页面内容
        initPageContent();
    },

    navigateTo(path) {
        history.pushState(null, null, path);
        this.init();
    }
};

function redirectToLogin() {
    if (location.pathname !== '/login') {
        sessionStorage.setItem('redirectUrl', location.pathname);
        location.href = '/login';
    }
}

function initPageContent() {
    // 根据当前路由初始化页面
    const path = location.pathname;
    
    if (path === '/') {
        // 初始化首页内容
    } else if (path === '/login') {
        // 初始化登录页内容
    }
}