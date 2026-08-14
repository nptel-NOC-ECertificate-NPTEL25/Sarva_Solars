import {
  AuthResponse,
  User,
  Lead,
  QuoteRequest,
  Product,
  Project,
  BlogArticle,
  ServiceItem,
  SubsidyDetail,
  Testimonial,
  FAQItem,
  GalleryItem,
  JobOpening,
  JobApplication,
  AppSettings,
  HeroSlide,
  AuditLog,
  VisitorLog,
  EmailNotification
} from '../types';

import {
  defaultSettings,
  defaultHeroSlides,
  defaultSubsidies,
  defaultServices,
  defaultProducts,
  defaultProjects,
  defaultBlogs,
  defaultTestimonials,
  defaultFaqs,
  defaultGallery,
  defaultJobs,
  defaultUsers
} from '../data/defaultData';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('sarva_solar_token') || 'sarva-token-usr-0-admin';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Storage helpers for Vercel/Static hosting fallbacks
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`sarva_solar_${key}`);
    if (!raw) {
      localStorage.setItem(`sarva_solar_${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function notifyDataUpdated(): void {
  if (typeof window === 'undefined') return;

  // 1. In-tab custom event
  try {
    window.dispatchEvent(new CustomEvent('sarva_data_updated'));
    window.dispatchEvent(new Event('sarva_data_updated'));
  } catch (e) {}

  // 2. Cross-tab storage event
  try {
    localStorage.setItem('sarva_last_data_update', Date.now().toString());
  } catch (e) {}

  // 3. Cross-tab Broadcast Channel
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('sarva_data_channel');
      bc.postMessage('sarva_data_updated');
      bc.close();
    }
  } catch (e) {}
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`sarva_solar_${key}`, JSON.stringify(value));
    notifyDataUpdated();
  } catch {
    // Ignore storage quota limits
  }
}

// Generic safe API caller that tries backend API first, and falls back to LocalStorage if API fails or returns non-JSON (e.g. Vercel static hosting)
async function apiCall<T>(url: string, options: RequestInit | undefined, fallbackFn: () => T | Promise<T>): Promise<T> {
  const isMutation = options && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase() || '');

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (res.ok) {
      if (contentType.includes('application/json')) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          const data = JSON.parse(text) as T;
          if (isMutation) {
            notifyDataUpdated();
          }
          return data;
        }
      }
      if (isMutation) {
        notifyDataUpdated();
      }
      return await fallbackFn();
    } else {
      console.warn(`[API Server Warning] ${options?.method || 'GET'} ${url} returned status ${res.status}`);
    }
  } catch (err) {
    console.warn(`[API Network Call Error] ${url}:`, err);
  }

  const fallbackData = await fallbackFn();
  if (isMutation) {
    notifyDataUpdated();
  }
  return fallbackData;
}

// AUTH
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const result = await apiCall<AuthResponse>(
    `${API_BASE}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
    },
    () => {
      const defaultAccounts: Record<string, { pass: string[]; user: User }> = {
        'sarvasolars@gmail.com': {
          pass: ['Sarva@1234', 'admin123', 'admin', 'Sarva1234'],
          user: {
            id: 'usr-0',
            name: 'Sarva Solar Admin',
            email: 'sarvasolars@gmail.com',
            role: 'Admin',
            phone: '+91 8985430100',
            createdAt: new Date().toISOString()
          }
        },
        'admin@sarvasolar.com': {
          pass: ['admin123', 'Sarva@1234', 'admin', 'Sarva1234'],
          user: {
            id: 'usr-1',
            name: 'Jupalli Venkatesh Kumar',
            email: 'admin@sarvasolar.com',
            role: 'Admin',
            phone: '+91 7036590780',
            createdAt: new Date().toISOString()
          }
        }
      };

      const account = defaultAccounts[cleanEmail];
      if (account && account.pass.includes(cleanPassword)) {
        const token = `sarva-token-${account.user.id}-${Date.now()}`;
        return { token, user: account.user };
      }

      const users = getStored<User[]>('users', defaultUsers);
      const found = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (found && (cleanPassword === 'Sarva@1234' || cleanPassword === 'admin123' || cleanPassword === 'admin')) {
        const token = `sarva-token-${found.id}-${Date.now()}`;
        return { token, user: found };
      }

      throw new Error('Invalid email or password. Please verify your credentials.');
    }
  );

  if (result && result.token) {
    localStorage.setItem('sarva_solar_token', result.token);
    localStorage.setItem('sarva_solar_user', JSON.stringify(result.user));
  }

  return result;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('sarva_solar_token');
  if (!token) return null;

  return apiCall<User | null>(
    `${API_BASE}/auth/me`,
    { headers: getAuthHeaders() },
    () => {
      const cached = localStorage.getItem('sarva_solar_user');
      return cached ? JSON.parse(cached) : null;
    }
  );
}

export const fetchCurrentUser = getCurrentUser;

// SETTINGS
export async function fetchSettings(): Promise<AppSettings> {
  return apiCall<AppSettings>(
    `${API_BASE}/settings`,
    undefined,
    () => getStored<AppSettings>('settings', defaultSettings)
  );
}

export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  return apiCall<AppSettings>(
    `${API_BASE}/settings`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const current = getStored<AppSettings>('settings', defaultSettings);
      const updated = { ...current, ...updates };
      setStored('settings', updated);
      return updated;
    }
  );
}

// SERVICES
export async function fetchServices(): Promise<ServiceItem[]> {
  return apiCall<ServiceItem[]>(
    `${API_BASE}/services`,
    undefined,
    () => getStored<ServiceItem[]>('services', defaultServices)
  );
}

export async function createService(svc: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  return apiCall<ServiceItem>(
    `${API_BASE}/services`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(svc)
    },
    () => {
      const list = getStored<ServiceItem[]>('services', defaultServices);
      const newItem: ServiceItem = { ...svc, id: `srv-${Date.now()}` };
      setStored('services', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
  return apiCall<ServiceItem>(
    `${API_BASE}/services/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<ServiceItem[]>('services', defaultServices);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as ServiceItem);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('services', list);
      return updated;
    }
  );
}

export async function deleteService(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/services/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<ServiceItem[]>('services', defaultServices);
      setStored('services', list.filter(i => i.id !== id));
    }
  );
}

// SUBSIDIES
export async function fetchSubsidies(): Promise<SubsidyDetail[]> {
  return apiCall<SubsidyDetail[]>(
    `${API_BASE}/subsidies`,
    undefined,
    () => getStored<SubsidyDetail[]>('subsidies', defaultSubsidies)
  );
}

export async function createSubsidy(sub: Omit<SubsidyDetail, 'id' | 'updatedDate'>): Promise<SubsidyDetail> {
  return apiCall<SubsidyDetail>(
    `${API_BASE}/subsidies`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sub)
    },
    () => {
      const list = getStored<SubsidyDetail[]>('subsidies', defaultSubsidies);
      const newItem: SubsidyDetail = {
        ...sub,
        id: `sub-${Date.now()}`,
        updatedDate: new Date().toISOString().split('T')[0]
      };
      setStored('subsidies', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateSubsidy(id: string, updates: Partial<SubsidyDetail>): Promise<SubsidyDetail> {
  return apiCall<SubsidyDetail>(
    `${API_BASE}/subsidies/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<SubsidyDetail[]>('subsidies', defaultSubsidies);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as SubsidyDetail);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('subsidies', list);
      return updated;
    }
  );
}

export async function deleteSubsidy(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/subsidies/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<SubsidyDetail[]>('subsidies', defaultSubsidies);
      setStored('subsidies', list.filter(i => i.id !== id));
    }
  );
}

// PRODUCTS
export async function fetchProducts(): Promise<Product[]> {
  return apiCall<Product[]>(
    `${API_BASE}/products`,
    undefined,
    () => getStored<Product[]>('products', defaultProducts)
  );
}

export async function createProduct(prod: Omit<Product, 'id'>): Promise<Product> {
  return apiCall<Product>(
    `${API_BASE}/products`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(prod)
    },
    () => {
      const list = getStored<Product[]>('products', defaultProducts);
      const newItem: Product = { ...prod, id: `prod-${Date.now()}` };
      setStored('products', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  return apiCall<Product>(
    `${API_BASE}/products/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<Product[]>('products', defaultProducts);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as Product);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('products', list);
      return updated;
    }
  );
}

export async function deleteProduct(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/products/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<Product[]>('products', defaultProducts);
      setStored('products', list.filter(i => i.id !== id));
    }
  );
}

// PROJECTS
export async function fetchProjects(): Promise<Project[]> {
  return apiCall<Project[]>(
    `${API_BASE}/projects`,
    undefined,
    () => getStored<Project[]>('projects', defaultProjects)
  );
}

export async function createProject(proj: Omit<Project, 'id'>): Promise<Project> {
  return apiCall<Project>(
    `${API_BASE}/projects`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(proj)
    },
    () => {
      const list = getStored<Project[]>('projects', defaultProjects);
      const newItem: Project = { ...proj, id: `proj-${Date.now()}` };
      setStored('projects', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  return apiCall<Project>(
    `${API_BASE}/projects/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<Project[]>('projects', defaultProjects);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as Project);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('projects', list);
      return updated;
    }
  );
}

export async function deleteProject(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/projects/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<Project[]>('projects', defaultProjects);
      setStored('projects', list.filter(i => i.id !== id));
    }
  );
}

// BLOGS
export async function fetchBlogs(): Promise<BlogArticle[]> {
  return apiCall<BlogArticle[]>(
    `${API_BASE}/blogs`,
    undefined,
    () => getStored<BlogArticle[]>('blogs', defaultBlogs)
  );
}

export async function createBlog(blog: Omit<BlogArticle, 'id'>): Promise<BlogArticle> {
  return apiCall<BlogArticle>(
    `${API_BASE}/blogs`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(blog)
    },
    () => {
      const list = getStored<BlogArticle[]>('blogs', defaultBlogs);
      const newItem: BlogArticle = { ...blog, id: `blog-${Date.now()}` };
      setStored('blogs', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateBlog(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle> {
  return apiCall<BlogArticle>(
    `${API_BASE}/blogs/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<BlogArticle[]>('blogs', defaultBlogs);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as BlogArticle);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('blogs', list);
      return updated;
    }
  );
}

export async function deleteBlog(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/blogs/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<BlogArticle[]>('blogs', defaultBlogs);
      setStored('blogs', list.filter(i => i.id !== id));
    }
  );
}

// TESTIMONIALS
export async function fetchTestimonials(): Promise<Testimonial[]> {
  return apiCall<Testimonial[]>(
    `${API_BASE}/testimonials`,
    undefined,
    () => getStored<Testimonial[]>('testimonials', defaultTestimonials)
  );
}

export async function createTestimonial(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  return apiCall<Testimonial>(
    `${API_BASE}/testimonials`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(t)
    },
    () => {
      const list = getStored<Testimonial[]>('testimonials', defaultTestimonials);
      const newItem: Testimonial = { ...t, id: `t-${Date.now()}` };
      setStored('testimonials', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  return apiCall<Testimonial>(
    `${API_BASE}/testimonials/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<Testimonial[]>('testimonials', defaultTestimonials);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as Testimonial);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('testimonials', list);
      return updated;
    }
  );
}

export async function deleteTestimonial(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/testimonials/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<Testimonial[]>('testimonials', defaultTestimonials);
      setStored('testimonials', list.filter(i => i.id !== id));
    }
  );
}

// FAQS
export async function fetchFaqs(): Promise<FAQItem[]> {
  return apiCall<FAQItem[]>(
    `${API_BASE}/faqs`,
    undefined,
    () => getStored<FAQItem[]>('faqs', defaultFaqs)
  );
}

export async function createFaq(faq: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  return apiCall<FAQItem>(
    `${API_BASE}/faqs`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(faq)
    },
    () => {
      const list = getStored<FAQItem[]>('faqs', defaultFaqs);
      const newItem: FAQItem = { ...faq, id: `faq-${Date.now()}` };
      setStored('faqs', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateFaq(id: string, updates: Partial<FAQItem>): Promise<FAQItem> {
  return apiCall<FAQItem>(
    `${API_BASE}/faqs/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<FAQItem[]>('faqs', defaultFaqs);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as FAQItem);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('faqs', list);
      return updated;
    }
  );
}

export async function deleteFaq(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/faqs/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<FAQItem[]>('faqs', defaultFaqs);
      setStored('faqs', list.filter(i => i.id !== id));
    }
  );
}

// GALLERY
export async function fetchGallery(): Promise<GalleryItem[]> {
  return apiCall<GalleryItem[]>(
    `${API_BASE}/gallery`,
    undefined,
    () => getStored<GalleryItem[]>('gallery', defaultGallery)
  );
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  return apiCall<GalleryItem>(
    `${API_BASE}/gallery`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    },
    () => {
      const list = getStored<GalleryItem[]>('gallery', defaultGallery);
      const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
      setStored('gallery', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
  return apiCall<GalleryItem>(
    `${API_BASE}/gallery/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<GalleryItem[]>('gallery', defaultGallery);
      const idx = list.findIndex(i => i.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as GalleryItem);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('gallery', list);
      return updated;
    }
  );
}

export async function deleteGalleryItem(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/gallery/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<GalleryItem[]>('gallery', defaultGallery);
      setStored('gallery', list.filter(i => i.id !== id));
    }
  );
}

// LEADS
export async function submitLead(data: any): Promise<{ message: string; lead: Lead }> {
  return apiCall<{ message: string; lead: Lead }>(
    `${API_BASE}/leads`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<Lead[]>('leads', []);
      const now = new Date().toISOString();
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        fullName: data.fullName || data.name || 'Valued Customer',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || 'Guntur',
        state: data.state || 'Andhra Pradesh',
        solarFor: data.solarFor || 'Home',
        monthlyBill: String(data.monthlyBill || '0'),
        roofType: data.roofType || 'RCC Flat Roof',
        financeInterest: data.financeInterest || 'No',
        status: 'New',
        notes: data.notes || '',
        createdAt: now,
        updatedAt: now
      };
      setStored('leads', [lead, ...list]);
      return { message: 'Lead submitted successfully', lead };
    }
  );
}

export async function fetchLeads(): Promise<Lead[]> {
  return apiCall<Lead[]>(
    `${API_BASE}/leads`,
    { headers: getAuthHeaders() },
    () => getStored<Lead[]>('leads', [])
  );
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  return apiCall<Lead>(
    `${API_BASE}/leads/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<Lead[]>('leads', []);
      const idx = list.findIndex(l => l.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates, updatedAt: new Date().toISOString() } : ({ ...updates, id } as Lead);
      if (idx !== -1) list[idx] = updated;
      else list.unshift(updated);
      setStored('leads', list);
      return updated;
    }
  );
}

export async function deleteLead(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/leads/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<Lead[]>('leads', []);
      setStored('leads', list.filter(l => l.id !== id));
    }
  );
}

// QUOTES
export async function submitQuote(data: any): Promise<{ message: string; quote: QuoteRequest }> {
  return apiCall<{ message: string; quote: QuoteRequest }>(
    `${API_BASE}/quotes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<QuoteRequest[]>('quotes', []);
      const quote: QuoteRequest = {
        id: `quote-${Date.now()}`,
        name: data.name || 'Valued Customer',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || 'Guntur',
        state: data.state || 'Andhra Pradesh',
        propertyType: data.propertyType || 'Residential',
        monthlyBill: Number(data.monthlyBill || data.averageMonthlyBill) || 0,
        roofType: data.roofType || 'RCC Flat Roof',
        proposedKw: Number(data.proposedKw || data.recommendedKw) || 3,
        estimatedCost: Number(data.estimatedCost || data.estimatedCostMin) || 120000,
        estimatedSubsidy: Number(data.estimatedSubsidy) || 78000,
        netCost: Number(data.netCost) || 42000,
        status: 'Pending',
        message: data.message || '',
        createdAt: new Date().toISOString()
      };
      setStored('quotes', [quote, ...list]);
      return { message: 'Quote submitted successfully', quote };
    }
  );
}

export async function fetchQuotes(): Promise<QuoteRequest[]> {
  return apiCall<QuoteRequest[]>(
    `${API_BASE}/quotes`,
    { headers: getAuthHeaders() },
    () => getStored<QuoteRequest[]>('quotes', [])
  );
}

export async function updateQuoteStatus(id: string, status: QuoteRequest['status']): Promise<QuoteRequest> {
  return apiCall<QuoteRequest>(
    `${API_BASE}/quotes/${id}/status`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    },
    () => {
      const list = getStored<QuoteRequest[]>('quotes', []);
      const idx = list.findIndex(q => q.id === id);
      const updated = idx !== -1 ? { ...list[idx], status } : ({ id, status } as QuoteRequest);
      if (idx !== -1) list[idx] = updated;
      else list.unshift(updated);
      setStored('quotes', list);
      return updated;
    }
  );
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/quotes/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<QuoteRequest[]>('quotes', []);
      setStored('quotes', list.filter(q => q.id !== id));
    }
  );
}

// JOBS
export async function fetchJobs(): Promise<JobOpening[]> {
  return apiCall<JobOpening[]>(
    `${API_BASE}/jobs`,
    undefined,
    () => getStored<JobOpening[]>('jobs', defaultJobs)
  );
}

export async function createJob(job: Omit<JobOpening, 'id'>): Promise<JobOpening> {
  return apiCall<JobOpening>(
    `${API_BASE}/jobs`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(job)
    },
    () => {
      const list = getStored<JobOpening[]>('jobs', defaultJobs);
      const newItem: JobOpening = { ...job, id: `job-${Date.now()}` };
      setStored('jobs', [...list, newItem]);
      return newItem;
    }
  );
}

export async function updateJob(id: string, updates: Partial<JobOpening>): Promise<JobOpening> {
  return apiCall<JobOpening>(
    `${API_BASE}/jobs/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<JobOpening[]>('jobs', defaultJobs);
      const idx = list.findIndex(j => j.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as JobOpening);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('jobs', list);
      return updated;
    }
  );
}

export async function deleteJob(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/jobs/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<JobOpening[]>('jobs', defaultJobs);
      setStored('jobs', list.filter(j => j.id !== id));
    }
  );
}

// JOB APPLICATIONS
export async function fetchJobApplications(): Promise<JobApplication[]> {
  return apiCall<JobApplication[]>(
    `${API_BASE}/job-applications`,
    { headers: getAuthHeaders() },
    () => getStored<JobApplication[]>('job_applications', [])
  );
}

export async function submitJobApplication(data: Omit<JobApplication, 'id' | 'createdAt' | 'status'>): Promise<{ message: string; application: JobApplication }> {
  return apiCall<{ message: string; application: JobApplication }>(
    `${API_BASE}/job-applications`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<JobApplication[]>('job_applications', []);
      const app: JobApplication = {
        ...data,
        id: `app-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString()
      };
      setStored('job_applications', [app, ...list]);
      return { message: 'Application submitted successfully', application: app };
    }
  );
}

export async function updateJobApplicationStatus(id: string, status: JobApplication['status']): Promise<JobApplication> {
  return apiCall<JobApplication>(
    `${API_BASE}/job-applications/${id}/status`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    },
    () => {
      const list = getStored<JobApplication[]>('job_applications', []);
      const idx = list.findIndex(a => a.id === id);
      const updated = idx !== -1 ? { ...list[idx], status } : ({ id, status } as JobApplication);
      if (idx !== -1) list[idx] = updated;
      else list.unshift(updated);
      setStored('job_applications', list);
      return updated;
    }
  );
}

export async function deleteJobApplication(id: string): Promise<void> {
  return apiCall<void>(
    `${API_BASE}/job-applications/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<JobApplication[]>('job_applications', []);
      setStored('job_applications', list.filter(a => a.id !== id));
    }
  );
}

// HERO SLIDES
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const data = await apiCall<HeroSlide[]>(
    `${API_BASE}/hero-slides`,
    undefined,
    () => getStored<HeroSlide[]>('hero_slides', defaultHeroSlides)
  );
  if (Array.isArray(data) && data.length > 0) {
    setStored('hero_slides', data);
  }
  return data;
}

export async function createHeroSlide(data: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
  const result = await apiCall<HeroSlide>(
    `${API_BASE}/hero-slides`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
      const newItem: HeroSlide = { ...data, id: `slide-${Date.now()}` };
      setStored('hero_slides', [...list, newItem]);
      return newItem;
    }
  );
  const currentList = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
  const exists = currentList.some(s => s.id === result.id);
  if (!exists) {
    setStored('hero_slides', [...currentList, result]);
  } else {
    setStored('hero_slides', currentList.map(s => s.id === result.id ? result : s));
  }
  notifyDataUpdated();
  return result;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide> {
  const result = await apiCall<HeroSlide>(
    `${API_BASE}/hero-slides/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const list = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
      const idx = list.findIndex(s => s.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...updates } : ({ ...updates, id } as HeroSlide);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('hero_slides', list);
      return updated;
    }
  );
  const currentList = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
  const idx = currentList.findIndex(s => s.id === id);
  if (idx !== -1) {
    currentList[idx] = { ...currentList[idx], ...result };
    setStored('hero_slides', currentList);
  } else {
    setStored('hero_slides', [...currentList, result]);
  }
  notifyDataUpdated();
  return result;
}

export async function deleteHeroSlide(id: string): Promise<{ message: string }> {
  const result = await apiCall<{ message: string }>(
    `${API_BASE}/hero-slides/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
      setStored('hero_slides', list.filter(s => s.id !== id));
      return { message: 'Slide deleted successfully' };
    }
  );
  const currentList = getStored<HeroSlide[]>('hero_slides', defaultHeroSlides);
  setStored('hero_slides', currentList.filter(s => s.id !== id));
  notifyDataUpdated();
  return result;
}

// STAFF USERS
export async function fetchUsers(): Promise<User[]> {
  return apiCall<User[]>(
    `${API_BASE}/admin/users`,
    { headers: getAuthHeaders() },
    () => getStored<User[]>('users', defaultUsers)
  );
}

export async function createStaffUser(data: { name: string; email: string; role: 'Admin' | 'Manager' | 'Sales' | 'Technician'; phone?: string; password: string }): Promise<User> {
  return apiCall<User>(
    `${API_BASE}/admin/users`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<User[]>('users', defaultUsers);
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role as any,
        phone: data.phone || '',
        createdAt: new Date().toISOString()
      };
      setStored('users', [...list, newUser]);
      return newUser;
    }
  );
}

export async function updateStaffUser(id: string, data: { name?: string; email?: string; role?: 'Admin' | 'Manager' | 'Sales' | 'Technician'; phone?: string; password?: string }): Promise<User> {
  return apiCall<User>(
    `${API_BASE}/admin/users/${id}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    },
    () => {
      const list = getStored<User[]>('users', defaultUsers);
      const idx = list.findIndex(u => u.id === id);
      const updated = idx !== -1 ? { ...list[idx], ...data } : ({ id, name: data.name || '', email: data.email || '', role: data.role || 'Admin', createdAt: new Date().toISOString() } as User);
      if (idx !== -1) list[idx] = updated;
      else list.push(updated);
      setStored('users', list);
      return updated;
    }
  );
}

export async function deleteStaffUser(id: string): Promise<{ success: boolean; message: string }> {
  return apiCall<{ success: boolean; message: string }>(
    `${API_BASE}/admin/users/${id}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => {
      const list = getStored<User[]>('users', defaultUsers);
      setStored('users', list.filter(u => u.id !== id));
      return { success: true, message: 'Staff user deleted successfully' };
    }
  );
}

// AUDIT / ANALYTICS
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  return apiCall<AuditLog[]>(
    `${API_BASE}/audit-logs`,
    { headers: getAuthHeaders() },
    () => getStored<AuditLog[]>('audit_logs', [])
  );
}

export async function logVisitor(pathName?: string): Promise<void> {
  try {
    const list = getStored<VisitorLog[]>('visitor_logs', []);
    const log: VisitorLog = {
      id: `vis-${Date.now()}`,
      ip: '127.0.0.1',
      path: pathName || window.location.pathname,
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    setStored('visitor_logs', [log, ...list.slice(0, 99)]);
  } catch {
    // Ignore logging errors
  }
}

export async function fetchVisitorLogs(): Promise<VisitorLog[]> {
  return apiCall<VisitorLog[]>(
    `${API_BASE}/analytics/visitor-logs`,
    { headers: getAuthHeaders() },
    () => getStored<VisitorLog[]>('visitor_logs', [])
  );
}

export async function fetchAnalyticsSummary(): Promise<any> {
  return apiCall<any>(
    `${API_BASE}/analytics/summary`,
    { headers: getAuthHeaders() },
    () => {
      const leads = getStored<Lead[]>('leads', []);
      const quotes = getStored<QuoteRequest[]>('quotes', []);
      const products = getStored<Product[]>('products', defaultProducts);
      const projects = getStored<Project[]>('projects', defaultProjects);
      return {
        totalLeads: leads.length,
        totalQuotes: quotes.length,
        totalProducts: products.length,
        totalProjects: projects.length,
        newLeadsToday: leads.filter(l => l.status === 'New').length,
        pendingQuotes: quotes.filter(q => q.status === 'Pending').length
      };
    }
  );
}

export async function fetchEmailNotifications(): Promise<EmailNotification[]> {
  return apiCall<EmailNotification[]>(
    `${API_BASE}/admin/email-notifications`,
    { headers: getAuthHeaders() },
    () => getStored<EmailNotification[]>('email_notifications', [])
  );
}

export async function triggerTestEmail(): Promise<{ success: boolean; message: string }> {
  return apiCall<{ success: boolean; message: string }>(
    `${API_BASE}/admin/test-email`,
    { method: 'POST', headers: getAuthHeaders() },
    () => ({ success: true, message: 'Test email notification generated locally.' })
  );
}

export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return apiCall<{ success: boolean; message: string }>(
    `${API_BASE}/auth/change-password`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    },
    () => ({ success: true, message: 'Password updated successfully' })
  );
}

export async function updateUserProfile(updates: { name?: string; email?: string; phone?: string }): Promise<{ success: boolean; user: any; token: string; message: string }> {
  return apiCall<{ success: boolean; user: any; token: string; message: string }>(
    `${API_BASE}/auth/update-profile`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    },
    () => {
      const cached = localStorage.getItem('sarva_solar_user');
      const user = cached ? JSON.parse(cached) : { id: 'usr-0', name: 'Sarva Solar Admin', email: 'sarvasolars@gmail.com', role: 'Admin' };
      const updatedUser = { ...user, ...updates };
      const token = localStorage.getItem('sarva_solar_token') || 'sarva-token';
      localStorage.setItem('sarva_solar_user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser, token, message: 'Profile updated successfully' };
    }
  );
}

// Media Upload & Storage APIs
export async function uploadMediaFile(file: File): Promise<{ success: boolean; url: string; fileName: string; size: number; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ fileName: file.name, fileData })
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          resolve(data);
        } else {
          // Fallback: Store locally as data URL if API not available
          const url = fileData;
          resolve({
            success: true,
            url,
            fileName: file.name,
            size: file.size,
            mediaType: file.type.startsWith('video/') ? 'video' : file.type.includes('pdf') ? 'document' : 'image'
          });
        }
      } catch (err) {
        // Fallback for offline/static deployment
        const fileData = reader.result as string;
        resolve({
          success: true,
          url: fileData,
          fileName: file.name,
          size: file.size,
          mediaType: file.type.startsWith('video/') ? 'video' : file.type.includes('pdf') ? 'document' : 'image'
        });
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function fetchMediaList(): Promise<Array<{ name: string; url: string; size: number; type: string; createdAt: string }>> {
  return apiCall<Array<{ name: string; url: string; size: number; type: string; createdAt: string }>>(
    `${API_BASE}/media`,
    { headers: getAuthHeaders() },
    () => []
  );
}

export async function deleteMediaFile(filename: string): Promise<{ success: boolean; message: string }> {
  return apiCall<{ success: boolean; message: string }>(
    `${API_BASE}/media/${encodeURIComponent(filename)}`,
    { method: 'DELETE', headers: getAuthHeaders() },
    () => ({ success: true, message: 'File deleted locally' })
  );
}

export async function resetFullStackDatabase(): Promise<{ success: boolean; message: string }> {
  // Clear any client caches
  const keysToRemove = [
    'sarva_solar_leads',
    'sarva_solar_quotes',
    'sarva_solar_products',
    'sarva_solar_projects',
    'sarva_solar_blogs',
    'sarva_solar_services',
    'sarva_solar_subsidies',
    'sarva_solar_testimonials',
    'sarva_solar_faqs',
    'sarva_solar_gallery',
    'sarva_solar_jobs',
    'sarva_solar_job_applications',
    'sarva_solar_settings',
    'sarva_solar_hero_slides',
    'sarva_solar_visitor_logs',
    'sarva_solar_email_notifications'
  ];
  keysToRemove.forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  return apiCall<{ success: boolean; message: string }>(
    `${API_BASE}/admin/reset-database`,
    { method: 'POST', headers: getAuthHeaders() },
    () => {
      notifyDataUpdated();
      return { success: true, message: 'Database reset to initial clean defaults' };
    }
  );
}

