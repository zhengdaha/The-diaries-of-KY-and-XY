/* source/js/fullpage.js */

(function () {
    /**
     * 1. 基础配置
     */
    const CONFIG = {
        startDate: "2026-01-01T00:00:00", // 在一起的时间
        meetDate: "2026-02-14T00:00:00",  // 下次见面的时间
        repoName: "/The-diaries-of-KY-and-XY/", 
        
        // 照片墙路径配置
        photoList: [
            "/The-diaries-of-KY-and-XY/img/New_Year's_Eve.JPG",
            "/The-diaries-of-KY-and-XY/img/Yuexiu_Park1.JPG", 
            "/The-diaries-of-KY-and-XY/img/Yuexiu_Park2.JPG",
            "/The-diaries-of-KY-and-XY/img/Yuexiu_Park3.JPG",
            "/The-diaries-of-KY-and-XY/img/Cat1.JPG",
            "/The-diaries-of-KY-and-XY/img/IMG_0459.JPG",
            "/The-diaries-of-KY-and-XY/img/Shipai_Park.JPG",
            "/The-diaries-of-KY-and-XY/img/Internet_cafe.JPG"
        ],

        // 信件内容 (支持 <br> 换行)
        letterContent: `展信安,<br><br>
        当我写下这封信的时候，距离我们下次见面还有一些时间。<br>
        每一张照片都是我们共同的记忆碎片，而未来还有更多的故事等待我们去书写。<br>
        <br>
        I just want to tell you that I love you.<br>
        Waiting for you.<br><br>
        Yours,<br>KY`
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
            // 清除容器原有的样式限制
            const parent = targetContainer.parentElement;
            if (parent) {
                parent.style.padding = "0";
                parent.style.margin = "0";
                parent.style.maxWidth = "100%";
            }
            
            // 注入 HTML
            renderHTML(targetContainer);
            
            // 启动逻辑
            startLogic();
        }
    };

    /**
     * 3. HTML 渲染
     */
     const renderHTML = (container) => {
        const displayDate = CONFIG.meetDate.split('T')[0];

        // 生成照片墙 HTML
        const photosHTML = CONFIG.photoList.map((src, index) => {
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
                                <img src="./img/heart.jpg" alt="Heart" onerror="this.style.display='none'">
                            </div>
                        </div>
                        <div class="align-slot-title"><h2>We have been together for</h2></div>
                        <div class="align-slot-timer"><div id="together-timer">Calculating...</div></div>
                        <div class="align-slot-footer1"><p class="since-text">Since ${CONFIG.startDate.split('T')[0]}</p></div>
                    </div>
                </div>
                <div class="love-panel-split blue-split">
                    <div class="panel-content">
                        <div class="align-slot-icon"><div class="love-icon-large">✈️</div></div>
                        <div class="align-slot-title"><h2>Time Until Next Meeting</h2></div>
                        <div class="align-slot-timer"><div id="meet-timer">Calculating...</div></div>
                        <div class="align-slot-footer2"><p class="since-text">Target: ${displayDate}</p></div>
                    </div>
                </div>
                <a href="#section-3" id="scroll-down-2"></a>
            </div>

            <div id="section-3" class="love-dashboard-full-screen photo-wall-section">
                <div class="photo-wall-overlay"></div>
                <div class="photo-wall-container">${photosHTML}</div>
                <div class="photo-wall-title"><h2>These are our memories.</h2></div>
                <a href="#section-4" id="scroll-down-3"></a>
            </div>

            <div id="section-4" class="love-dashboard-full-screen letter-section">
                <div class="envelope-wrapper">
                    <div class="envelope" id="envelope">
                        <div class="envelope-front"></div>
                        <div class="envelope-flap" id="envelope-flap"></div>
                        <div class="wax-seal" id="wax-seal"></div>

                        <div class="letter" id="letter">
                            <div class="letter-content" id="letter-content"></div>
                        </div>
                    </div>
                </div>
                
                <div class="instruction-text" id="instruction-text">TAP THE SEAL TO OPEN</div>
                
                <div class="close-letter-btn" id="close-letter-btn">Close Letter</div>
            </div>
        `;
    };

    /**
     * 4. 逻辑控制
     */
    const startLogic = () => {
        // 1. 计时器
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
        
        // 2. 平滑滚动
        document.querySelectorAll('a[id^="scroll-down"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement){
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 3. 启动信封逻辑
        initEnvelopeLogic();
    };

    /**
     * 信封交互逻辑 (Open & Close)
     */
    const initEnvelopeLogic = () => {
        const envelope = document.getElementById('envelope');
        const seal = document.getElementById('wax-seal');
        const instruction = document.getElementById('instruction-text');
        const closeBtn = document.getElementById('close-letter-btn');
        
        if (!envelope || !seal) return;

        let isOpened = false;

        // --- 打开信封 ---
        seal.addEventListener('click', () => {
            if (isOpened) return;
            isOpened = true;

            // 1. 动画状态：打开
            envelope.classList.add('open');
            
            // 2. UI 切换：添加 is-hidden 类，强制停止动画并隐藏提示
            if (instruction) {
                instruction.classList.add('is-hidden');
            }
            
            // 延迟显示关闭按钮
            setTimeout(() => {
                if (closeBtn) {
                    closeBtn.style.opacity = '1';
                    closeBtn.style.pointerEvents = 'auto';
                }
            }, 1200);

            // 3. 开始打字机逻辑
            setTimeout(() => {
                typeWriter(CONFIG.letterContent, 'letter-content');
            }, 800);
        });

        // --- 关闭信封 ---
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (!isOpened) return;
                isOpened = false;

                // 1. 撤销动画状态
                envelope.classList.remove('open');

                // 2. UI 切换：隐藏关闭按钮
                closeBtn.style.opacity = '0';
                closeBtn.style.pointerEvents = 'none';
                
                // 延迟恢复提示语
                setTimeout(() => {
                    if (instruction) {
                        instruction.classList.remove('is-hidden');
                    }
                }, 800);
            });
        }
    };

    /**
     * 打字机效果函数
     */
    const typeWriter = (text, elementId) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = ""; // 清空上次的内容
        let i = 0;
        
        const type = () => {
            // 安全检查：如果信封被关闭了，停止打字
            const envelope = document.getElementById('envelope');
            if (!envelope || !envelope.classList.contains('open')) return;

            if (i < text.length) {
                // 处理 HTML 标签 (如 <br>)，一次性输出完整标签
                if (text.charAt(i) === '<') {
                    let tag = '';
                    while (text.charAt(i) !== '>' && i < text.length) {
                        tag += text.charAt(i);
                        i++;
                    }
                    tag += '>';
                    i++;
                    element.innerHTML += tag;
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
                
                // 自动滚动到底部
                const letterContainer = document.getElementById('letter');
                if (letterContainer) {
                    letterContainer.scrollTop = letterContainer.scrollHeight;
                }

                setTimeout(type, 30); // 打字速度
            }
        };
        type();
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

    // 绑定生命周期
    document.addEventListener('DOMContentLoaded', initLovePage);
    document.addEventListener('pjax:complete', initLovePage);

})();