export interface Achievement {
  achievement_id: string;
  achievement_name: string;
  achievement_description: string;
  achievement_icon: string;
  achievement_type: string;
  criteria_value: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  is_viewed: boolean;
}

export interface Quote {
  quote_id: string;
  quote_text: string;
  quote_author: string;
  quote_category: string;
}