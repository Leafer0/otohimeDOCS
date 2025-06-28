// login.js
const TEST_MODE = false; // 设为false关闭测试模式
const TEST_TOKEN = "test_token_123"; 
// 显示获取token的提示
function setupTokenHelpTooltip() {
    const helpLink = document.getElementById('howToGetToken');
    if (!helpLink) {
        console.error('未找到"如何获取token"链接元素');
        return;
    }

    // 创建工具提示容器
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'relative inline-block';
    
    // 创建工具提示元素
    const tooltip = document.createElement('div');
    tooltip.id = 'tokenHelpTooltip';
    tooltip.className = 'hidden absolute z-50 w-64 p-3 mt-2 text-sm text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.innerHTML = `
        <p class="text-center">请加入QQ群:832968054</p>
        <p class="text-center font-bold mt-1">向bot发送指令获取Token</p>
        <div class="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-200"></div>
    `;

    // 包裹链接并插入提示
    helpLink.parentNode.insertBefore(tooltipContainer, helpLink);
    tooltipContainer.appendChild(helpLink);
    tooltipContainer.appendChild(tooltip);

    // 显示/隐藏工具提示
    helpLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isHidden = tooltip.classList.contains('hidden');
        // 先隐藏所有可能打开的提示
        document.querySelectorAll('.tooltip').forEach(t => t.classList.add('hidden'));
        // 切换当前提示
        tooltip.classList.toggle('hidden', !isHidden);
        
        // 点击外部区域关闭工具提示
        if (!isHidden) {
            const closeTooltip = function(e) {
               if (!tooltip.contains(e.target)) {
                    tooltip.classList.add('hidden');
                    document.removeEventListener('click', closeTooltip);
                }
            };
            // 稍后添加事件监听，避免立即触发
            setTimeout(() => {
                document.addEventListener('click', closeTooltip);
            }, 10);
        }
    });
}

// 切换令牌可见性
function setupTokenVisibilityToggle() {
    const toggleBtn = document.getElementById('toggleTokenVisibility');
    if (!toggleBtn) return;

    const tokenInput = document.getElementById('token');
    const eyeIcon = document.getElementById('eyeIcon');
    
    toggleBtn.addEventListener('click', () => {
        const isPassword = tokenInput.type === 'password';
        tokenInput.type = isPassword ? 'text' : 'password';
        
        // 切换图标
        eyeIcon.innerHTML = isPassword ? `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ` : `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
    });
}

// 显示响应消息
function showResponse(data, title = '登录结果') {
    const modal = document.getElementById('responseModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTitle');
    const responseContent = document.getElementById('responseContent');
    
    modalTitle.textContent = title;
    responseContent.textContent = JSON.stringify(data, null, 2);
    modal.classList.remove('hidden');
}

// 关闭弹窗
function setupModalClose() {
    function closeModal() {
        const modal = document.getElementById('responseModal');
        if (modal) modal.classList.add('hidden');
    }
    
    const closeBtn = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 复制响应结果
function setupResponseCopy() {
    const copyBtn = document.getElementById('copyResponse');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const content = document.getElementById('responseContent')?.textContent;
        if (content) {
            navigator.clipboard.writeText(content).then(() => {
                alert('已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
    });
}

// 检查服务器状态
async function checkServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    if (!statusElement) return;

    try {
        const response = await fetch('http://47.98.223.44:11451/test', {
            method: 'GET',
            cache: 'no-store'
        });
        
        if (response.ok) {
            statusElement.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800';
            statusElement.innerHTML = `
                <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                </svg>
                连接正常
            `;
        } else {
            throw new Error(`服务器响应状态: ${response.status}`);
        }
    } catch (error) {
        console.error('服务器连接失败:', error);
        const statusElement = document.getElementById('serverStatus');
        if (statusElement) {
            statusElement.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
            statusElement.innerHTML = `
                <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                </svg>
                连接失败
            `;
        }
        const serverUrlElement = document.getElementById('serverUrl');
        if (serverUrlElement) {
            serverUrlElement.textContent = `连接失败: ${error.message}`;
        }
    }
}

// 处理登录表单提交
async function handleLoginFormSubmit(e) {
    e.preventDefault();
    if (TEST_MODE) {
        // 测试模式直接使用模拟token
        localStorage.setItem('authToken', TEST_TOKEN);
        showResponse({status: "测试登录成功"}, "测试模式");
        setTimeout(() => window.location.href = "SY.html?test=1", 1000);
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const loadingIcon = document.getElementById('loadingIcon');
    const rememberCheckbox = document.getElementById('remember');
    const tokenInput = document.getElementById('token');
    
    if (!loginBtn || !btnText || !loadingIcon || !tokenInput) return;
    
    // 显示加载状态
    btnText.textContent = '登录中...';
    loginBtn.disabled = true;
    loadingIcon.classList.remove('hidden');
    
    const token = tokenInput.value.trim();
    
    try {
        // 记住我功能
        if (rememberCheckbox?.checked) {
            localStorage.setItem('rememberedToken', token);
        } else {
            localStorage.removeItem('rememberedToken');
        }
        
        // HTTP请求
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `t=${encodeURIComponent(token)}`
    });
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        
        // 从Cookie中提取token
        const cookieHeader = response.headers.get('Set-Cookie');
        if (!cookieHeader) {
            throw new Error('响应中未找到Set-Cookie头');
        }
        
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        if (!tokenMatch) {
            throw new Error('无法从Cookie中提取token');
        }
        
        const authToken = tokenMatch[1];
        localStorage.setItem('authToken', authToken);
        
        // 显示成功消息
        showResponse({
            status: '登录成功',
            token: authToken
        }, '登录成功');
        
        // 2秒后跳转到首页
        setTimeout(() => {
            window.location.href = 'SY.html';
        }, 2000);
        
    } catch (error) {
        console.error('登录失败:', error);
        showResponse({ 
            error: error.message,
            details: error.stack
        }, '登录失败');
        
    } finally {
        // 重置按钮状态
        if (btnText) btnText.textContent = '登录';
        if (loginBtn) loginBtn.disabled = false;
        if (loadingIcon) loadingIcon.classList.add('hidden');
    }
}

// 设置登录表单
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const tokenInput = document.getElementById('token');
    const rememberedToken = localStorage.getItem('rememberedToken');
    const rememberCheckbox = document.getElementById('remember');
    
    // 检查是否有记住的token
    if (rememberedToken && tokenInput) {
        tokenInput.value = rememberedToken;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
    
    loginForm.addEventListener('submit', handleLoginFormSubmit);
}

// 初始化登录页面
function initLoginPage() {
    // 1. 初始化基础UI组件
    setupTokenVisibilityToggle();
    setupModalClose();
    setupResponseCopy();
    
    // 2. 检查服务器状态
    checkServerStatus();
    
    // 3. 设置登录表单
    setupLoginForm();
    
    // 4. 最后初始化工具提示（确保其他元素已加载）
    setupTokenHelpTooltip();
}

// 确保DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加延迟确保所有元素都已加载
    setTimeout(initLoginPage, 50);
});

// 登录成功后处理
async function handleLoginSuccess(authToken) {
    localStorage.setItem('authToken', authToken);
    
    try {
        const response = await fetch('http://47.98.223.44:11451/api/validate', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showResponse({
                status: '登录成功',
                token: authToken
            }, '登录成功');
            
            setTimeout(() => {
                window.location.href = 'SY.html';
            }, 2000);
        } else {
            throw new Error('Token验证失败');
        }
    } catch (error) {
        console.error('验证token失败:', error);
        showResponse({ 
            error: 'Token验证失败',
            details: error.message
        }, '登录失败');
    }
}