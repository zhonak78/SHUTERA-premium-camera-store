import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleUserRound,
  Headphones,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Route,
  Switch,
  Router as WouterRouter,
  useLocation,
  useParams,
} from 'wouter';

const queryClient = new QueryClient();

type Product = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  category: string;
  group: string;
  image?: string;
  tone: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 'alpha1',
    name: 'SHUTERA α1',
    eyebrow: 'Fotoaparát',
    description: 'Čistý prvý záber, každý deň.',
    price: '449 €',
    category: 'Fotoaparáty',
    group: 'Fotoaparáty s kvalitnými uzávierkami',
    tone: 'ice',
    tag: 'Dostupný vstup',
  },
  {
    id: 's1',
    name: 'SHUTERA S1',
    eyebrow: 'Fotoaparát',
    description: 'Ticho, ktoré vidí všetko.',
    price: '999 €',
    category: 'Fotoaparáty',
    group: 'Fotoaparáty s kvalitnými uzávierkami',
    image: '/shutera-hero.png',
    tone: 'ice',
    tag: 'Novinka',
  },
  {
    id: 'p1',
    name: 'SHUTERA P1',
    eyebrow: 'Fotoaparát',
    description: 'Presnosť v kompaktnom tele.',
    price: '669 €',
    category: 'Fotoaparáty',
    group: 'Fotoaparáty s kvalitnými uzávierkami',
    tone: 'midnight',
    tag: 'Novinka',
  },
  {
    id: 'x1',
    name: 'SHUTERA X1',
    eyebrow: 'Profesionálny fotoaparát',
    description: 'Nástroj pre scény, ktoré nemajú druhý pokus.',
    price: '1 499 €',
    category: 'Profesionálne fotoaparáty',
    group: 'Profesionálne fotoaparáty',
    tone: 'midnight',
    tag: 'Pro systém',
  },
  {
    id: 'z1',
    name: 'SHUTERA Z1',
    eyebrow: 'Profesionálny fotoaparát',
    description: 'Dlhý deň. Jediný presný moment.',
    price: '1 299 €',
    category: 'Profesionálne fotoaparáty',
    group: 'Profesionálne fotoaparáty',
    tone: 'slate',
  },
  {
    id: 'v1',
    name: 'SHUTERA V1',
    eyebrow: 'Videokamera',
    description: 'Pohyb bez kompromisov.',
    price: '2 199 €',
    category: 'Videokamery',
    group: 'Videokamery',
    tone: 'midnight',
    tag: 'Pre film',
  },
  {
    id: 'v1-pro',
    name: 'SHUTERA V1 PRO',
    eyebrow: 'Videokamera',
    description: 'Kino v každom svetle.',
    price: '2 999 €',
    category: 'Videokamery',
    group: 'Videokamery',
    tone: 'ice',
    tag: 'Pro systém',
  },
  {
    id: 'tripods',
    name: 'Statívy',
    eyebrow: 'Príslušenstvo',
    description: 'Stabilita, ktorú cítite v obraze.',
    price: '189 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'slate',
  },
  {
    id: 'bags',
    name: 'Tašky a batohy',
    eyebrow: 'Príslušenstvo',
    description: 'Premyslený priestor pre vašu zostavu.',
    price: '149 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'midnight',
  },
  {
    id: 'lenses',
    name: 'Objektívy',
    eyebrow: 'Príslušenstvo',
    description: 'Svetlo v presnom bode.',
    price: '599 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    image: '/shutera-lens.png',
    tone: 'slate',
  },
  {
    id: 'cards',
    name: 'Pamäťové karty',
    eyebrow: 'Príslušenstvo',
    description: 'Každý frame bezpečne uložený.',
    price: '79 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'ice',
  },
  {
    id: 'drives',
    name: 'Externé disky',
    eyebrow: 'Príslušenstvo',
    description: 'Vaše zábery. V bezpečí a poriadku.',
    price: '239 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'midnight',
  },
  {
    id: 'batteries',
    name: 'Batérie',
    eyebrow: 'Príslušenstvo',
    description: 'Viac energie pre dlhší príbeh.',
    price: '69 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'slate',
  },
  {
    id: 'chargers',
    name: 'Nabíjačky',
    eyebrow: 'Príslušenstvo',
    description: 'Pripravené skôr, než príde moment.',
    price: '89 €',
    category: 'Príslušenstvo',
    group: 'Príslušenstvo',
    tone: 'ice',
  },
];

const categoryNav = [
  'Fotoaparáty',
  'Profesionálne fotoaparáty',
  'Videokamery',
  'Príslušenstvo',
] as const;

const detailSections = [
  ['Hlavné vlastnosti', 'Všetko dôležité zostáva na dosah ruky.'],
  ['Technické parametre', 'Senzor, rýchlosť a výdrž navrhnuté pre váš rytmus.'],
  ['Dizajn', 'Každá hrana má svoj dôvod. Každý povrch svoj dotyk.'],
  ['Uzávierka', 'Tichá, presná a pripravená na rozhodujúci okamih.'],
  ['Obrazová kvalita', 'Prirodzené svetlo, jemné detaily a čistá kresba.'],
] as const;

type CartContextValue = {
  cart: string[];
  addItem: (id: string) => void;
  removeItem: (index: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('Košík musí byť použitý v CartProvider');
  return context;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const value = {
    cart,
    addItem: (id: string) => setCart((current) => [...current, id]),
    removeItem: (index: number) =>
      setCart((current) => current.filter((_, itemIndex) => itemIndex !== index)),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Všetko');
  const [notice, setNotice] = useState('');
  const [, setLocation] = useLocation();
  const { cart, addItem, removeItem } = useCart();

  const filteredProducts = useMemo(() => {
    const byCategory =
      selectedCategory === 'Všetko'
        ? products
        : products.filter((product) => product.category === selectedCategory);
    if (!query.trim()) return byCategory;
    return products.filter((product) =>
      `${product.name} ${product.eyebrow} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query, selectedCategory]);

  const addToCart = (product: Product) => {
    addItem(product.id);
    setNotice(`${product.name} je v košíku`);
    setCartOpen(true);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const openProduct = (product: Product) => {
    setLocation(`/produkt/${product.id}`);
  };

  useEffect(() => {
    document.body.style.overflow = searchOpen || accountOpen || cartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [accountOpen, cartOpen, searchOpen]);

  const cartItems = cart
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="noise min-h-[100dvh] overflow-x-hidden bg-[#f5f8fa] text-[#1d252e]">
      <header className="site-header fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            data-testid="button-menu"
            className="mobile-menu-trigger rounded-full border border-[#d8e0e6] bg-[#f5f8fa]/80 p-2.5 backdrop-blur-md lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Otvoriť menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            type="button"
            data-testid="button-logo"
            onClick={() => scrollTo('top')}
            className="display-font text-[20px] font-bold tracking-[0.22em] text-[#18212b]"
          >
            SHUTERA<span className="text-[#8bb4ed]">.</span>
          </button>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Hlavná navigácia">
            {[
              ['Fotoaparáty', 'products'],
              ['Videokamery', 'products'],
              ['Objektívy', 'products'],
              ['Príslušenstvo', 'products'],
              ['SHUTERA CLUB', 'club-page'],
              ['Predajňe', 'stores'],
            ].map(([label, target]) => (
              <button
                type="button"
                data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                key={label}
                onClick={() => {
                  setMenuOpen(false);
                  if (target === 'club-page') {
                    setLocation('/club');
                  } else {
                    scrollTo(target);
                  }
                }}
                className="nav-link"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              data-testid="button-search"
              className="icon-button"
              aria-label="Vyhľadávanie"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              data-testid="button-account"
              className="icon-button desktop-action"
              aria-label="Účet"
              onClick={() => setAccountOpen(true)}
            >
              <CircleUserRound size={19} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              data-testid="button-cart"
              className="cart-button"
              aria-label="Košík"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span>Košík</span>
              {cart.length > 0 && <b>{cart.length}</b>}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-8 px-5 pb-10 pt-32 sm:px-8 lg:grid-cols-[.88fr_1.12fr] lg:px-12 lg:pb-14 lg:pt-28">
            <div className="relative z-10 max-w-[570px]">
              <div className="animate-rise mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#708090]">
                <span className="h-px w-8 bg-[#8bb4ed]" />
                Bratislava / 2024
              </div>
              <h1 className="display-font animate-rise delay-1 text-balance text-[clamp(3.6rem,8.8vw,8.25rem)] font-medium leading-[.87] tracking-[-.075em] text-[#1b242e]">
                Zachyť
                <br />
                <span className="font-light text-[#8191a1]">moment.</span>
              </h1>
              <p className="animate-rise delay-2 mt-9 max-w-[360px] text-[15px] leading-7 text-[#667482]">
                Spojenie technológie a dokonalého záberu.
              </p>
              <div className="animate-rise delay-3 mt-10 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  data-testid="button-explore"
                  onClick={() => scrollTo('products')}
                  className="primary-cta"
                >
                  Objaviť kolekciu <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  data-testid="button-story"
                  onClick={() => scrollTo('story')}
                  className="text-cta"
                >
                  Náš príbeh <ArrowDown size={15} />
                </button>
              </div>
            </div>
            <div className="hero-visual animate-rise delay-2">
              <div className="hero-image-wrap">
                <img src="/shutera-hero.png" alt="SHUTERA S1 bezzrkadlovka v štúdiu" />
                <div className="hero-image-wash" />
                <div className="hero-spec mono-font">
                  <span>SH / S1</span>
                  <span>35.0 mm</span>
                </div>
                <div className="hero-orbit" aria-hidden="true" />
              </div>
              <div className="hero-caption">
                <span>Nový systém S</span>
                <span className="mono-font">01 — 04</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            data-testid="button-scroll"
            className="hero-scroll"
            onClick={() => scrollTo('products')}
            aria-label="Prejsť na produkty"
          >
            <span className="mono-font">POSUŇTE PRE OBJAVENIE</span>
            <ArrowDown size={15} />
          </button>
        </section>

        <section id="products" className="products-section page-section">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Kolekcia / 01</span>
                <h2 className="display-font section-title">Nástroje<br /><em>pre okamih.</em></h2>
              </div>
              <p className="section-intro">Vybrané systémy pre obraz, ktorý má zostať. Navrhnuté v Bratislave, pripravené na svetlo kdekoľvek.</p>
            </div>
            <div className="catalog-nav" aria-label="Kategórie produktov">
              <button type="button" data-testid="button-category-all" className={`catalog-nav-item ${selectedCategory === 'Všetko' ? 'is-active' : ''}`} onClick={() => { setSelectedCategory('Všetko'); scrollTo('products'); }}>
                Všetko
              </button>
              {categoryNav.map((filter) => (
                <button
                  type="button"
                  data-testid={`button-category-${filter.toLowerCase().replaceAll(' ', '-')}`}
                  key={filter}
                  className={`catalog-nav-item ${selectedCategory === filter ? 'is-active' : ''}`}
                  onClick={() => { setSelectedCategory(filter); scrollTo(`category-${filter}`); }}
                >
                  {filter}
                </button>
              ))}
              <span className="filter-count mono-font">{filteredProducts.length.toString().padStart(2, '0')} produkty</span>
            </div>
            <div className="catalog-groups">
              {[
                'Fotoaparáty s kvalitnými uzávierkami',
                'Profesionálne fotoaparáty',
                'Videokamery',
                'Príslušenstvo',
              ].map((group, groupIndex) => {
                const groupProducts = filteredProducts.filter((product) => product.group === group);
                if (groupProducts.length === 0) return null;
                return (
                  <section className="catalog-group" id={`category-${group === 'Fotoaparáty s kvalitnými uzávierkami' ? 'Fotoaparáty' : group}`} key={group}>
                    <div className="group-heading">
                      <span className="section-kicker">Kolekcia / 0{groupIndex + 1}</span>
                      <h3 className="display-font">{group}</h3>
                      <span className="mono-font group-count">{groupProducts.length.toString().padStart(2, '0')}</span>
                    </div>
                    <div className={`product-grid ${groupProducts.length === 2 ? 'two-up' : ''}`}>
                      {groupProducts.map((product, index) => (
                        <article
                          className={`product-card product-${index + 1} tone-${product.tone}`}
                          key={product.id}
                          data-testid={`card-product-${product.id}`}
                          role="link"
                          tabIndex={0}
                          onClick={() => openProduct(product)}
                          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openProduct(product); }}
                        >
                          <div className="product-art">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <div className={`abstract-camera abstract-${product.id}`} aria-hidden="true">
                                <div className="abstract-body" />
                                <div className="abstract-lens"><span /></div>
                                <div className="abstract-screen" />
                              </div>
                            )}
                            <span className="product-index mono-font">{(index + 1).toString().padStart(2, '0')}</span>
                            {product.tag && <span className="product-tag">{product.tag}</span>}
                            <button
                              type="button"
                              data-testid={`button-quick-add-${product.id}`}
                              className="quick-add"
                              aria-label={`Pridať ${product.name} do košíka`}
                              onClick={(event) => { event.stopPropagation(); addToCart(product); }}
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <div className="product-info">
                            <div>
                              <span className="product-eyebrow">{product.eyebrow}</span>
                              <h3 className="display-font">{product.name}</h3>
                              <p>{product.description}</p>
                            </div>
                            <strong>{product.price}</strong>
                          </div>
                          <div className="product-actions">
                            <button type="button" data-testid={`button-detail-${product.id}`} onClick={(event) => { event.stopPropagation(); openProduct(product); }}>Zistiť viac <ArrowRight size={14} /></button>
                            <button type="button" data-testid={`button-buy-${product.id}`} onClick={(event) => { event.stopPropagation(); addToCart(product); }}>Kúpiť <ShoppingBag size={14} /></button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
            <div className="catalog-link-row">
              <button type="button" data-testid="button-full-catalog" onClick={() => setNotice('Celý katalóg pripravujeme')} className="text-cta">
                Zobraziť celý katalóg <ArrowRight size={15} />
              </button>
              <span className="mono-font">SYSTÉM / 2024</span>
            </div>
          </div>
        </section>

        <section id="story" className="story-section page-section">
          <div className="story-glow" />
          <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-24 lg:px-12">
            <div className="story-copy">
              <span className="section-kicker">Prečo SHUTERA / 02</span>
              <h2 className="display-font section-title">Menej<br /><em>medzi vami</em><br />a záberom.</h2>
              <p>Veríme v technológiu, ktorá sa stratí v správnej chvíli. Každé koliesko, tlačidlo aj optický člen má svoj dôvod — aby ste boli bližšie tomu, čo chcete vidieť.</p>
              <button type="button" data-testid="button-about" className="primary-cta" onClick={() => setNotice('Príbeh SHUTERA už čoskoro')}>
                Spoznajte SHUTERA <ArrowRight size={17} />
              </button>
            </div>
            <div className="story-panel">
              <div className="story-panel-top">
                <span className="mono-font">DETAIL / 0027</span>
                <Sparkles size={17} />
              </div>
              <div className="story-circle"><span>SH</span></div>
              <div className="story-panel-bottom">
                <span>Precízne vnútri.</span>
                <span className="mono-font">VYROBENÉ NA SLOVENSKU</span>
              </div>
            </div>
          </div>
        </section>

        <section id="club" className="club-section page-section">
          <div className="club-layout mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="club-sign mono-font">SH / CLUB <span>∞</span></div>
            <div className="club-copy">
              <span className="section-kicker">SHUTERA CLUB / 03</span>
              <h2 className="display-font">Nie ste na to<br /><em>sami.</em></h2>
              <p>Stretnutia, skorý prístup a priestor pre otázky, ktoré sa nezmestia do manuálu.</p>
              <button type="button" data-testid="button-join-club" className="light-cta" onClick={() => setLocation('/club')}>
                Pridať sa do klubu <ArrowRight size={17} />
              </button>
            </div>
            <div className="club-details">
              <div><span className="mono-font">01</span><p>Lokálne workshopy</p></div>
              <div><span className="mono-font">02</span><p>Poradenstvo od tvorcov</p></div>
              <div><span className="mono-font">03</span><p>Prvé zábery novej techniky</p></div>
            </div>
          </div>
        </section>

        <section id="stores" className="stores-section page-section">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="section-heading compact">
              <div>
                <span className="section-kicker">Nájdite nás / 04</span>
                <h2 className="display-font section-title">Príďte sa<br /><em>dotknúť.</em></h2>
              </div>
              <div className="store-select">
                <span>Vyberte predajňu</span><ChevronDown size={16} />
              </div>
            </div>
            <div className="store-card">
              <div className="store-map" aria-label="Mapa predajne SHUTERA v Bratislave">
                <div className="map-grid" />
                <div className="map-route route-one" />
                <div className="map-route route-two" />
                <div className="map-pin"><span /></div>
                <span className="map-label mono-font">SHUTERA / BRATISLAVA</span>
              </div>
              <div className="store-info">
                <span className="mono-font">SK — 01</span>
                <h3 className="display-font">Bratislava<br /><em>centrum</em></h3>
                <p>Michalská 12<br />811 01 Bratislava</p>
                <div className="store-meta"><span>Po — So</span><strong>10:00 — 19:00</strong></div>
                <button type="button" data-testid="button-store-details" className="text-cta" onClick={() => setNotice('Navigácia do predajne bude čoskoro dostupná')}>
                  Detaily predajne <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <span className="section-kicker">SHUTERA / 05</span>
            <h2 className="display-font">Ďalší záber<br /><em>začína tu.</em></h2>
            <button type="button" data-testid="button-closing-explore" className="primary-cta" onClick={() => scrollTo('products')}>Preskúmať kolekciu <ArrowRight size={17} /></button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="footer-top">
            <button type="button" data-testid="button-footer-logo" onClick={() => scrollTo('top')} className="display-font footer-logo">SHUTERA<span>.</span></button>
            <p>Spojenie technológie<br />a dokonalého záberu.</p>
            <button type="button" data-testid="button-support" className="footer-support" onClick={() => setNotice('Napíšte nám na hello@shutera.sk')}><Headphones size={16} /> Potrebujete poradiť?</button>
          </div>
          <div className="footer-bottom"><span>© 2024 SHUTERA, s.r.o.</span><span>Slovensko / EUR</span><span>Instagram&nbsp;&nbsp; Vimeo</span></div>
        </div>
      </footer>

      {(searchOpen || accountOpen || cartOpen) && <div className="overlay" onClick={() => { setSearchOpen(false); setAccountOpen(false); setCartOpen(false); }} />}
      {searchOpen && (
        <aside className="side-panel search-panel" aria-label="Vyhľadávanie">
          <div className="panel-header"><span className="mono-font">VYHĽADÁVANIE</span><button type="button" data-testid="button-close-search" onClick={() => setSearchOpen(false)}><X size={20} /></button></div>
          <div className="search-input-wrap"><Search size={20} /><input autoFocus data-testid="input-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Čo hľadáte?" /></div>
          <div className="search-results">
            {query && filteredProducts.length === 0 && <p className="empty-result">Nič sme nenašli. Skúste iný výraz.</p>}
            {query && filteredProducts.map((product) => <button type="button" data-testid={`button-search-result-${product.id}`} key={product.id} onClick={() => { setSearchOpen(false); setLocation(`/produkt/${product.id}`); }}><span>{product.name}</span><ArrowRight size={15} /></button>)}
            {!query && <><span className="result-label">Skúste napríklad</span><button type="button" data-testid="button-search-s1" onClick={() => setQuery('S1')}>SHUTERA S1 <ArrowRight size={15} /></button><button type="button" data-testid="button-search-club" onClick={() => { setSearchOpen(false); setLocation('/club'); }}>SHUTERA CLUB <ArrowRight size={15} /></button></>}
          </div>
        </aside>
      )}
      {accountOpen && (
        <aside className="side-panel account-panel" aria-label="Účet">
          <div className="panel-header"><span className="mono-font">ÚČET</span><button type="button" data-testid="button-close-account" onClick={() => setAccountOpen(false)}><X size={20} /></button></div>
          <CircleUserRound size={43} strokeWidth={1.2} className="panel-icon" />
          <h2 className="display-font">Vitajte v<br /><em>SHUTERA.</em></h2>
          <p>Uložte si obľúbené produkty, objednávky a nastavenia na jednom mieste.</p>
          <button type="button" data-testid="button-account-login" className="primary-cta full-width" onClick={() => setNotice('Prihlásenie bude dostupné čoskoro')}>Prihlásiť sa <ArrowRight size={17} /></button>
          <button type="button" data-testid="button-account-register" className="text-cta full-width center" onClick={() => setNotice('Registrácia bude dostupná čoskoro')}>Vytvoriť účet</button>
        </aside>
      )}
      {cartOpen && (
        <aside className="side-panel cart-panel" aria-label="Košík">
          <div className="panel-header"><span className="mono-font">KOŠÍK / {cart.length.toString().padStart(2, '0')}</span><button type="button" data-testid="button-close-cart" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
          {cartItems.length === 0 ? (
            <div className="cart-empty"><ShoppingBag size={37} strokeWidth={1.2} /><h2 className="display-font">Zatiaľ je prázdny.</h2><p>Vyberte si nástroj, ktorý vás vezme ďalej.</p><button type="button" data-testid="button-empty-explore" className="primary-cta" onClick={() => { setCartOpen(false); scrollTo('products'); }}>Objaviť kolekciu <ArrowRight size={17} /></button></div>
          ) : (
             <><div className="cart-list">{cartItems.map((product, index) => <div className="cart-item" key={`${product.id}-${index}`}><div className={`cart-thumb tone-${product.tone}`}>{product.image && <img src={product.image} alt="" />}</div><div><strong>{product.name}</strong><span>{product.price}</span></div><button type="button" data-testid={`button-remove-${product.id}-${index}`} aria-label={`Odstrániť ${product.name}`} onClick={() => removeItem(index)}><Minus size={14} /></button></div>)}</div><div className="cart-summary"><span>Medzisúčet</span><strong>{cartItems.reduce((total, product) => total + Number(product.price.replace(/\s|€/g, '').replace(',', '.')), 0).toLocaleString('sk-SK')} €</strong><button type="button" data-testid="button-checkout" className="primary-cta full-width" onClick={() => setNotice('Pokladňa bude dostupná čoskoro')}>Pokračovať k objednávke <ArrowRight size={17} /></button></div></>
          )}
        </aside>
      )}
      {notice && <div className="toast-notice" role="status" data-testid="status-notice"><Check size={16} /> {notice}</div>}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) return <NotFound />;

  const addProduct = () => {
    addItem(product.id);
    setNotice(`${product.name} je v košíku`);
    window.setTimeout(() => setNotice(''), 2600);
  };

  return (
    <div className="noise product-detail-page min-h-[100dvh] bg-[#f5f8fa] text-[#1d252e]">
      <header className="detail-header">
        <button type="button" data-testid="button-detail-logo" className="display-font detail-logo" onClick={() => setLocation('/')}>SHUTERA<span>.</span></button>
        <div className="detail-header-actions">
          <button type="button" data-testid="button-detail-catalog" className="detail-back" onClick={() => setLocation('/')}>← Späť na katalóg</button>
          <button type="button" data-testid="button-detail-cart" className="detail-bag" onClick={() => setLocation('/')}>Košík <ShoppingBag size={16} /></button>
        </div>
      </header>
      <main>
        <section className="detail-hero">
          <div className="detail-visual-wrap">
            <div className={`detail-visual tone-${product.tone}`}>
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className={`abstract-camera abstract-${product.id}`} aria-hidden="true">
                  <div className="abstract-body" />
                  <div className="abstract-lens"><span /></div>
                  <div className="abstract-screen" />
                </div>
              )}
              <span className="detail-visual-code mono-font">SH / {product.id.toUpperCase()}</span>
              <span className="detail-visual-mark">SH</span>
            </div>
            <div className="detail-visual-meta"><span>PRODUKT / 2024</span><span className="mono-font">01 — 01</span></div>
          </div>
          <div className="detail-hero-copy">
            <span className="section-kicker">{product.eyebrow} / SHUTERA</span>
            <h1 className="display-font">{product.name}</h1>
            <p className="detail-lead">Objavte {product.name}</p>
            <p className="detail-description">{product.description} Precízny nástroj pre obraz, ktorý má zostať s vami aj po tom, čo okamih prejde.</p>
            <div className="detail-purchase">
              <strong>{product.price}</strong>
              <button type="button" data-testid={`button-detail-buy-${product.id}`} className="primary-cta" onClick={addProduct}>Kúpiť <ShoppingBag size={16} /></button>
            </div>
            <div className="detail-delivery"><Check size={15} /> Dostupné online <span /> Bezpečná doprava na Slovensko</div>
          </div>
        </section>

        <section className="detail-overview">
          <div className="detail-overview-heading">
            <span className="section-kicker">V centre pozornosti</span>
            <h2 className="display-font">Presný nástroj.<br /><em>Správny pocit.</em></h2>
          </div>
          <div className="detail-feature-list">
            {detailSections.map(([title, copy], index) => (
              <div className="detail-feature" key={title}>
                <span className="mono-font">0{index + 1}</span>
                <div><h3 className="display-font">{title}</h3><p>{copy}</p></div>
                <ArrowRight size={17} />
              </div>
            ))}
          </div>
        </section>

        <section className="detail-gallery">
          <div className="detail-gallery-intro">
            <span className="section-kicker">Galéria</span>
            <h2 className="display-font">Váš pohľad,<br /><em>vaše pravidlá.</em></h2>
          </div>
          <div className="gallery-frame gallery-frame-large"><div className={`gallery-art gallery-${product.tone}`}><span className="mono-font">{product.name} / 01</span></div></div>
          <div className="gallery-frame gallery-frame-small"><div className={`gallery-art gallery-${product.tone} alt`}><span className="mono-font">DETAIL / 02</span></div></div>
        </section>

        <section className="detail-comparison">
          <div><span className="section-kicker">Porovnanie</span><h2 className="display-font">Nájdite svoj<br /><em>ďalší záber.</em></h2></div>
          <div className="comparison-row">
            {products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 2).map((other) => (
              <button type="button" data-testid={`button-compare-${other.id}`} className="comparison-item" key={other.id} onClick={() => setLocation(`/produkt/${other.id}`)}>
                <span className={`comparison-dot tone-${other.tone}`} />
                <span><strong>{other.name}</strong><small>{other.price}</small></span>
                <ArrowRight size={16} />
              </button>
            ))}
            {products.filter((item) => item.category === product.category && item.id !== product.id).length === 0 && <p className="comparison-empty">Ďalšie modely pre túto kategóriu pripravujeme.</p>}
          </div>
        </section>
        <section className="detail-bottom-cta">
          <span className="section-kicker">SHUTERA / {product.id.toUpperCase()}</span>
          <h2 className="display-font">Pripravený na<br /><em>váš moment?</em></h2>
          <button type="button" data-testid={`button-detail-bottom-buy-${product.id}`} className="primary-cta" onClick={addProduct}>Kúpiť {product.name} <ArrowRight size={17} /></button>
        </section>
      </main>
      <footer className="site-footer detail-footer"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="footer-bottom"><span>© 2024 SHUTERA, s.r.o.</span><button type="button" onClick={() => setLocation('/')} data-testid="button-detail-footer-back">Späť na katalóg</button><span>Slovensko / EUR</span></div></div></footer>
      {notice && <div className="toast-notice" role="status" data-testid="status-detail-notice"><Check size={16} /> {notice}</div>}
    </div>
  );
}

function ClubPage() {
  const [, setLocation] = useLocation();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const joinClub = () => {
    setNotice('Vitajte v poradovníku SHUTERA CLUB');
    window.setTimeout(() => setNotice(''), 2600);
  };

  return (
    <div className="noise club-page min-h-[100dvh] bg-[#f5f8fa] text-[#1d252e]">
      <header className="club-page-header">
        <button type="button" className="display-font club-page-logo" data-testid="button-club-logo" onClick={() => setLocation('/')}>
          SHUTERA<span>.</span>
        </button>
        <div className="club-page-header-actions">
          <span className="mono-font">SH / CLUB</span>
          <button type="button" className="club-back-button" data-testid="button-club-back" onClick={() => setLocation('/')}>
            <ArrowLeft size={15} /> Späť na SHUTERA
          </button>
        </div>
      </header>

      <main>
        <section className="club-page-hero">
          <div className="club-page-hero-copy">
            <span className="section-kicker">Členstvo / 01</span>
            <h1 className="display-font">SHUTERA<br /><em>CLUB</em></h1>
            <p className="club-page-subtitle">Čím viac nakupujete, tým viac ušetríte.</p>
            <p className="club-page-intro">Staňte sa členom SHUTERA CLUB a získajte špeciálne výhody, zľavy a ponuky.</p>
            <button type="button" className="primary-cta" data-testid="button-club-join-hero" onClick={joinClub}>
              Stať sa členom <ArrowRight size={17} />
            </button>
          </div>
          <div className="club-page-hero-art" aria-hidden="true">
            <div className="club-orbit club-orbit-one" />
            <div className="club-orbit club-orbit-two" />
            <div className="club-orbit club-orbit-three" />
            <div className="club-orbit-core"><span>SH</span></div>
            <span className="club-art-label club-art-label-top mono-font">MEMBERSHIP / 001</span>
            <span className="club-art-label club-art-label-bottom mono-font">ACCESS TO MORE</span>
          </div>
        </section>

        <section id="club-levels" className="club-levels-section">
          <div className="club-page-section-heading">
            <div>
              <span className="section-kicker">Členské úrovne / 02</span>
              <h2 className="display-font">Viac členstva.<br /><em>Viac pre vás.</em></h2>
            </div>
            <p>Každý nákup vás posúva bližšie k výhodám, ktoré dávajú technológii ešte väčší zmysel.</p>
          </div>
          <div className="club-levels-grid">
            <article className="club-level club-level-basic">
              <div className="club-level-top"><span className="mono-font">01 / BASIC</span><span className="club-level-dot" /></div>
              <div className="club-level-main"><h3 className="display-font">BASIC</h3><strong>5 %</strong><span>zľava</span></div>
              <p>po registrácii do SHUTERA CLUB</p>
              <ul><li>špeciálne ponuky</li><li>členské výhody</li></ul>
            </article>
            <article className="club-level club-level-pro">
              <div className="club-level-top"><span className="mono-font">02 / PRO</span><span className="club-level-dot" /></div>
              <div className="club-level-main"><h3 className="display-font">PRO</h3><strong>10 %</strong><span>zľava</span></div>
              <p>pri nákupoch nad 500 €</p>
              <ul><li>špeciálne ponuky</li><li>výhodnejšie ceny na vybrané produkty</li></ul>
            </article>
            <article className="club-level club-level-vip">
              <div className="club-level-top"><span className="mono-font">03 / VIP</span><span className="club-level-dot" /></div>
              <div className="club-level-main"><h3 className="display-font">VIP</h3><strong>15 %</strong><span>zľava</span></div>
              <p>pri nákupoch nad 1 500 €</p>
              <ul><li>VIP ponuky</li><li>prednostný prístup k novinkám</li><li>exkluzívne členské výhody</li></ul>
            </article>
          </div>
        </section>

        <section className="club-benefits-section">
          <div className="club-benefits-intro">
            <span className="section-kicker">Výhody SHUTERA CLUB / 03</span>
            <h2 className="display-font">Keď viete,<br /><em>čo hľadáte.</em></h2>
          </div>
          <div className="club-benefits-list">
            <div className="club-benefit"><span className="mono-font">01</span><div><h3 className="display-font">ČLENSKÉ ZĽAVY</h3><p>Získajte výhodnejšie ceny na vybrané produkty.</p></div><ArrowRight size={17} /></div>
            <div className="club-benefit"><span className="mono-font">02</span><div><h3 className="display-font">ŠPECIÁLNE PONUKY</h3><p>Ponuky dostupné iba pre členov SHUTERA CLUB.</p></div><ArrowRight size={17} /></div>
            <div className="club-benefit"><span className="mono-font">03</span><div><h3 className="display-font">NOVINKY AKO PRVÍ</h3><p>Prednostný prístup k novým produktom.</p></div><ArrowRight size={17} /></div>
            <div className="club-benefit"><span className="mono-font">04</span><div><h3 className="display-font">VIP VÝHODY</h3><p>Exkluzívne výhody pre najvernejších zákazníkov.</p></div><ArrowRight size={17} /></div>
          </div>
        </section>

        <section className="club-page-cta">
          <span className="section-kicker">SHUTERA CLUB / 04</span>
          <h2 className="display-font">Pripravení na<br /><em>viac?</em></h2>
          <p>Vstúpte do SHUTERA CLUB.</p>
          <button type="button" className="light-cta" data-testid="button-club-join-bottom" onClick={joinClub}>
            Stať sa členom <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="site-footer club-page-footer">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="footer-bottom"><span>© 2024 SHUTERA, s.r.o.</span><button type="button" onClick={() => setLocation('/')} data-testid="button-club-footer-back">Späť na katalóg</button><span>Slovensko / EUR</span></div>
        </div>
      </footer>
      {notice && <div className="toast-notice" role="status" data-testid="status-club-notice"><Check size={16} /> {notice}</div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/club" component={ClubPage} />
        <Route path="/produkt/:id" component={ProductDetail} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <CartProvider><Router /></CartProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
