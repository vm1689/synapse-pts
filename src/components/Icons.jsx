// Synapse - Icon Components

export const Check = ({ size = 16, className = "", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Pencil = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const Play = ({ size = 16, className = "", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const Download = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Send = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const CollapsePanelLeftIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

export const CollapsePanelRightIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

export const RefreshIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export const ChevronIcon = ({ size = 12, className = "", rotated = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} transition-transform ${rotated ? 'rotate-90' : ''}`}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const PlusIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ClockIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Tooltip = ({ children, label }) => (
  <div className="relative group">
    {children}
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </div>
  </div>
);

export const SynapseLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#7B61FF" />
    <polyline
      points="6,16 10,16 12,16 14,10 16,22 18,14 20,16 22,16 26,16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const BrowserDots = () => (
  <div className="flex items-center gap-1.5 mr-2">
    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
  </div>
);
