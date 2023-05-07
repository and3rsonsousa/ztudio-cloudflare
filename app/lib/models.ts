import type { SupabaseClient } from "@supabase/supabase-js";
import type { Dayjs } from "dayjs";
export type PersonModel = {
  id: string;
  name: string;
  email: string;
  admin: Boolean;
  user_id: string;
};

export type UserModel = {
  id: string;
  email?: string;
};

export type AccountModel = {
  id: string;
  name: string;
  short: string;
  slug: string;
  users: string[];
};

export type CampaignModel = {
  id: string;
  name: string;
  description: string;
  account: string;
  date_start: string;
  date_end: string;
  actions: ActionModel[];
  created_at?: string;
  updated_at?: string;
  stage: string;
  Stage?: ItemModel;
  Account?: AccountModel;
  Action?: ActionModel[];
};

export type ActionModel = {
  id: string;
  name: string;
  date: string;
  description: string;
  created_at: string;
  updated_at: string;
  creator: PersonModel;
  responsible: PersonModel;
  category: ItemModel;
  stage: ItemModel;
  account: AccountModel;
  campaign: CampaignModel;
  attributes: ItemModel;
  deleted: boolean;
};

export type CelebrationModel = {
  id: string | number;
  name: string;
  date: string;
  is_holiday: boolean;
};

export type ItemModel = {
  id: string;
  name: string;
  slug: string;
  short?: string;
  priority?: number;
};

export type DayModel = {
  date: Dayjs;
  actions: ActionModel[];
  celebrations: CelebrationModel[];
  campaigns: CampaignModel[];
};

export type DropdownOptions = Array<
  { id: string; text: string; href: string } | "divider" | (() => {})
>;

export type PeriodType = Array<{
  date: Dayjs;
}>;

export type ContextType = {
  date: {
    day: Dayjs;
    set: React.Dispatch<React.SetStateAction<Dayjs>>;
  };
  filter: {
    option: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
  priority: {
    option: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  arrange: {
    option: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
  actions: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  celebrations: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  campaigns: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  search: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  shortcut: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  sidebar: {
    open: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
  supabase: SupabaseClient<any, "public", any>;
};

export type ShortcutModel = {
  shortcut: string;
  does: string;
  value?: string;
};
