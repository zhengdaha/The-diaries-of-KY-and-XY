/* source/js/fullpage.js */

(function () {
    /**
     * 1. 基础配置
     */
    const CONFIG = {
        startDate: "2026-01-01T00:00:00", // 在一起的时间
        meetDate: "2026-03-20T00:00:00",  // 下次见面的时间
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
            "/The-diaries-of-KY-and-XY/img/Internet_cafe.JPG",
            "/The-diaries-of-KY-and-XY/img/Luoyang.jpg"
        ],

        // 信件内容 (支持 <br> 换行)
        letterContent: 
        `展信安,<br>
        在该那一次拥抱后离别，我坐上出租车后我没有太大的情绪起伏。可能是拥抱过后的余温依然留在我的怀中，它麻痹了我，让我如平常般拉开车门、放下包裹，告诉我似乎这是一次再普通不过的离别。但是我知道，我不敢望向车窗外，我只能漫无目的地看着手机，我害怕再看到你的身影，我知道那对我来说那将会是一针“留下来”的强心剂。<br><br>
        回去后，我闭上眼睛，我想象着，要翻过多少高山，越过多少河流，才能再触摸到你；我细数着，还要熬过多少个寂静的夜晚，才能再次感受你的心跳；我眺望着，这中间相隔多少时空，我们的目光是否会在某片天空下交汇。<br><br>
        他们说，在广州，不说“再见”，而是说“嘉禾望岗”，这个地铁站向北走是飞机场，向南走是地铁站，有无数的人在此分别。然而我们却从未在此处分别，提起”嘉禾望岗”，我只想起你曾嘲笑我模仿地铁播报时的窘态，在我的心里，这站不是意味着分别，它是藏在我心中的美好回忆。<br><br>
        <div style="width: 100%; text-align: right; margin-top: 30px;">
        鑫宇<br>
        2026.02.11 20：59
        </div>`
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
            }, 1800);
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
/* source/js/fullpage.js */

/**
 * 修改后的打字机效果函数
 * 支持标点符号停顿
 */
/* source/js/fullpage.js */

/**
 * 修改后的打字机效果函数
 * 逗号延迟 1s，句号延迟 2s
 */
 const typeWriter = (text, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = ""; // 清空上次的内容
    let i = 0;
    
    const type = () => {
        // 安全检查：如果信封被关闭了，停止打字
        const envelope = document.getElementById('envelope');
        // 必须确保 envelope 存在且有 open 类，否则停止
        if (!envelope || !envelope.classList.contains('open')) return;

        if (i < text.length) {
            let currentDelay = 50; // 默认打字速度 (50ms，比原来稍微慢一点点更像写字)
            const char = text.charAt(i);

            // --- 1. 处理 HTML 标签 (如 <br>) ---
            // 遇到标签时一次性输出，不产生打字延迟
            if (char === '<') {
                let tag = '';
                // 循环提取完整标签，直到遇到 '>'
                while (text.charAt(i) !== '>' && i < text.length) {
                    tag += text.charAt(i);
                    i++;
                }
                tag += '>'; // 补上最后的 '>'
                i++;        // 跳过 '>' 字符
                element.innerHTML += tag;
                
                // 标签本身不延迟，稍微给一点点处理时间即可
                currentDelay = 150; 

            } else {
                // --- 2. 处理普通字符 ---
                element.innerHTML += char;
                
                // --- 3. 核心修改：标点符号延迟判断 ---
                // 检测 逗号 (， ,) -> 1000ms
                if (char === '，' || char === ',') {
                    currentDelay = 1000; 
                } 
                // 检测 句号 (。 .) -> 2000ms
                else if (char === '。' || char === '.') {
                    currentDelay = 2000;
                }
                
                i++; // 指向下一个字符
            }
            
            // 自动滚动到底部 (确保长信也能看到最新打出的字)
            const letterContainer = document.getElementById('letter');
            if (letterContainer) {
                letterContainer.scrollTop = letterContainer.scrollHeight;
            }

            // 递归调用，时间由 currentDelay 决定
            setTimeout(type, currentDelay);
        }
    };
    
    // 启动打字
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