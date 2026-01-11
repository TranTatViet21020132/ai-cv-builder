import { SubscriptionLevel } from "./types";

/**
 * 🚧 DEVELOPMENT MODE - Set to true to unlock all templates
 * Remember to set this to false before deploying to production!
 */
export const UNLOCK_ALL_TEMPLATES =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_UNLOCK_ALL_TEMPLATES === "true";

/**
 * Template tier - determines which subscription level is required
 */
export type TemplateTier = "free" | "pro" | "pro_plus";

/**
 * Template layout types
 */
export type TemplateLayout = "single-column" | "two-column" | "creative";

/**
 * Template style characteristics
 */
export interface TemplateStyle {
  fontFamily: string;
  headingColor: string;
  accentColor: string;
  spacing: "compact" | "normal" | "relaxed";
}

/**
 * Template configuration interface
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  tier: TemplateTier;
  layout: TemplateLayout;
  preview: string;
  thumbnail: string;
  style: TemplateStyle;
  features: string[];
  recommended: string[];
}

/**
 * All available resume templates
 */
export const TEMPLATES: Record<string, Template> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with clean design",
    tier: "free",
    layout: "single-column",
    preview: "/templates/classic-preview.png",
    thumbnail: "/templates/classic-thumb.png",
    style: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      headingColor: "#1a202c",
      accentColor: "#3b82f6",
      spacing: "normal",
    },
    features: [
      "Single column layout",
      "Professional styling",
      "ATS-friendly",
      "Clean typography",
    ],
    recommended: [
      "Entry-level",
      "Traditional industries",
      "Conservative roles",
    ],
  },

  modern: {
    id: "modern",
    name: "Modern Professional",
    description:
      "Two-column layout with bold section headers and modern styling",
    tier: "pro",
    layout: "two-column",
    preview: "/templates/modern-preview.png",
    thumbnail: "/templates/modern-thumb.png",
    style: {
      fontFamily: "'Inter', system-ui, sans-serif",
      headingColor: "#0f172a",
      accentColor: "#6366f1",
      spacing: "normal",
    },
    features: [
      "Two-column design",
      "Bold section headers",
      "Modern typography",
      "Sidebar for skills",
    ],
    recommended: ["Tech industry", "Creative roles", "Modern companies"],
  },

  minimal: {
    id: "minimal",
    name: "Minimalist",
    description: "Clean and elegant with lots of whitespace",
    tier: "free",
    layout: "single-column",
    preview: "/templates/minimal-preview.png",
    thumbnail: "/templates/minimal-thumb.png",
    style: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      headingColor: "#1f2937",
      accentColor: "#10b981",
      spacing: "relaxed",
    },
    features: [
      "Generous whitespace",
      "Thin divider lines",
      "Elegant typography",
      "Monochrome design",
    ],
    recommended: ["Design roles", "Architecture", "Minimalist approach"],
  },

  creative: {
    id: "creative",
    name: "Creative Edge",
    description: "Unique layout with creative elements and vibrant colors",
    tier: "pro",
    layout: "creative",
    preview: "/templates/creative-preview.png",
    thumbnail: "/templates/creative-thumb.png",
    style: {
      fontFamily: "'Poppins', system-ui, sans-serif",
      headingColor: "#7c3aed",
      accentColor: "#ec4899",
      spacing: "normal",
    },
    features: [
      "Unique asymmetric layout",
      "Creative color scheme",
      "Eye-catching design",
      "Stand-out sections",
    ],
    recommended: ["Graphic design", "Marketing", "Creative industries"],
  },

  professional: {
    id: "professional",
    name: "Executive",
    description: "Sophisticated design for senior-level positions",
    tier: "pro_plus",
    layout: "two-column",
    preview: "/templates/professional-preview.png",
    thumbnail: "/templates/professional-thumb.png",
    style: {
      fontFamily: "'Georgia', serif",
      headingColor: "#1e293b",
      accentColor: "#0369a1",
      spacing: "normal",
    },
    features: [
      "Executive styling",
      "Sophisticated layout",
      "Premium typography",
      "Professional accents",
    ],
    recommended: ["Senior positions", "C-suite", "Executive roles"],
  },

  compact: {
    id: "compact",
    name: "Compact Pro",
    description: "Space-efficient design that fits more content",
    tier: "pro",
    layout: "two-column",
    preview: "/templates/compact-preview.png",
    thumbnail: "/templates/compact-thumb.png",
    style: {
      fontFamily: "'Roboto', system-ui, sans-serif",
      headingColor: "#374151",
      accentColor: "#059669",
      spacing: "compact",
    },
    features: [
      "Compact spacing",
      "Fits more content",
      "Organized sections",
      "Efficient layout",
    ],
    recommended: ["Extensive experience", "Multiple roles", "Academic CVs"],
  },

  elegant: {
    id: "elegant",
    name: "Elegant Serif",
    description: "Timeless design with serif fonts and refined styling",
    tier: "pro_plus",
    layout: "single-column",
    preview: "/templates/elegant-preview.png",
    thumbnail: "/templates/elegant-thumb.png",
    style: {
      fontFamily: "'Crimson Text', Georgia, serif",
      headingColor: "#44403c",
      accentColor: "#92400e",
      spacing: "relaxed",
    },
    features: [
      "Serif typography",
      "Refined aesthetics",
      "Classic elegance",
      "Timeless design",
    ],
    recommended: ["Legal", "Academia", "Publishing"],
  },

  tech: {
    id: "tech",
    name: "Tech Focus",
    description: "Developer-friendly with monospace accents and tech styling",
    tier: "pro",
    layout: "two-column",
    preview: "/templates/tech-preview.png",
    thumbnail: "/templates/tech-thumb.png",
    style: {
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      headingColor: "#1e3a8a",
      accentColor: "#2563eb",
      spacing: "normal",
    },
    features: [
      "Tech-oriented design",
      "Monospace accents",
      "Code-friendly",
      "Developer aesthetic",
    ],
    recommended: ["Software engineering", "DevOps", "Tech startups"],
  },
};

/**
 * Get all templates as an array
 */
export const getAllTemplates = (): Template[] => {
  return Object.values(TEMPLATES);
};

/**
 * Get templates available for a specific subscription tier
 */
export const getTemplatesByTier = (tier: TemplateTier): Template[] => {
  const tierHierarchy: Record<TemplateTier, TemplateTier[]> = {
    free: ["free"],
    pro: ["free", "pro"],
    pro_plus: ["free", "pro", "pro_plus"],
  };

  const allowedTiers = tierHierarchy[tier];
  return getAllTemplates().filter((template) =>
    allowedTiers.includes(template.tier),
  );
};

/**
 * Get templates available for a subscription level
 */
export const getTemplatesBySubscription = (
  subscriptionLevel: SubscriptionLevel,
): Template[] => {
  const tierMapping: Record<SubscriptionLevel, TemplateTier> = {
    free: "free",
    pro: "pro",
    pro_plus: "pro_plus",
  };

  return getTemplatesByTier(tierMapping[subscriptionLevel]);
};

/**
 * Get a specific template by ID
 */
export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES[id];
};

/**
 * Check if a user can access a specific template
 */
export const canAccessTemplate = (
  templateId: string,
  subscriptionLevel: SubscriptionLevel,
): boolean => {
  if (UNLOCK_ALL_TEMPLATES) return true;

  const template = getTemplateById(templateId);
  if (!template) return false;

  const tierMapping: Record<TemplateTier, number> = {
    free: 0,
    pro: 1,
    pro_plus: 2,
  };
  const subscriptionTiers: Record<SubscriptionLevel, number> = {
    free: 0,
    pro: 1,
    pro_plus: 2,
  };

  return subscriptionTiers[subscriptionLevel] >= tierMapping[template.tier];
};

/**
 * Get the default template ID
 */
export const DEFAULT_TEMPLATE_ID = "classic";

/**
 * Template categories for filtering
 */
export const TEMPLATE_CATEGORIES = {
  all: "All Templates",
  free: "Free Templates",
  premium: "Premium Templates",
  single: "Single Column",
  double: "Two Column",
  creative: "Creative Layouts",
} as const;

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (
  category: keyof typeof TEMPLATE_CATEGORIES,
): Template[] => {
  const allTemplates = getAllTemplates();

  switch (category) {
    case "all":
      return allTemplates;
    case "free":
      return allTemplates.filter((t) => t.tier === "free");
    case "premium":
      return allTemplates.filter((t) => t.tier !== "free");
    case "single":
      return allTemplates.filter((t) => t.layout === "single-column");
    case "double":
      return allTemplates.filter((t) => t.layout === "two-column");
    case "creative":
      return allTemplates.filter((t) => t.layout === "creative");
    default:
      return allTemplates;
  }
};

/**
 * Template statistics
 */
export const getTemplateStats = () => {
  const all = getAllTemplates();
  return {
    total: all.length,
    free: all.filter((t) => t.tier === "free").length,
    pro: all.filter((t) => t.tier === "pro").length,
    pro_plus: all.filter((t) => t.tier === "pro_plus").length,
    singleColumn: all.filter((t) => t.layout === "single-column").length,
    twoColumn: all.filter((t) => t.layout === "two-column").length,
    creative: all.filter((t) => t.layout === "creative").length,
  };
};
