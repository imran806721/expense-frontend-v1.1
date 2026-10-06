import {
  UtensilsCrossed,
  Car,
  Home,
  HeartPulse,
  Popcorn,
  ShoppingBag,
  Plane,
  Receipt,
  GraduationCap,
  MoreHorizontal,
} from 'lucide-react';

const ICONS = {
  UtensilsCrossed,
  Car,
  Home,
  HeartPulse,
  Popcorn,
  ShoppingBag,
  Plane,
  Receipt,
  GraduationCap,
  MoreHorizontal,
};

export function CategoryIcon({ iconKey, className }) {
  const Icon = ICONS[iconKey] || MoreHorizontal;
  return <Icon className={className} />;
}
