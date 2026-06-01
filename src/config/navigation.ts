import {

  LayoutDashboard,

  ScanLine,

  MessageSquareText,

  Dumbbell,

  Moon,

  Droplets,

  Footprints,

  Smile,

  Wind,

  Trophy,

  User,

  Settings,

  Crown,

  BarChart3,

  Bell,

  Briefcase,

  BookOpen,

  Heart,

  type LucideIcon,

} from "lucide-react";



export type NavItem = {

  labelKey: string;

  to: string;

  icon: LucideIcon;

  group: "main" | "spaces" | "wellness" | "system";

};



export const navItems: NavItem[] = [

  { labelKey: "nav.dashboard", to: "/app", icon: LayoutDashboard, group: "main" },

  { labelKey: "nav.foodScanner", to: "/app/food-scan", icon: ScanLine, group: "main" },

  { labelKey: "nav.aiCoach", to: "/app/chat", icon: MessageSquareText, group: "main" },

  { labelKey: "nav.analytics", to: "/app/analytics", icon: BarChart3, group: "main" },

  { labelKey: "nav.work", to: "/app/work", icon: Briefcase, group: "spaces" },

  { labelKey: "nav.gym", to: "/app/gym", icon: Dumbbell, group: "spaces" },

  { labelKey: "nav.study", to: "/app/study", icon: BookOpen, group: "spaces" },

  { labelKey: "nav.personal", to: "/app/personal", icon: Heart, group: "spaces" },

  { labelKey: "nav.training", to: "/app/training", icon: Dumbbell, group: "wellness" },

  { labelKey: "nav.sleep", to: "/app/sleep", icon: Moon, group: "wellness" },

  { labelKey: "nav.water", to: "/app/water", icon: Droplets, group: "wellness" },

  { labelKey: "nav.steps", to: "/app/steps", icon: Footprints, group: "wellness" },

  { labelKey: "nav.mood", to: "/app/mood", icon: Smile, group: "wellness" },

  { labelKey: "nav.relax", to: "/app/relax", icon: Wind, group: "wellness" },

  { labelKey: "nav.awards", to: "/app/awards", icon: Trophy, group: "wellness" },

  { labelKey: "nav.notifications", to: "/app/notifications", icon: Bell, group: "system" },

  { labelKey: "nav.profile", to: "/app/profile", icon: User, group: "system" },

  { labelKey: "nav.plans", to: "/app/plans", icon: Crown, group: "system" },

  { labelKey: "nav.settings", to: "/app/settings", icon: Settings, group: "system" },

];



export const bottomNavItems: NavItem[] = [

  navItems[0],

  navItems[1],

  navItems[2],

  navItems[3],

  navItems[12],

];



export const navGroupLabelKey: Record<NavItem["group"], string> = {

  main: "nav.groupMain",

  spaces: "nav.groupSpaces",

  wellness: "nav.groupWellness",

  system: "nav.groupAccount",

};


