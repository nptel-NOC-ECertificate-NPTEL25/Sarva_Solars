ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS installed_capacity text,
  ADD COLUMN IF NOT EXISTS customer_rating text,
  ADD COLUMN IF NOT EXISTS panel_warranty text,
  ADD COLUMN IF NOT EXISTS government_subsidy text;
