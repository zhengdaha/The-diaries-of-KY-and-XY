// source/js/love_home.js

(function() {
    // 1. 只在首页执行
    // 兼容多种首页路径写法
    var isHome = location.pathname === '/' || 
                 location.pathname === '/index.html' || 
                 location.pathname.endsWith('/The-diaries-of-KY-and-XY/') || 
                 location.pathname.endsWith('/The-diaries-of-KY-and-XY/index.html');

    if (!isHome) return;

    document.addEventListener('DOMContentLoaded', function () {
        
        // 2. 尝试找到挂载点
        // Butterfly 主题的首页通常都有一个叫 layout 或者 content-inner 的大容器
        var targetContainer = document.querySelector('.layout') || 
                              document.getElementById('content-inner') || 
                              document.getElementById('recent-posts').parentNode;

        if (!targetContainer) {
            console.error("找不到首页容器，无法加载恋爱仪表盘");
            return;
        }

        // 3. 准备我们的 HTML 内容
        var dashboardHTML = `
            <div id="love-dashboard-full" style="width:100%; min-height:100vh; display:flex;">
                
                <div class="love-panel pink-panel">
                    <div class="panel-inner">
                        <div class="love-icon">❤️</div>
                        <h2>我们已经在一起</h2>
                        <div id="together-timer">计算中...</div>
                        <p class="love-subtitle">Start: 2026-01-01</p>
                    </div>
                </div>

                <div class="love-panel blue-panel">
                    <div class="panel-inner">
                        <div class="love-icon">✈️</div>
                        <h2>距离下一次见面</h2>
                        <div id="meet-timer">请设置日期</div>
                        
                        <div class="date-selector">
                            <input type="date" id="meet-date-input">
                            <div class="btn-row">
                                <button onclick="saveMeetDate()">确定</button>
                                <button onclick="clearMeetDate()">待定</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // 4. 【核心动作】把新内容插入到容器的最前面
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = dashboardHTML;
        // 插入到容器最开头
        targetContainer.insertBefore(tempDiv.firstElementChild, targetContainer.firstChild);

        // 5. 再次确保旧内容被移除 (双重保险)
        var oldPosts = document.getElementById('recent-posts');
        var oldAside = document.getElementById('aside-content');
        if (oldPosts) oldPosts.style.display = 'none';
        if (oldAside) oldAside.style.display = 'none';

        // 6. 启动时间计算
        startLoveTiming();
    });
})();

// --- 时间逻辑 (保持不变) ---
function startLoveTiming() {
    function updateTogether() {
        const start = new Date("2026-01-01T00:00:00");
        const now = new Date();
        const diff = now - start;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const el = document.getElementById("together-timer");
        if(el) el.innerHTML = `${d}天 ${h}小时 ${m}分 ${s}秒`;
    }

    window.updateMeetTimer = function() {
        const saved = localStorage.getItem('meetDate');
        const display = document.getElementById("meet-timer");
        const input = document.getElementById("meet-date-input");
        if(!display) return;
        if (!saved) {
            display.innerHTML = "📅 待定";
            return;
        }
        if(input && input.value !== saved) input.value = saved;
        const target = new Date(saved + "T00:00:00");
        const now = new Date();
        const diff = target - now;
        if (diff < 0) {
            display.innerHTML = "🎉 就是今天！";
        } else {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            display.innerHTML = `${d}天 ${h}小时`;
        }
    }

    window.saveMeetDate = function() {
        const val = document.getElementById("meet-date-input").value;
        if(val) {
            localStorage.setItem('meetDate', val);
            updateMeetTimer();
            alert("日期已保存");
        }
    }

    window.clearMeetDate = function() {
        localStorage.removeItem('meetDate');
        const input = document.getElementById("meet-date-input");
        if(input) input.value = "";
        updateMeetTimer();
    }

    setInterval(updateTogether, 1000);
    setInterval(updateMeetTimer, 1000);
    updateTogether();
    updateMeetTimer();
}