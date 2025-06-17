export const AGENT_CATEGORIES = [
  { id: "all", label: "All Agents" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
] as const;

export const GRADIENT_CLASSES = {
  "neon-purple": "from-purple-500",
  "cyber-cyan": "to-cyan-500",
  "mint-green": "from-green-500",
  "electric-blue": "to-blue-500",
} as const;

export const ICON_MAP = {
  "fas fa-envelope": "Mail",
  "fas fa-cloud": "Cloud",
  "fas fa-receipt": "Receipt",
  "fas fa-search": "Search",
  "fas fa-share-alt": "Share",
  "fas fa-calendar": "Calendar",
  "fas fa-database": "Database",
  "fas fa-heartbeat": "Heart",
} as const;
