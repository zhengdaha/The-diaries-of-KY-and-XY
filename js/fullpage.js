/* source/js/fullpage.js */

(function () {
    /**
     * 1. 基础配置与路径检测
     */
    const CONFIG = {
        startDate: "2026-01-01T00:00:00", // 在一起的时间
        repoName: "/The-diaries-of-KY-and-XY/", // 你的 GitHub 仓库二级目录名
    };

    // 检测是否在首页 (兼容本地预览和 GitHub Pages 二级目录)
    const isHomePage = () => {
        const path = window.location.pathname;
        return path === '/' || 
               path === '/index.html' || 
               path === CONFIG.repoName || 
               path === CONFIG.repoName + 'index.html';
    };

    /**
     * 2. 核心初始化函数
     */
    const initLovePage = () => {
        if (!isHomePage()) return;

        // 查找 Butterfly 的主容器 (recent-posts 是首页文章列表容器)
        const targetContainer = document.getElementById('recent-posts') || document.querySelector('.layout');
        
        if (targetContainer) {
            // 彻底清除容器原有的 Butterfly 样式限制
            const parent = targetContainer.parentElement;
            if (parent) {
                parent.style.padding = "0";
                parent.style.margin = "0";
                parent.style.maxWidth = "100%";
            }
            
            // 注入全新的 HTML 结构
            renderHTML(targetContainer);
            
            // 启动功能逻辑
            startLogic();
        }
    };

    /**
     * 3. HTML 渲染
     */
    const renderHTML = (container) => {
        container.innerHTML = `
            <div id="section-2" class="love-dashboard-full-screen">
                <div class="love-panel-split pink-split">
                    <div class="panel-content">
                        <div class="love-icon-large">❤️</div>
                        <h2>We have been together for</h2>
                        <div id="together-timer">Calculating...</div>
                        <p style="font-size: 1.5rem;">Since ${CONFIG.startDate.split('T')[0]}</p>
                    </div>
                </div>

                <div class="love-panel-split blue-split">
                    <div class="panel-content">
                        <div class="love-icon-large">✈️</div>
                        <h2>Time Until Next Meeting</h2>
                        <div id="meet-timer" onclick="openCalendar()">Click to Set Date</div>
                        
                        <div class="modern-date-wrap">
                            <input type="text" id="modern-date-input" placeholder="📅 Select Date">
                            <button onclick="clearMeetDate()" class="btn-text-only">Clear Date</button>
                        </div>
                    </div>
                </div>
                <a href="#section-3" id="scroll-down-2"></a>
            </div>

            <div id="section-3" class="love-dashboard-full-screen" style="background: #2c3e50;">
                <div class="panel-content" style="color:white; width:100%; text-align:center;">
                    <h2 style="font-size:3rem">To be continued...</h2>
                    <p style="font-size:1.2rem; opacity:0.7">Space reserved for your Photo Gallery or Journal</p>
                </div>
            </div>
        `;
    };

    /**
     * 4. 功能逻辑控制
     */
    const startLogic = () => {
        // --- 初始化日历 (Flatpickr) ---
        if (typeof flatpickr !== 'undefined') {
            flatpickr("#modern-date-input", {
                // "locale": "zh", // 移除中文设置，默认回退到英文
                dateFormat: "Y-m-d",
                minDate: "today",
                disableMobile: false, // 允许手机端使用插件界面
                defaultDate: localStorage.getItem('meetDate') || null,
                onChange: function(selectedDates, dateStr) {
                    localStorage.setItem('meetDate', dateStr);
                    updateMeetTimer();
                }
            });
        }

        // --- 计时器循环 ---
        const timerLoop = setInterval(() => {
            if (!document.getElementById('together-timer')) {
                clearInterval(timerLoop); // 离开页面时停止计时
                return;
            }
            updateTogetherTimer();
            updateMeetTimer();
        }, 1000);

        updateTogetherTimer();
        updateMeetTimer();
    };

    /**
     * 5. 辅助计算函数
     */
    const updateTogetherTimer = () => {
        const start = new Date(CONFIG.startDate);
        const now = new Date();
        const diff = now - start;
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        const el = document.getElementById("together-timer");
        if (el) {
            // 中文改为英文：天 -> Days, 时分秒 -> h m s
            el.innerHTML = `${d} Days <span style="font-size:0.7em; opacity:0.9;">${h}h ${m}m ${s}s</span>`;
        }
    };

    window.updateMeetTimer = function() {
        const saved = localStorage.getItem('meetDate');
        const display = document.getElementById("meet-timer");
        if (!display) return;

        if (!saved) {
            // 中文改为英文
            display.innerHTML = "📅 Not Set";
            return;
        }

        const target = new Date(saved + "T00:00:00");
        const now = new Date();
        // 设置为当天最后时刻，确保倒计时在当天显示为0或1
        target.setHours(23, 59, 59);
        
        const diff = target - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            // 中文改为英文
            display.innerHTML = "🎉 Reunited!";
        } else if (d === 0) {
            // 中文改为英文
            display.innerHTML = "🎉 It's Today!";
        } else {
            // 中文改为英文
            display.innerHTML = `${d} days left`;
        }
    };

    window.openCalendar = function() {
        const input = document.querySelector("#modern-date-input");
        if (input && input._flatpickr) input._flatpickr.open();
    };

    window.clearMeetDate = function() {
        localStorage.removeItem('meetDate');
        const input = document.querySelector("#modern-date-input");
        if (input && input._flatpickr) input._flatpickr.clear();
        updateMeetTimer();
    };

    /**
     * 6. 绑定生命周期
     */
    // 处理普通加载
    document.addEventListener('DOMContentLoaded', initLovePage);
    // 处理 Butterfly 的 Pjax 跳转 (非常重要，否则切换页面后返回首页会失效)
    document.addEventListener('pjax:complete', initLovePage);

})();