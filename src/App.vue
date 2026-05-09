<template>
  <div class="nav-module">
    <!-- 1. 顶部世界杯轮播Banner -->
    <div class="banner">
      <div class="banner-slide active">
        <img src="/banner/worldcup.jpg" alt="世界杯活动">
      </div>
      <button class="banner-btn prev">◀</button>
      <button class="banner-btn next">▶</button>
    </div>

    <!-- 2. 蓝色信息条（联系方式） -->
    <div class="info-bar">
      <span>旺旺2-542222</span>
      <span>✈️ 联系方式-@dj2111111111</span>
    </div>

    <!-- 3. 分类标签栏（推荐平台/热门游戏/工具商务） -->
    <div class="tab-bar">
      <button class="tab-btn active">推荐平台</button>
      <button class="tab-btn">热门游戏</button>
      <button class="tab-btn">工具/商务</button>
    </div>

    <!-- 4. 带「推荐」角标的卡片网格 -->
    <div class="card-grid">
      <!-- 第一行 -->
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/feifan.png" alt="非凡娱乐">
        </div>
        <p class="card-name">非凡娱乐</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/mengxiang.png" alt="梦想国际">
        </div>
        <p class="card-name">梦想国际</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/shengtian.png" alt="胜天国际">
        </div>
        <p class="card-name">胜天国际</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/zhengtu.png" alt="征途国际">
        </div>
        <p class="card-name">征途国际</p>
      </div>

      <!-- 第二行 -->
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/yihao.png" alt="壹号娱乐">
        </div>
        <p class="card-name">壹号娱乐</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/28quan.png" alt="28圈">
        </div>
        <p class="card-name">28圈</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/linghang.png" alt="领航国际">
        </div>
        <p class="card-name">领航国际</p>
      </div>
      <div class="site-card">
        <span class="recommend-tag">推荐</span>
        <div class="card-icon">
          <img src="/icons/huiying.png" alt="汇赢国际">
        </div>
        <p class="card-name">汇赢国际</p>
      </div>

      <!-- 第三行 -->
      <div class="site-card">
        <div class="card-icon">
          <img src="/icons/ng.png" alt="NG体育">
        </div>
        <p class="card-name">NG体育</p>
      </div>
      <div class="site-card">
        <div class="card-icon">
          <img src="/icons/shangjin.png" alt="赏金国际">
        </div>
        <p class="card-name">赏金国际</p>
      </div>
      <div class="site-card">
        <div class="card-icon">
          <img src="/icons/yiwan.png" alt="亿万28">
        </div>
        <p class="card-name">亿万28</p>
      </div>
      <div class="site-card">
        <div class="card-icon">
          <img src="/icons/c7.png" alt="C7娱乐">
        </div>
        <p class="card-name">C7娱乐</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-module {
  background: #f0f4ff;
  border-radius: 16px;
  overflow: hidden;
  margin: 15px 0;
}

/* 顶部轮播Banner */
.banner {
  position: relative;
  width: 100%;
  height: 220px;
}
.banner-slide {
  display: none;
  width: 100%;
  height: 100%;
}
.banner-slide.active {
  display: block;
}
.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
}
.banner-btn.prev { left: 10px; }
.banner-btn.next { right: 10px; }

/* 蓝色信息条 */
.info-bar {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

/* 分类标签栏 */
.tab-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 15px 0;
  background: white;
}
.tab-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: #f0f4ff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tab-btn.active {
  background: #3b82f6;
  color: white;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 10px 20px;
}
.site-card {
  background: white;
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  text-align: center;
}
.recommend-tag {
  position: absolute;
  top: 0;
  left: 0;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 0 0 6px 0;
}
.card-icon {
  width: 45px;
  height: 45px;
  margin: 0 auto 6px;
  border-radius: 10px;
  overflow: hidden;
}
.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card-name {
  margin: 0;
  font-size: 13px;
  color: #333;
}
</style>
