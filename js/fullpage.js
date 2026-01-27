/* source/js/fullpage.js */

(function () {
    /**
     * 1. 基础配置与路径检测
     */
    const CONFIG = {
        startDate: "2026-01-01T00:00:00", // 在一起的时间
        meetDate: "2026-02-14T00:00:00",  // 下次见面的时间
        repoName: "/The-diaries-of-KY-and-XY/", 
        
        // 【在此处添加照片路径】
        // 建议使用 6-8 张横竖搭配的照片，以获得最佳效果
        photoList: [
            "./The-diaries-of-KY-and-XY/img/New Year's Eve.JPG",
            "./The-diaries-of-KY-and-XY/img/Yuexiu_Park1.JPG", 
            "./The-diaries-of-KY-and-XY/img/Yuexiu_Park2.JPG",
            "./The-diaries-of-KY-and-XY/img/Yuexiu_Park3.JPG",
            "./The-diaries-of-KY-and-XY/img/Cat1.JPG",
            "./The-diaries-of-KY-and-XY/img/IMG_0459.JPG",
            "./The-diaries-of-KY-and-XY/img/Shipai_Park.JPG",
            "./The-diaries-of-KY-and-XY/img/Internet cafe.JPG"
        ]
    };

    // 检测是否在首页
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

        // 查找 Butterfly 的主容器
        const targetContainer = document.getElementById('recent-posts') || document.querySelector('.layout');
        
        if (targetContainer) {
            // 清除容器原有的 Butterfly 样式限制
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
        const displayDate = CONFIG.meetDate.split('T')[0];

        // 生成照片墙的 HTML 字符串
        const photosHTML = CONFIG.photoList.map((src, index) => {
            // 随机给照片添加一点旋转角度，增加随意感 (-10度 到 10度)
            const randomRotate = Math.floor(Math.random() * 20) - 10; 
            return `<div class="memory-photo-item" style="--rotate:${randomRotate}deg">
                        <img src="${src}" loading="lazy" alt="Memory ${index + 1}">
                    </div>`;
        }).join('');

        container.innerHTML = `
            <div id="section-2" class="love-dashboard-full-screen">
                <div class="love-panel-split pink-split">
                    <div class="panel-content">
                        <div class="align-slot-icon">
                            <div class="love-icon-large">
                                <img src="./img/heart.jpg" alt="Heart">
                            </div>
                        </div>
                        <div class="align-slot-title">
                            <h2>We have been together for</h2>
                        </div>
                        <div class="align-slot-timer">
                            <div id="together-timer">Calculating...</div>
                        </div>
                        <div class="align-slot-footer1">
                            <p class="since-text">Since ${CONFIG.startDate.split('T')[0]}</p>
                        </div>
                    </div>
                </div>
                <div class="love-panel-split blue-split">
                    <div class="panel-content">
                        <div class="align-slot-icon">
                            <div class="love-icon-large">✈️</div>
                        </div>
                        <div class="align-slot-title">
                            <h2>Time Until Next Meeting</h2>
                        </div>
                        <div class="align-slot-timer">
                            <div id="meet-timer">Calculating...</div>
                        </div>
                        <div class="align-slot-footer2">
                            <p class="since-text">Target: ${displayDate}</p>
                        </div>
                    </div>
                </div>
                <a href="#section-3" id="scroll-down-2"></a>
            </div>

            <div id="section-3" class="love-dashboard-full-screen photo-wall-section">
                <div class="photo-wall-overlay"></div>
                
                <div class="photo-wall-container">
                    ${photosHTML}
                </div>

                <div class="photo-wall-title">
                    <h2>These are our memories.</h2>
                </div>

                <a href="#section-4" id="scroll-down-3"></a>
            </div>

            <div id="section-4" class="love-dashboard-full-screen" style="background: #2c3e50;">
                <div class="panel-content" style="color:white; width:100%; text-align:center;">
                    <h2 style="font-size:3rem">To be continued...</h2>
                    <p style="font-size:1.2rem; opacity:0.7">Space reserved for future stories.</p>
                </div>
            </div>
        `;
    };

    /**
     * 4. 功能逻辑控制
     */
    const startLogic = () => {
        const timerLoop = setInterval(() => {
            if (!document.getElementById('together-timer')) {
                clearInterval(timerLoop);
                return;
            }
            updateTogetherTimer();
            updateMeetTimer();
        }, 1000);

        updateTogetherTimer();
        updateMeetTimer();
        
        // 简单的平滑滚动修正
        document.querySelectorAll('a[id^="scroll-down"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement){
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
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
            el.innerHTML = `${d} Days <span style="font-size:0.7em; opacity:0.9;">${h}h ${m}m ${s}s</span>`;
        }
    };

    const updateMeetTimer = () => {
        const display = document.getElementById("meet-timer");
        if (!display) return;

        const targetStr = CONFIG.meetDate;
        
        if (!targetStr) {
            display.innerHTML = "📅 Not Set";
            return;
        }

        const target = new Date(targetStr);
        const now = new Date();
        target.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        const diff = target - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            display.innerHTML = "🎉 Reunited!";
        } else if (d === 0) {
            display.innerHTML = "🎉 Today's the day!!!";
        } else {
            display.innerHTML = `${d} days left`;
        }
    };

    /**
     * 6. 绑定生命周期
     */
    document.addEventListener('DOMContentLoaded', initLovePage);
    document.addEventListener('pjax:complete', initLovePage);

})();