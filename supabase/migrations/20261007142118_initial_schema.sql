-- ============================================================
-- Sarva Solar — Initial Supabase Schema
-- Phase 1: database foundation
-- ============================================================

create type public.user_role as enum (
  'Admin',
  'Manager',
  'Employee',
  'Sales',
  'Technician'
);

create type public.lead_status as enum (
  'New',
  'Contacted',
  'Site Inspection',
  'Proposal Sent',
  'Closed Won',
  'Closed Lost'
);

create type public.quote_status as enum (
  'Pending',
  'Reviewed',
  'Quoted',
  'Archived'
);

create type public.property_type as enum (
  'Residential',
  'Commercial',
  'Industrial',
  'Agriculture'
);

create type public.project_category as enum (
  'Residential',
  'Commercial',
  'Industrial',
  'Agriculture'
);

create type public.project_status as enum (
  'Completed',
  'Ongoing'
);

create type public.job_type as enum (
  'Full-time',
  'Part-time',
  'Contract',
  'Internship'
);

create type public.job_application_status as enum (
  'New',
  'Shortlisted',
  'Interviewed',
  'Hired',
  'Rejected'
);

create type public.gallery_category as enum (
  'Residential',
  'Commercial',
  'Industrial',
  'Drone Views'
);

create type public.gallery_media_type as enum (
  'image',
  'video'
);

create type public.media_type as enum (
  'image',
  'video'
);

create type public.email_form_type as enum (
  'Lead',
  'Quote',
  'JobApplication'
);

create type public.email_notification_status as enum (
  'Sent',
  'Delivered',
  'Pending',
  'Failed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role public.user_role not null default 'Employee',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles(role);
create index profiles_email_idx on public.profiles(lower(email));

-- Private helper schema. Authorization logic stays outside the
-- exposed public schema.
create schema if not exists app_private;

create or replace function app_private.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
  limit 1
$$;

revoke all on function app_private.current_user_role() from public;
grant execute on function app_private.current_user_role()
  to authenticated;

-- ============================================================
-- Content
-- ============================================================

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  company_name text not null,
  tagline text,
  phone1 text,
  phone2 text,
  email text,
  address text,
  whatsapp_number text,
  working_hours text,
  announcement_bar_text text,
  show_announcement_bar boolean not null default false,
  meta_title text,
  meta_description text,
  google_maps_embed_url text,
  updated_at timestamptz not null default now()
);

create table public.services (
  id text primary key,
  title text not null,
  slug text not null unique,
  short_desc text,
  full_desc text,
  icon_name text,
  benefits jsonb not null default '[]'::jsonb,
  image_url text,
  faqs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subsidies (
  id text primary key,
  scheme_name text not null,
  capacity_range text,
  central_subsidy_amount numeric,
  state_bonus_amount numeric,
  eligibility jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  process_steps jsonb not null default '[]'::jsonb,
  updated_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  price numeric,
  rating numeric,
  specs jsonb not null default '{}'::jsonb,
  description text,
  warranty text,
  image_url text,
  is_featured boolean not null default false,
  inventory integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id text primary key,
  title text not null,
  category public.project_category not null,
  location text,
  state text,
  capacity_kw numeric,
  annual_savings_rs numeric,
  completion_date date,
  status public.project_status not null,
  images jsonb not null default '[]'::jsonb,
  description text,
  client_review jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blogs (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text,
  author text,
  published_at timestamptz,
  read_time text,
  excerpt text,
  content text,
  image_url text,
  tags jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id text primary key,
  customer_name text not null,
  location text,
  system_size_kw numeric,
  rating numeric,
  comment text,
  photo_url text,
  saved_per_year numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id text primary key,
  category text not null,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery (
  id text primary key,
  title text not null,
  category public.gallery_category not null,
  type public.gallery_media_type not null,
  media_url text not null,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hero_slides (
  id text primary key,
  badge text,
  title text not null,
  subtitle text,
  media_type public.media_type not null,
  media_url text not null,
  cta_primary_text text,
  cta_primary_action text,
  cta_secondary_text text,
  cta_secondary_action text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Customer / operational workflows
-- ============================================================

create table public.leads (
  id text primary key,
  full_name text not null,
  email text,
  phone text,
  state text,
  city text,
  solar_for text,
  monthly_bill text,
  roof_type text,
  connection_type text,
  finance_interest text,
  status public.lead_status not null default 'New',
  assigned_to uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads(status);
create index leads_assigned_to_idx on public.leads(assigned_to);
create index leads_created_at_idx on public.leads(created_at desc);

create table public.quotes (
  id text primary key,
  name text not null,
  phone text,
  email text,
  state text,
  city text,
  property_type public.property_type not null,
  monthly_bill numeric not null default 0,
  roof_type text,
  proposed_kw numeric,
  estimated_cost numeric,
  estimated_subsidy numeric,
  net_cost numeric,
  status public.quote_status not null default 'Pending',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quotes_status_idx on public.quotes(status);
create index quotes_created_at_idx on public.quotes(created_at desc);

create table public.jobs (
  id text primary key,
  title text not null,
  location text,
  type public.job_type not null,
  exp text,
  description text,
  department text,
  is_active boolean not null default false,
  posted_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_applications (
  id text primary key,
  job_id text references public.jobs(id) on delete set null,
  name text not null,
  phone text,
  email text,
  role text,
  experience text,
  message text,
  status public.job_application_status not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Administration / observability
-- ============================================================

create table public.audit_logs (
  id text primary key,
  timestamp timestamptz not null default now(),
  user_email text,
  action text not null,
  details jsonb not null default '{}'::jsonb
);

create index audit_logs_timestamp_idx
  on public.audit_logs(timestamp desc);

create table public.visitor_logs (
  id text primary key,
  ip text,
  path text,
  referrer text,
  user_agent text,
  device_type text,
  timestamp timestamptz not null default now()
);

create index visitor_logs_timestamp_idx
  on public.visitor_logs(timestamp desc);

create table public.email_notifications (
  id text primary key,
  to_email text,
  subject text,
  form_type public.email_form_type,
  customer_name text,
  customer_email text,
  customer_phone text,
  details jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  status public.email_notification_status not null default 'Pending',
  delivery_method text,
  error_message text
);

create index email_notifications_sent_at_idx
  on public.email_notifications(sent_at desc);
  -- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.services enable row level security;
alter table public.subsidies enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.blogs enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.gallery enable row level security;
alter table public.hero_slides enable row level security;
alter table public.leads enable row level security;
alter table public.quotes enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.visitor_logs enable row level security;
alter table public.email_notifications enable row level security;


-- ============================================================
-- Public website content
-- Public visitors can read published/website content.
-- Only administrators can modify CMS content.
-- ============================================================

create policy "Public can read settings"
on public.settings
for select
to anon, authenticated
using (true);

create policy "Public can read services"
on public.services
for select
to anon, authenticated
using (true);

create policy "Public can read subsidies"
on public.subsidies
for select
to anon, authenticated
using (true);

create policy "Public can read products"
on public.products
for select
to anon, authenticated
using (true);

create policy "Public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

create policy "Public can read published blogs"
on public.blogs
for select
to anon, authenticated
using (is_published = true);

create policy "Public can read testimonials"
on public.testimonials
for select
to anon, authenticated
using (true);

create policy "Public can read faqs"
on public.faqs
for select
to anon, authenticated
using (true);

create policy "Public can read gallery"
on public.gallery
for select
to anon, authenticated
using (true);

create policy "Public can read hero slides"
on public.hero_slides
for select
to anon, authenticated
using (true);


-- ============================================================
-- Admin CMS permissions
-- ============================================================

create policy "Admins can read all blogs"
on public.blogs
for select
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage settings"
on public.settings
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage services"
on public.services
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage subsidies"
on public.subsidies
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage products"
on public.products
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage projects"
on public.projects
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage blogs"
on public.blogs
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage testimonials"
on public.testimonials
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage faqs"
on public.faqs
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage gallery"
on public.gallery
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage hero slides"
on public.hero_slides
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);


-- ============================================================
-- Profiles
-- Users can read their own profile.
-- Admins can manage staff profiles.
-- ============================================================

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);


-- ============================================================
-- Leads
-- Public visitors may submit.
-- Authenticated staff may read.
-- Admin / Manager / Sales may update and delete.
-- ============================================================

create policy "Public can submit leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Staff can read leads"
on public.leads
for select
to authenticated
using (true);

create policy "Sales staff can update leads"
on public.leads
for update
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
)
with check (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
);

create policy "Sales staff can delete leads"
on public.leads
for delete
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
);


-- ============================================================
-- Quotes
-- Public visitors may submit.
-- Authenticated staff may read.
-- Admin / Manager / Sales may update and delete.
-- ============================================================

create policy "Public can submit quotes"
on public.quotes
for insert
to anon, authenticated
with check (true);

create policy "Staff can read quotes"
on public.quotes
for select
to authenticated
using (true);

create policy "Sales staff can update quotes"
on public.quotes
for update
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
)
with check (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
);

create policy "Sales staff can delete quotes"
on public.quotes
for delete
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales')
);


-- ============================================================
-- Careers
-- Public visitors can see active jobs and submit applications.
-- Staff can manage jobs.
-- ============================================================

create policy "Public can read active jobs"
on public.jobs
for select
to anon, authenticated
using (is_active = true);

create policy "Staff can read all jobs"
on public.jobs
for select
to authenticated
using (true);

create policy "Admins and managers can manage jobs"
on public.jobs
for all
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager')
)
with check (
  (select app_private.current_user_role())
    in ('Admin', 'Manager')
);

create policy "Public can submit job applications"
on public.job_applications
for insert
to anon, authenticated
with check (true);

create policy "Staff can read job applications"
on public.job_applications
for select
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager')
);

create policy "Admins and managers can update applications"
on public.job_applications
for update
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager')
)
with check (
  (select app_private.current_user_role())
    in ('Admin', 'Manager')
);

create policy "Admins can delete applications"
on public.job_applications
for delete
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
);


-- ============================================================
-- Audit logs
-- Admin only.
-- ============================================================

create policy "Admins can read audit logs"
on public.audit_logs
for select
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
);

create policy "Admins can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check (
  (select app_private.current_user_role()) = 'Admin'
);


-- ============================================================
-- Visitor logs
-- Staff can read operational analytics.
-- Inserts will eventually be performed by a controlled server-side
-- workflow rather than allowing arbitrary browser writes.
-- ============================================================

create policy "Staff can read visitor logs"
on public.visitor_logs
for select
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales', 'Technician', 'Employee')
);


-- ============================================================
-- Email notifications
-- Staff can read notification history.
-- Admin can manage records.
-- ============================================================

create policy "Staff can read email notifications"
on public.email_notifications
for select
to authenticated
using (
  (select app_private.current_user_role())
    in ('Admin', 'Manager', 'Sales', 'Technician', 'Employee')
);

create policy "Admins can manage email notifications"
on public.email_notifications
for all
to authenticated
using (
  (select app_private.current_user_role()) = 'Admin'
)
with check (
  (select app_private.current_user_role()) = 'Admin'
);


-- ============================================================
-- Explicit Data API privileges
-- RLS remains the row-level security boundary.
-- ============================================================

grant select on
  public.settings,
  public.services,
  public.subsidies,
  public.products,
  public.projects,
  public.blogs,
  public.testimonials,
  public.faqs,
  public.gallery,
  public.hero_slides,
  public.jobs
to anon, authenticated;

grant insert on public.leads, public.quotes, public.job_applications
to anon, authenticated;

grant select, update, delete on public.leads, public.quotes
to authenticated;

grant select, insert, update, delete on
  public.profiles,
  public.settings,
  public.services,
  public.subsidies,
  public.products,
  public.projects,
  public.blogs,
  public.testimonials,
  public.faqs,
  public.gallery,
  public.hero_slides,
  public.jobs,
  public.job_applications,
  public.audit_logs,
  public.visitor_logs,
  public.email_notifications
to authenticated;

-- ============================================================
-- Automatic updated_at maintenance
-- ============================================================

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function app_private.set_updated_at() from public;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function app_private.set_updated_at();

create trigger settings_set_updated_at
before update on public.settings
for each row execute function app_private.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function app_private.set_updated_at();

create trigger subsidies_set_updated_at
before update on public.subsidies
for each row execute function app_private.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function app_private.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function app_private.set_updated_at();

create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function app_private.set_updated_at();

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function app_private.set_updated_at();

create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function app_private.set_updated_at();

create trigger gallery_set_updated_at
before update on public.gallery
for each row execute function app_private.set_updated_at();

create trigger hero_slides_set_updated_at
before update on public.hero_slides
for each row execute function app_private.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function app_private.set_updated_at();

create trigger quotes_set_updated_at
before update on public.quotes
for each row execute function app_private.set_updated_at();

create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function app_private.set_updated_at();

create trigger job_applications_set_updated_at
before update on public.job_applications
for each row execute function app_private.set_updated_at();
-- Storage bucket for CMS media managed through Supabase Storage.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public can view media"
on storage.objects
for select
to public
using (bucket_id = 'media');

create policy "Authenticated users can upload media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media');

create policy "Authenticated users can update media"
on storage.objects
for update
to authenticated
using (bucket_id = 'media')
with check (bucket_id = 'media');

create policy "Authenticated users can delete media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media');
