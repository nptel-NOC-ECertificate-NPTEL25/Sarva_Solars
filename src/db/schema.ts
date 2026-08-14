import { pgTable, text, integer, numeric, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid'),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('Admin'),
  phone: text('phone'),
  createdAt: text('created_at').notNull()
});

// Passwords table for local admin credentials
export const userPasswords = pgTable('user_passwords', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  updatedAt: text('updated_at').notNull()
});

// Hero Slides table
export const heroSlides = pgTable('hero_slides', {
  id: text('id').primaryKey(),
  badge: text('badge'),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  mediaType: text('media_type').notNull().default('image'),
  mediaUrl: text('media_url').notNull(),
  ctaPrimaryText: text('cta_primary_text'),
  ctaPrimaryAction: text('cta_primary_action'),
  ctaSecondaryText: text('cta_secondary_text'),
  ctaSecondaryAction: text('cta_secondary_action'),
  order: integer('order').notNull().default(1)
});

// Leads table
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  state: text('state').notNull(),
  city: text('city').notNull(),
  monthlyBill: integer('monthly_bill').notNull(),
  roofAreaSqFt: integer('roof_area_sq_ft').notNull(),
  systemType: text('system_type').notNull(),
  status: text('status').notNull().default('New'),
  notes: text('notes'),
  assignedTo: text('assigned_to'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at')
});

// Quotes table
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  monthlyBill: integer('monthly_bill').notNull(),
  roofAreaSqFt: integer('roof_area_sq_ft').notNull(),
  recommendedCapacityKw: numeric('recommended_capacity_kw').notNull(),
  estimatedTotalCost: numeric('estimated_total_cost').notNull(),
  estimatedSubsidy: numeric('estimated_subsidy').notNull(),
  netPayableCost: numeric('net_payable_cost').notNull(),
  yearlySavings: numeric('yearly_savings').notNull(),
  systemType: text('system_type').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: text('created_at').notNull()
});

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  brand: text('brand').notNull(),
  price: numeric('price').notNull(),
  rating: numeric('rating').default('5.0'),
  specs: jsonb('specs'),
  description: text('description'),
  warranty: text('warranty'),
  imageUrl: text('image_url').notNull(),
  isFeatured: boolean('is_featured').default(false),
  inventory: integer('inventory').default(0),
  createdAt: text('created_at')
});

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  capacityKw: numeric('capacity_kw').notNull(),
  clientName: text('client_name').notNull(),
  location: text('location').notNull(),
  panelsCount: integer('panels_count'),
  inverterType: text('inverter_type'),
  completionDate: text('completion_date'),
  annualCo2SavedTons: numeric('annual_co2_saved_tons'),
  annualSavingsInr: numeric('annual_savings_inr'),
  beforeImageUrl: text('before_image_url'),
  afterImageUrl: text('after_image_url').notNull(),
  galleryImages: jsonb('gallery_images'),
  description: text('description'),
  isFeatured: boolean('is_featured').default(false),
  review: text('review')
});

// Blogs table
export const blogs = pgTable('blogs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  publishedDate: text('published_date').notNull(),
  readTimeMinutes: integer('read_time_minutes').notNull().default(5),
  tags: jsonb('tags'),
  isFeatured: boolean('is_featured').default(false)
});

// Services table
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  iconName: text('icon_name').notNull(),
  benefits: jsonb('benefits'),
  imageUrl: text('image_url').notNull(),
  order: integer('order').notNull().default(1)
});

// Subsidies table
export const subsidies = pgTable('subsidies', {
  id: text('id').primaryKey(),
  schemeName: text('scheme_name').notNull(),
  capacityRange: text('capacity_range').notNull(),
  centralSubsidyAmount: integer('central_subsidy_amount').notNull(),
  stateBonusAmount: integer('state_bonus_amount').notNull().default(0),
  eligibility: jsonb('eligibility'),
  documents: jsonb('documents'),
  processSteps: jsonb('process_steps'),
  updatedDate: text('updated_date').notNull()
});

// Testimonials table
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  location: text('location').notNull(),
  systemSizeKw: numeric('system_size_kw').notNull(),
  rating: integer('rating').notNull().default(5),
  comment: text('comment').notNull(),
  photoUrl: text('photo_url'),
  savedPerYear: text('saved_per_year')
});

// FAQs table
export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull()
});

// Gallery table
export const gallery = pgTable('gallery', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull().default('image'),
  mediaUrl: text('media_url').notNull(),
  caption: text('caption')
});

// Job Openings table
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  location: text('location').notNull(),
  type: text('type').notNull(),
  exp: text('exp').notNull(),
  desc: text('desc').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  postedDate: text('posted_date').notNull()
});

// Job Applications table
export const jobApplications = pgTable('job_applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(),
  experience: text('experience').notNull(),
  message: text('message').notNull(),
  resumeUrl: text('resume_url'),
  status: text('status').notNull().default('New'),
  createdAt: text('created_at').notNull()
});

// App Settings table (key-value or single row)
export const settings = pgTable('settings', {
  id: text('id').primaryKey().default('global'),
  data: jsonb('data').notNull(),
  updatedAt: text('updated_at').notNull()
});

// Audit Logs table
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  userEmail: text('user_email').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  ip: text('ip')
});
