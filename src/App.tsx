import { useEffect, useMemo, useState } from 'react';
import comms from './data/comms.json';

type CategoryId = 'all' | 'basic' | 'teamfight' | 'status' | 'laning' | 'map' | 'jungle' | 'objectives' | 'macro' | 'social' | 'technical';

type CommItem = {
  id: string;
  zh: string;
  en: string[];
  category: Exclude<CategoryId, 'all'>;
  tags?: string[];
  priority?: number;
};

const items = comms as CommItem[];

function RiotGamesLogo() {
  return (
    <svg className="riot-logo" viewBox="0 0 587.93 165" aria-hidden="true" focusable="false">
      <path d="M98.77.33 0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05 1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 0 1-1.92 7.31 13 13 0 0 1-5.6 5.11 20 20 0 0 1-8.9 1.8 17.53 17.53 0 0 1-10-2.8 17.87 17.87 0 0 1-6.44-8.14 33.06 33.06 0 0 1-2.27-12.93 31.81 31.81 0 0 1 2.32-12.81 18.14 18.14 0 0 1 6.5-8 17.27 17.27 0 0 1 9.82-2.78 19.31 19.31 0 0 1 5.36.71 14.15 14.15 0 0 1 4.33 2.09 12.92 12.92 0 0 1 3.18 3.29 15.61 15.61 0 0 1 2 4.44h17.27a27.22 27.22 0 0 0-3.46-10.28 28.84 28.84 0 0 0-7.05-8.1 32.6 32.6 0 0 0-9.91-5.29 37.91 37.91 0 0 0-12.06-1.86 37.32 37.32 0 0 0-14 2.6 32.6 32.6 0 0 0-11.36 7.61 35 35 0 0 0-7.61 12.21 46.15 46.15 0 0 0-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0 0 12.69 13.27 39.84 39.84 0 0 0 35.84.84 28.39 28.39 0 0 0 11.67-11q4.25-7.19 4.24-17.2v-9.76Zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 0 0-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 0 0-6.26 1 8.62 8.62 0 0 0-3.83 2.78 6.74 6.74 0 0 0-1.33 4 6.2 6.2 0 0 0 .79 3.29 7.27 7.27 0 0 0 2.4 2.45 16.54 16.54 0 0 0 3.7 1.79 40.14 40.14 0 0 0 4.64 1.31l6.63 1.54a47.19 47.19 0 0 1 9.45 3.08 27.46 27.46 0 0 1 7.2 4.68 18.84 18.84 0 0 1 4.58 6.39 20.37 20.37 0 0 1 1.61 8.29 20.65 20.65 0 0 1-3.54 12.11 22.56 22.56 0 0 1-10.15 7.85 41.31 41.31 0 0 1-15.93 2.76 42.69 42.69 0 0 1-16.17-2.81 23.22 23.22 0 0 1-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 0 0 7.05 9.94 19.37 19.37 0 0 0 7.24 1.26 18.44 18.44 0 0 0 6.66-1.09 10 10 0 0 0 4.33-3 7.22 7.22 0 0 0 1.57-4.48 6.16 6.16 0 0 0-1.42-4 10.86 10.86 0 0 0-4.14-2.81 42.07 42.07 0 0 0-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 0 1 3.72-12.12 24.74 24.74 0 0 1 10.33-8.11 36.74 36.74 0 0 1 15-2.91 35.62 35.62 0 0 1 14.92 2.91 23.43 23.43 0 0 1 9.91 8.14 21.54 21.54 0 0 1 3.6 12.12Zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42Zm-28.43-29.7 8.22-27.65h3.1l8.26 27.65Zm278.58-37.76a4 4 0 0 1-3.67-2.44 4 4 0 0 1 0-3.1 4 4 0 0 1 .85-1.27 4.25 4.25 0 0 1 1.27-.86 4.15 4.15 0 0 1 3.1 0 4.13 4.13 0 0 1 1.27.86 4.08 4.08 0 0 1 .86 1.27 4 4 0 0 1 0 3.1 4.08 4.08 0 0 1-.86 1.27 4 4 0 0 1-1.27.86 4 4 0 0 1-1.55.31Zm0-1.09a2.84 2.84 0 0 0 1.47-.39 2.94 2.94 0 0 0 1.05-1 2.93 2.93 0 0 0 0-2.92 3 3 0 0 0-1.06-1 2.93 2.93 0 0 0-2.92 0 3 3 0 0 0-1 1 2.86 2.86 0 0 0 0 2.92 3 3 0 0 0 1 1 2.83 2.83 0 0 0 1.46.39Zm-1.46-1.15V90.6h1.78a1.52 1.52 0 0 1 .69.15 1.13 1.13 0 0 1 .47.42 1.24 1.24 0 0 1 .17.66 1.16 1.16 0 0 1-.18.66 1 1 0 0 1-.48.41 1.56 1.56 0 0 1-.7.14h-1.2v-.72h1a.52.52 0 0 0 .36-.12.5.5 0 0 0 .14-.37.47.47 0 0 0-.14-.37.52.52 0 0 0-.36-.12h-.55v2.93Zm2.39-1.68.82 1.68h-1.11l-.75-1.68ZM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 0 1-12.79 13.17 38.57 38.57 0 0 1-36.31 0 32.75 32.75 0 0 1-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0 1 12.75-13.14 38.65 38.65 0 0 1 36.31 0 32.67 32.67 0 0 1 12.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 0 0-2.23-13 17.47 17.47 0 0 0-6.33-8 18.57 18.57 0 0 0-19.45 0 17.57 17.57 0 0 0-6.35 8 38.59 38.59 0 0 0 0 26 17.49 17.49 0 0 0 6.35 8 18.57 18.57 0 0 0 19.45 0 17.39 17.39 0 0 0 6.33-8 33.4 33.4 0 0 0 2.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 0 0 8.75-16.39 24.15 24.15 0 0 0-3.26-12.75 21.9 21.9 0 0 0-9.36-8.64 32.56 32.56 0 0 0-14.64-3H212v75.4h17.06v-26.3Zm-.32-15.61a19.35 19.35 0 0 1-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 0 1 7.25 1.24 9.12 9.12 0 0 1 4.4 3.7 10 10 0 0 1 1.5 5.64 9.65 9.65 0 0 1-1.48 5.55 8.86 8.86 0 0 1-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14Z" />
    </svg>
  );
}

function LeagueLogo() {
  return (
    <svg className="league-logo" viewBox="0 0 30 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M1.80644 9.75049C0.655032 11.8373 0 14.2271 0 16.7683C0 19.3095 0.655032 21.7015 1.80644 23.7883V9.75049Z" fill="#C28F2C" />
      <path d="M15 2.02222C13.7829 2.02222 12.602 2.16921 11.4688 2.43647V4.75718C12.5907 4.44093 13.7738 4.26721 15 4.26721C22.0218 4.26721 27.7153 9.84627 27.7153 16.7305C27.7153 19.8307 26.5571 22.6659 24.6464 24.8463L24.2838 26.118L23.4814 28.9331C27.4184 26.2761 30.0023 21.8195 30.0023 16.7705C30 8.62355 23.2843 2.02222 15 2.02222Z" fill="#C28F2C" />
      <path d="M11.4688 24.4209H22.9737H23.2253C25.1723 22.4209 26.3713 19.7126 26.3713 16.7305C26.3713 10.5746 21.2806 5.58569 15 5.58569C13.767 5.58569 12.5816 5.78168 11.4688 6.1358V24.4209Z" fill="#C28F2C" />
      <path d="M10.1088 0H1.55029L3.16634 3.29844V28.7038L1.55029 32H21.1922L22.9737 25.7572H10.1088V0Z" fill="#C28F2C" />
    </svg>
  );
}

const categories: { id: CategoryId; label: string; desc: string }[] = [
  { id: 'all', label: '全部', desc: '所有语音词条' },
  { id: 'basic', label: '基础', desc: '提醒、撤退、求助、视野' },
  { id: 'teamfight', label: '团战', desc: '开团、拉扯、集火、保护' },
  { id: 'status', label: '技能', desc: '大招、闪现、冷却、血蓝' },
  { id: 'laning', label: '对线', desc: '推线、控线、线权、补刀' },
  { id: 'map', label: '地图', desc: '上中下野辅' },
  { id: 'jungle', label: '打野', desc: '抓人、反蹲、入侵、路线' },
  { id: 'objectives', label: '资源', desc: '小龙、大龙、先锋、巢虫' },
  { id: 'macro', label: '运营', desc: '转线、推塔、回城、一波' },
  { id: 'social', label: '交流', desc: '鼓励、道歉、礼貌表达' },
  { id: 'technical', label: '网络', desc: '延迟、掉线' }
];

const favoritesKey = 'lol-comms-guide:favorites';

function normalize(value: string) {
  return value.toLowerCase().replace(/[’‘]/g, "'").trim();
}

function matchItem(item: CommItem, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return normalize([item.zh, ...item.en, ...(item.tags ?? [])].join(' ')).includes(q);
}

function copyText(text: string) {
  return navigator.clipboard?.writeText(text);
}

export default function App() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [mode, setMode] = useState<'cards' | 'table'>('cards');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites]);

  const filtered = useMemo(() => {
    return items
      .filter((item) => activeCategory === 'all' || item.category === activeCategory)
      .filter((item) => matchItem(item, query))
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || a.zh.localeCompare(b.zh, 'zh-Hans-CN'));
  }, [activeCategory, query]);

  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]);
  };

  const handleCopy = async (item: CommItem) => {
    await copyText(item.en.join(' / '));
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(''), 1200);
  };

  return (
    <main className="app-shell">
      <header className="site-header" aria-label="站点导航">
        <div className="brand" aria-label="Riot Games">
          <RiotGamesLogo />
        </div>
        <a className="product-brand" href="#guide">
          <LeagueLogo />
          <span>League Comms</span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Summoner's Rift Voice Guide</div>
          <h1>LEAGUE COMMS GUIDE</h1>
          <p className="subtitle">英雄联盟语音沟通中英对照表。按官网首页的深色电竞视觉重做，适合开黑、组排和临场指挥。</p>
          <div className="hero-actions">
            <a className="primary-cta" href="#guide">开始查询</a>
          </div>
        </div>
        <div className="hero-card" aria-label="工具概览">
          <span className="stat-value tabular">{items.length}</span>
          <span className="stat-label">条语音表达</span>
          <div className="hero-meta">
            <span>中文 / English</span>
            <span>Fan-made</span>
            <span>Copy Ready</span>
          </div>
        </div>
      </section>

      <section className="toolbar panel" id="guide">
        <label className="search-label" htmlFor="search">搜索词条</label>
        <div className="search-row">
          <input
            id="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索中文或英文，例如：撤退 / flash / dragon / 开团"
          />
          {query && <button onClick={() => setQuery('')}>清空</button>}
        </div>
        <div className="tabs" aria-label="分类筛选">
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? 'tab active' : 'tab'}
              onClick={() => setActiveCategory(category.id)}
              title={category.desc}
            >
              {category.label}
            </button>
          ))}
        </div>
        <div className="view-row">
          <span>找到 {filtered.length} 条结果</span>
          <div>
            <button className={mode === 'cards' ? 'active small' : 'small'} onClick={() => setMode('cards')}>卡片</button>
            <button className={mode === 'table' ? 'active small' : 'small'} onClick={() => setMode('table')}>表格</button>
          </div>
        </div>
      </section>

      {favoriteItems.length > 0 && (
        <section className="panel favorites">
          <h2>常用收藏</h2>
          <div className="favorite-list">
            {favoriteItems.map((item) => (
              <button key={item.id} onClick={() => setQuery(item.zh)}>{item.zh}</button>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <section className="panel empty">
          <p>没有找到匹配词条。试试搜索：flash、dragon、撤退、开团。</p>
          <button onClick={() => setQuery('')}>显示全部词条</button>
        </section>
      ) : mode === 'cards' ? (
        <section className="card-grid">
          {filtered.map((item) => (
            <article className="comm-card" key={item.id}>
              <div className="card-top">
                <div>
                  <h2>{item.zh}</h2>
                  <span className="category-pill">{categories.find((cat) => cat.id === item.category)?.label}</span>
                </div>
                <button className="icon-button" onClick={() => toggleFavorite(item.id)} aria-label={`收藏 ${item.zh}`}>
                  {favorites.includes(item.id) ? '★' : '☆'}
                </button>
              </div>
              <div className="phrases">
                {item.en.map((phrase) => <button key={phrase} onClick={() => copyText(phrase)}>{phrase}</button>)}
              </div>
              <button className="copy-button" onClick={() => handleCopy(item)}>{copiedId === item.id ? '已复制' : '复制全部'}</button>
            </article>
          ))}
        </section>
      ) : (
        <section className="panel table-wrap">
          <table>
            <thead>
              <tr><th>中文</th><th>English Voice Comms</th><th>分类</th><th>操作</th></tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.zh}</td>
                  <td>{item.en.join(' / ')}</td>
                  <td>{categories.find((cat) => cat.id === item.category)?.label}</td>
                  <td><button onClick={() => handleCopy(item)}>{copiedId === item.id ? '已复制' : '复制'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer>
        <p>本项目是玩家自制速查工具，与 Riot Games 或 League of Legends 官方无关。</p>
      </footer>
    </main>
  );
}
