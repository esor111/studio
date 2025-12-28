declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;
  
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const BookOpen: LucideIcon;
  export const BookOpenText: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Circle: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit2: LucideIcon;
  export const Link2: LucideIcon;
  export const Lock: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Plus: LucideIcon;
  export const Target: LucideIcon;
  export const Trash2: LucideIcon;
  export const Unlock: LucideIcon;
  export const X: LucideIcon;
}