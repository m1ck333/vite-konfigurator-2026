export type activeSidebarItem =
  | "type"
  | "systems"
  | "door-model"
  | "construction"
  | "color"
  | "glass"
  | "equipment"
  | "lock"
  | "house-colors"
  | "insert-the-door"
  | "print-query";

export interface House {
  id: number;
  image: string;
}
export interface ColorCategoryTranslation {
  id?: number;
  color_category_id: number;
  language: string;
  name: string;
}

export interface ColorCategory {
  id: number;
  show_in_stock: boolean;
  show_in_panel: boolean;
  sort_order?: number;
  translations?: ColorCategoryTranslation[];
}

export interface Color {
  id: number;
  color_code: string;
  thumbnail: string | null;
  color_hex: string | null;
  color_category: ColorCategory;
  price: number;
  sort_order: number | null;
  is_shown: boolean;
}

export interface GroupedColors {
  categoryName: string;
  colors: Color[];
}

export interface Position {
  id: number;
  position: string;
}

export interface Dmodel {
  id: number;
  dmodel_name: string;
  suffix: string;
}

export interface Equipment {
  id: number;
  name: string;
  equipment_code: string;
  thumbnail: string;

  code: string;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;

  description: string | null;
  description2: string | null;
  subclass: string | null;
  offset_x: number | null;
  offset_y: number | null;
  equipment_category: EquipmentCategory;
  position: Position;
  dmodels: Dmodel[];
}

export interface EquipmentCategory {
  equipments: Equipment[];
  equipment_category_name: string;
  id: number;
}

export interface EquipmentItem {
  id: number;
  src: string;
  alt: string;
  label: string;
}

export interface HouseColor {
  id: number;
  color_code: string;
  color_hex: string | null;
  margin_color_hex: string | null;
  created_at: string | null;
  updated_at: string | null;
  thumbnail: string;
}

export interface Door {
  id: number;
  model_code: string;
  thumbnail: string | File;
  color_id: number;
  color?: Color;
  decorative_glass_name: string | null;
  side_glass_code: string | null;
  second_panel_color_id: number | null;
  second_panel_color?: Color;
  has_glass: boolean;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
  dmodels?: Dmodel[];
  is_default: boolean;
}

export interface InquiryFormFields {
  email?: string;
  fullName?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  message?: string;
}
export interface User {
  id: number;
  company_name: string;
  city: string;
  zip_code: string;
  address?: string;
  pib?: string;
  social_number?: string;
  giro_account?: string;
  phone?: string;
  mobile_phone?: string;
  email?: string;
  contact_person?: string;
  currency: "RSD" | "EUR" | "USD";
  username: string;
  password: string;
  logo?: string | File;
  role: string;
  created_at: Date;
  updated_at: Date;
  markups: Markup[];
}

export interface Markup {
  id: number;
  user_id: number;
  markup_label: number;
  markup_value: number;
  default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface RegisterFormData
  extends Omit<User, "id" | "role" | "created_at" | "updated_at" | "markups"> {
  confirm_password: string;
}

// REFACTORING
export interface EquipmentSystemTranslation {
  id: number;
  equipment_id: number;
  language: string;
  description: string;
}

export interface EquipmentSystem {
  id: number;
  name: string;
  code: string;
  thumbnail: string | File;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
  translations: EquipmentSystemTranslation[];
  description: string;
  is_default: boolean;
}

export interface EquipmentGlassTranslation {
  id: number;
  glass_id: number;
  language: string;
  name: string;
}

export interface EquipmentGlass {
  id: number;
  type: "ornament" | "decorative" | "sideglass";
  thumbnail: string | File;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
  translations: EquipmentGlassTranslation[];
  is_default: boolean;
}

export interface EquipmentLockTranslation {
  id: number;
  lock_id: number;
  language: string;
  name: string;
}

export interface EquipmentLock {
  id: number;
  code: string;
  sr_name: string;
  thumbnail: string | File;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
  translations: EquipmentLockTranslation[];
  is_default: boolean;
}

export interface EquipmentOtherTranslation {
  id: number;
  equipment_id: number;
  language: string;
  name: string;
  description: string;
}

export interface EquipmentOther {
  id: number;
  code: string;
  sr_name: string;
  thumbnail: string | File;
  inner_image: string | File;
  image: string | File;
  price: string;
  sort_order: number | null;
  is_shown: boolean;
  created_at: string;
  updated_at: string;
  category_id: number;
  subcategory: string | null;
  translations: EquipmentOtherTranslation[];
  is_subcategory: boolean;
  is_default: boolean;
}

export interface EquipmentOtherCategory {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface EquipmentOtherGroupedBySubclass {
  [subcategory: string]: EquipmentOther[];
}

export interface EquipmentOthersByCategory {
  [category: string]: {
    category_name: string;
    category_id: number;
    groupedBySubclass?: EquipmentOtherGroupedBySubclass;
    equipments: EquipmentOther[];
  };
}
