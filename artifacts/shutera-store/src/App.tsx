import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown,
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
} from 'wouter';

const queryClient = new QueryClient();

type Product = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  tone: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 's1',
    name: 'S1 / 35 mm',
    eyebrow: 'Bezzrkadlovka',
    description: 'Ticho, ktoré vidí všetko.',
    price: '2 490 €',
    category: 'Fotoaparáty',
    image: '/shutera-hero.png',
    tone: 'ice',
    tag: 'Novinka',
  },
  {
    id: 'v4',
    name: 'V4 / Cinema',
    eyebrow: 'Videokamera',
    description: 'Pohyb bez kompromisov.',
    price: '3 890 €',
    category: 'Videokamery',
    tone: 'midnight',
    tag: 'Pre film',
  },
  {
    id: 'l85',
    name: 'L85 / 1.4',
    eyebrow: 'Portrétny objektív',
    description: 'Svetlo v presnom bode.',
    price: '1 190 €',
    category: 'Objektívy',
    image: '/shutera-lens.png',
    tone: 'slate',
  },
];

function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Všetko');
  const [notice, setNotice] = useState('');

  const filteredProducts = useMemo(() => {
    const byCategory =
      selectedCategory === 'Všetko'
        ? products
        : products.filter((product) => product.category === selectedCategory);
    if (!query.trim()) return byCategory;
    return byCategory.filter((product) =>
      `${product.name} ${product.eyebrow} ${product.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart((current) => [...current, product.id]);
    setNotice(`${product.name} je v košíku`);
    setCartOpen(true);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
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
              ['Príslušenstvo', 'club'],
              ['SHUTERA CLUB', 'club'],
              ['Predajňe', 'stores'],
            ].map(([label, target]) => (
              <button
                type="button"
                data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
                key={label}
                onClick={() => scrollTo(target)}
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
            <span className="mono-font">SCROLL TO EXPLORE</span>
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
            <div className="filter-row">
              {['Všetko', 'Fotoaparáty', 'Videokamery', 'Objektívy'].map((filter) => (
                <button
                  type="button"
                  data-testid={`button-filter-${filter.toLowerCase()}`}
                  key={filter}
                  className={`filter-pill ${selectedCategory === filter ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(filter)}
                >
                  {filter}
                </button>
              ))}
              <span className="filter-count mono-font">{filteredProducts.length.toString().padStart(2, '0')} položky</span>
            </div>
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <article className={`product-card product-${index + 1} tone-${product.tone}`} key={product.id} data-testid={`card-product-${product.id}`}>
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
                    <span className="product-index mono-font">0{index + 1}</span>
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                    <button
                      type="button"
                      data-testid={`button-quick-add-${product.id}`}
                      className="quick-add"
                      aria-label={`Pridať ${product.name} do košíka`}
                      onClick={() => addToCart(product)}
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
                </article>
              ))}
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
                <span className="mono-font">MADE IN SLOVAKIA</span>
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
              <button type="button" data-testid="button-join-club" className="light-cta" onClick={() => setNotice('Vitajte v poradovníku SHUTERA CLUB')}>
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
            {query && filteredProducts.map((product) => <button type="button" data-testid={`button-search-result-${product.id}`} key={product.id} onClick={() => { setSearchOpen(false); scrollTo('products'); }}><span>{product.name}</span><ArrowRight size={15} /></button>)}
            {!query && <><span className="result-label">Skúste napríklad</span><button type="button" data-testid="button-search-s1" onClick={() => setQuery('S1')}>S1 / 35 mm <ArrowRight size={15} /></button><button type="button" data-testid="button-search-club" onClick={() => { setSearchOpen(false); scrollTo('club'); }}>SHUTERA CLUB <ArrowRight size={15} /></button></>}
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
            <><div className="cart-list">{cartItems.map((product, index) => <div className="cart-item" key={`${product.id}-${index}`}><div className={`cart-thumb tone-${product.tone}`}>{product.image && <img src={product.image} alt="" />}</div><div><strong>{product.name}</strong><span>{product.price}</span></div><button type="button" data-testid={`button-remove-${product.id}-${index}`} aria-label={`Odstrániť ${product.name}`} onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Minus size={14} /></button></div>)}</div><div className="cart-summary"><span>Medzisúčet</span><strong>{cartItems.reduce((total, product) => total + Number(product.price.replace(/\s|€/g, '').replace(',', '.')), 0).toLocaleString('sk-SK')} €</strong><button type="button" data-testid="button-checkout" className="primary-cta full-width" onClick={() => setNotice('Pokladňa bude dostupná čoskoro')}>Pokračovať k objednávke <ArrowRight size={17} /></button></div></>
          )}
        </aside>
      )}
      {notice && <div className="toast-notice" role="status" data-testid="status-notice"><Check size={16} /> {notice}</div>}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
