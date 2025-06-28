// script.js

// 检查登录状态
async function checkLoginStatus() {
    let token = localStorage.getItem('authToken');
    const userNav = document.getElementById('userNav');
    const loginNavBtn = document.getElementById('loginNavBtn');
    const mobileUserNav = document.getElementById('mobileUserNav');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    
    // 验证token有效性（如果有）
    if (token) {
        const isValid = await validateToken(token);
        if (!isValid) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('rememberedToken');
            token = null;
        }
    }
    
    if (token) {
        // 已登录状态
        userNav.classList.remove('hidden');
        loginNavBtn.classList.add('hidden');
        mobileUserNav.classList.remove('hidden');
        mobileLoginBtn.classList.add('hidden');
        
        // 加载用户数据
        await loadUserData(token);
        return true;
    } else {
        // 未登录状态
        userNav.classList.add('hidden');
        loginNavBtn.classList.remove('hidden');
        mobileUserNav.classList.add('hidden');
        mobileLoginBtn.classList.remove('hidden');
        return false;
    }
}

// 验证token有效性
async function validateToken(token) {
    try {
        const response = await fetch('http://47.98.223.44:11451/api/validate', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('验证token失败:', error);
        return false;
    }
}

// 加载用户数据
async function loadUserData(token) {
    try {
        const response = await fetch('http://47.98.223.44:11451/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            updateUserUI(userData);
            return true;
        }
        return false;
    } catch (error) {
        console.error('获取用户数据失败:', error);
        return false;
    }
}

// 更新用户界面
function updateUserUI(userData) {
    const userAvatar = document.querySelector('.user-avatar');
    if (userData.username) {
        userAvatar.textContent = userData.username.charAt(0).toUpperCase();
    }
    console.log('用户数据加载完成:', userData);
}

// 退出登录
function logout() {
    localStorage.removeItem('authToken');
    checkLoginStatus();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

// 设置用户菜单
function setupUserMenu() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            const isLoggedIn = await checkLoginStatus();
            if (isLoggedIn) {
                userDropdown.classList.toggle('show');
            } else {
                window.location.href = 'DL.html';
            }
        });
    }
}

// 设置需要登录的菜单项
function setupProtectedMenuItems() {
    // 桌面端菜单项
    const desktopItems = document.querySelectorAll(`
        .group a:not(#loginNavBtn),
        .user-dropdown a:not(#logoutBtn)
    `);
    
    // 移动端菜单项
    const mobileItems = document.querySelectorAll(`
        .mobile-menu a:not(#mobileLoginBtn):not(#mobileLogoutBtn)
    `);
    
    const allItems = [...desktopItems, ...mobileItems];
    
    allItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            // 排除首页链接
            if (item.getAttribute('href') === 'SY.html') return;
            
            const isLoggedIn = await checkLoginStatus();
            if (!isLoggedIn) {
                e.preventDefault();
                e.stopImmediatePropagation();
                window.location.href = 'DL.html';
            }
        });
    });
}

// 设置退出按钮
function setupLogoutButtons() {
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// 设置文档点击处理程序
function setupDocumentClickHandler() {
    document.addEventListener('click', (e) => {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && !e.target.closest('#userMenuButton') && !e.target.closest('.user-dropdown')) {
            userDropdown.classList.remove('show');
        }
    });
}

// 设置移动端菜单
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// 设置移动端子菜单
function setupMobileSubmenus() {
    const submenuButtons = document.querySelectorAll('.mobile-submenu-button');
    
    submenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const submenu = button.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('hidden');
                const icon = button.querySelector('svg');
                if (icon) {
                    icon.classList.toggle('transform');
                    icon.classList.toggle('rotate-180');
                }
            }
        });
    });
}

// 设置涟漪效果
function setupRippleEffects() {
    document.querySelectorAll('.ripple').forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 设置视差效果
function setupParallaxEffect() {
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        });
    }
}

// 初始化函数
function init() {
    setupUserMenu();
    setupProtectedMenuItems();  // 替换原来的setupDropdownItems
    setupLogoutButtons();
    setupDocumentClickHandler();
    setupMobileMenu();
    setupMobileSubmenus();
    setupRippleEffects();
    setupParallaxEffect();
    checkLoginStatus();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供其他页面使用
export { checkLoginStatus, logout };