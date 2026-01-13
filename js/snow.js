(function() {
    var flakes = [],
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        flakeCount = 0, // 飘落物总数
        mX = -100,
        mY = -100;

    // 1. 创建并设置Canvas画布
    canvas.setAttribute("id", "snowfall");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "999999";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    // 设置画布尺寸为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 2. 主要动画函数
    function snow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除上一帧

        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i],
                x = mX,
                y = mY,
                minDist = 50, // 鼠标感应范围，可根据需要调整
                x2 = flake.x,
                y2 = flake.y;

            // 鼠标交互逻辑：雪花/雪人会被鼠标推开
            var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                dx = x2 - x,
                dy = y2 - y;
            if (dist < minDist) {
                var force = minDist * 2 / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;
                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
            } else {
                flake.velX *= .28; // 水平阻力
                if (flake.velY <= flake.speed) flake.velY = flake.speed;
                flake.velX += Math.cos(flake.step += .25) * flake.stepSize; // 左右飘动
            }

            // --- 核心修改部分：根据类型绘制不同的Emoji ---
            ctx.font = (flake.type === "snowman" ? flake.size * 2.6 : flake.size * 2) + "px Arial, sans-serif"; // 雪人大30%
            var emojiToDraw = flake.type === "snowman" ? "⛄️" : "❄️"; // 80%概率为❄️，20%概率为⛄️
            ctx.fillText(emojiToDraw, flake.x, flake.y);
            // --- 绘制结束 ---

            // 更新位置
            flake.y += flake.velY;
            flake.x += flake.velX;

            // 边界重置：如果飘出画面，则重新从顶部随机位置出现
            if (flake.y >= canvas.height || flake.y <= 0) reset(flake);
            if (flake.x >= canvas.width || flake.x <= 0) reset(flake);
        }
        requestAnimationFrame(snow); // 循环下一帧
    }

    // 3. 重置一个飘落物的函数
    function reset(flake) {
        flake.x = Math.floor(Math.random() * canvas.width);
        flake.y = 0;
        flake.size = (Math.random() * 3) + 2;
        flake.speed = (Math.random() * 1) + 0.5;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = (Math.random() * 0.5) + 0.3;
        flake.stepSize = (Math.random()) / 30;
        flake.step = 0;
        // 重置时保持原有类型，或可以重新随机分配（此处选择保持）
    }

    // 4. 初始化函数：创建所有飘落物
    function init() {
        for (var i = 0; i < flakeCount; i++) {
            flakes.push({
                speed: (Math.random() * 1) + 1,
                velY: (Math.random() * 1) + 0.5,
                velX: 0,
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height),
                size: (Math.random() * 10) + 5, // 基础尺寸
                stepSize: (Math.random()) / 30,
                step: 0,
                opacity: (Math.random() * 0.5) + 0.3,
                // --- 核心修改：按80/20比例分配类型 ---
                type: Math.random() < 0.2 ? "snowman" : "snowflake" // 20%雪人，80%雪花
            });
        }
        snow(); // 开始动画
    }

    // 5. 事件监听
    // 鼠标移动交互
    document.addEventListener("mousemove", function(e) {
        mX = e.clientX, mY = e.clientY;
    });
    // 窗口大小变化时重置画布尺寸
    window.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 启动特效
    init();
})();