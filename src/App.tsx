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

const categories: { id: CategoryId; label: string; desc: string }[] = [
  { id: 'all', label: '全部', desc: '所有语音词条' },
  { id: 'basic', label: '基础沟通', desc: '提醒、撤退、求助、视野' },
  { id: 'teamfight', label: '团战指挥', desc: '开团、拉扯、集火、保护' },
  { id: 'status', label: '技能状态', desc: '大招、闪现、冷却、血蓝' },
  { id: 'laning', label: '对线兵线', desc: '推线、控线、线权、补刀' },
  { id: 'map', label: '地图位置', desc: '上中下野辅' },
  { id: 'jungle', label: '打野节奏', desc: '抓人、反蹲、入侵、路线' },
  { id: 'objectives', label: '资源目标', desc: '小龙、大龙、先锋、巢虫' },
  { id: 'macro', label: '推进运营', desc: '转线、推塔、回城、一波' },
  { id: 'social', label: '赛局交流', desc: '鼓励、道歉、礼貌表达' },
  { id: 'technical', label: '网络状态', desc: '延迟、掉线' }
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
      <section className="hero panel">
        <div className="eyebrow">Summoner's Rift Voice Guide</div>
        <h1>LoL Comms Guide</h1>
        <p className="subtitle">英雄联盟语音沟通中英对照表，适合开黑、组排和临场指挥。</p>
        <div className="hero-meta">
          <span>{items.length} 条语音表达</span>
          <span>中文 / English</span>
          <span>Fan-made</span>
        </div>
      </section>

      <section className="toolbar panel">
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
        <section className="panel empty">没有找到匹配词条。试试搜索：flash、dragon、撤退、开团。</section>
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
