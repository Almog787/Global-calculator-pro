const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/AllCalculators.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add state for PWA collapse
content = content.replace(
  'const { categoryId } = useParams<{ categoryId: string }>();\n  const navigate = useNavigate();',
  `const { categoryId } = useParams<{ categoryId: string }>();\n  const navigate = useNavigate();\n\n  const [isPwaPromoCollapsed, setIsPwaPromoCollapsed] = useState(false);\n\n  useEffect(() => {\n    const hiddenUntil = localStorage.getItem("pwaPromoHiddenUntil");\n    if (hiddenUntil && parseInt(hiddenUntil, 10) > Date.now()) {\n      setIsPwaPromoCollapsed(true);\n    }\n  }, []);\n\n  const handleCollapsePwa = (e: React.MouseEvent) => {\n    e.stopPropagation();\n    setIsPwaPromoCollapsed(true);\n    localStorage.setItem("pwaPromoHiddenUntil", (Date.now() + 24 * 60 * 60 * 1000).toString());\n  };\n\n  const handleExpandPwa = () => {\n    setIsPwaPromoCollapsed(false);\n    localStorage.setItem("pwaPromoHiddenUntil", "0");\n  };\n`
);

// Replace PWA Promo banner section
const pwaOriginal = `{/* PWA Promotion Banner */}
      <section className="mb-stack-lg bg-surface-container-lowest text-on-surface rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md border-2 border-secondary/20 hover:border-secondary/40 transition-colors relative overflow-hidden">
        {/* Background Decoration */}`;

const pwaReplacement = `{/* PWA Promotion Banner */}
      {isPwaPromoCollapsed ? (
        <section 
          className="mb-stack-lg bg-surface-container-lowest text-on-surface rounded-2xl p-4 flex items-center justify-between shadow-sm border border-outline-variant hover:border-secondary transition-colors cursor-pointer" 
          onClick={handleExpandPwa}
          title={t.dir === 'rtl' ? 'הרחב' : 'Expand'}
        >
           <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-secondary text-2xl">apps</span>
             <h2 className="font-headline-sm text-primary m-0 text-sm md:text-base">{t.pwaPromoTitle}</h2>
           </div>
           <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </section>
      ) : (
      <section className="mb-stack-lg bg-surface-container-lowest text-on-surface rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md border-2 border-secondary/20 hover:border-secondary/40 transition-colors relative overflow-hidden">
        <button 
          onClick={handleCollapsePwa}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container-highest text-on-surface-variant transition-colors border border-outline-variant shadow-sm cursor-pointer"
          title={t.dir === 'rtl' ? 'צמצם' : 'Collapse'}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        {/* Background Decoration */}`;

content = content.replace(pwaOriginal, pwaReplacement);

// Add closing parenthesis to the PWA Promo banner conditional
const pwaEndOriginal = `          </div>
        </div>
      </section>

      {/* Category Filters */}`;

const pwaEndReplacement = `          </div>
        </div>
      </section>
      )}

      {/* Category Filters */}`;

content = content.replace(pwaEndOriginal, pwaEndReplacement);

fs.writeFileSync(file, content);
console.log('patched');
