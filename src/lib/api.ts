const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

// Token management
const tokenManager = {
  getToken: (): string | null => localStorage.getItem('adminToken'),
  setToken: (token: string) => localStorage.setItem('adminToken', token),
  clearToken: () => localStorage.removeItem('adminToken'),
};

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (requiresAuth) {
    const token = tokenManager.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && requiresAuth) {
    tokenManager.clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response.json();
}

// Auth helper for admin requests
async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, options, true);
}

export const api = {
  // Token management
  token: tokenManager,

  // Health
  health: () => fetchApi('/health'),

  // ========== ADMIN AUTH ==========
  admin: {
    login: (email: string, password: string) =>
      fetchApi<{ token: string; admin: Admin }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: { email: string; password: string; name: string; role: string }) =>
      adminFetch('/api/admin/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getProfile: () => adminFetch<Admin>('/api/admin/me'),

    changePassword: (currentPassword: string, newPassword: string) =>
      adminFetch('/api/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // ========== EVENTS ==========
  // Public
  getEvents: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/events${query}`);
  },
  getEvent: (id: string) => fetchApi(`/api/events/${id}`),

  // Admin (requires auth)
  getAdminEvents: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/events${query}`);
  },
  createEvent: (data: EventInput) =>
    adminFetch('/api/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id: string, data: Partial<EventInput>) =>
    adminFetch(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id: string) =>
    adminFetch(`/api/events/${id}`, { method: 'DELETE' }),

  // ========== CREATORS ==========
  // Public
  getCreators: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/creators${query}`);
  },
  getCreator: (id: string) => fetchApi(`/api/creators/${id}`),
  getCreatorCategories: () => fetchApi('/api/creators/categories'),

  // Admin (requires auth)
  getAdminCreators: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/creators/admin/all${query}`);
  },
  createCreator: (data: CreatorInput) =>
    adminFetch('/api/creators', { method: 'POST', body: JSON.stringify(data) }),
  updateCreator: (id: string, data: Partial<CreatorInput>) =>
    adminFetch(`/api/creators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCreator: (id: string) =>
    adminFetch(`/api/creators/${id}`, { method: 'DELETE' }),

  // ========== BUILDER PROJECTS ==========
  // Public
  getProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/builders/projects${query}`);
  },
  getProject: (id: string) => fetchApi(`/api/builders/projects/${id}`),
  getProjectBySlug: (slug: string) => fetchApi(`/api/builders/projects/slug/${slug}`),
  getProjectCategories: () => fetchApi('/api/builders/projects/categories'),

  // Admin (requires auth)
  getAdminProjects: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/builders/projects/admin/all${query}`);
  },
  createProject: (data: ProjectInput) =>
    adminFetch('/api/builders/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<ProjectInput>) =>
    adminFetch(`/api/builders/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    adminFetch(`/api/builders/projects/${id}`, { method: 'DELETE' }),

  // ========== RESOURCES ==========
  // Public
  getResources: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/resources${query}`);
  },
  getResourceBySlug: (slug: string) => fetchApi(`/api/resources/${slug}`),

  // Admin (requires auth)
  getAdminResources: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/resources/admin/all${query}`);
  },
  createResource: (data: ResourceInput) =>
    adminFetch('/api/resources', { method: 'POST', body: JSON.stringify(data) }),
  updateResource: (id: string, data: Partial<ResourceInput>) =>
    adminFetch(`/api/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteResource: (id: string) =>
    adminFetch(`/api/resources/${id}`, { method: 'DELETE' }),

  // ========== BLOGS ==========
  // Public
  getBlogs: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/blogs${query}`);
  },
  getFeaturedBlog: () => fetchApi('/api/blogs/featured'),
  getBlogBySlug: (slug: string) => fetchApi(`/api/blogs/slug/${slug}`),
  getBlogCategories: () => fetchApi('/api/blogs/categories'),
  getTrendingTopics: () => fetchApi('/api/blogs/trending'),

  // Admin (requires auth)
  getAdminBlogs: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/blogs/admin/all${query}`);
  },
  createBlog: (data: BlogInput) =>
    adminFetch('/api/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id: string, data: Partial<BlogInput>) =>
    adminFetch(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id: string) =>
    adminFetch(`/api/blogs/${id}`, { method: 'DELETE' }),

  // ========== SHOWCASE ==========
  // Public
  getShowcase: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/api/showcase${query}`);
  },
  getShowcaseCategories: () => fetchApi('/api/showcase/categories'),
  getShowcaseStats: () => fetchApi('/api/showcase/stats'),
  getFeaturedShowcase: () => fetchApi('/api/showcase/featured'),
  getTrendingShowcase: () => fetchApi('/api/showcase/trending'),
  getShowcaseBySlug: (slug: string) => fetchApi(`/api/showcase/slug/${slug}`),

  // Admin (requires auth)
  getAdminShowcase: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/showcase/admin/all${query}`);
  },
  createShowcase: (data: ShowcaseInput) =>
    adminFetch('/api/showcase', { method: 'POST', body: JSON.stringify(data) }),
  updateShowcase: (id: string, data: Partial<ShowcaseInput>) =>
    adminFetch(`/api/showcase/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteShowcase: (id: string) =>
    adminFetch(`/api/showcase/${id}`, { method: 'DELETE' }),

  // ========== NEWSLETTER ==========
  // Admin only
  getSubscribers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/newsletter/subscribers${query}`);
  },
  deleteSubscriber: (id: string) =>
    adminFetch(`/api/newsletter/subscribers/${id}`, { method: 'DELETE' }),

  // ========== CONTACT ==========
  // Admin only
  getContacts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return adminFetch(`/api/contact${query}`);
  },
  getContact: (id: string) => adminFetch(`/api/contact/${id}`),
  updateContactStatus: (id: string, status: string) =>
    adminFetch(`/api/contact/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteContact: (id: string) =>
    adminFetch(`/api/contact/${id}`, { method: 'DELETE' }),
};

// ========== TYPE DEFINITIONS ==========

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'editor';
  createdAt?: string;
}

export interface EventInput {
  title: string;
  date?: string;
  location?: string;
  attendees?: number;
  description?: string;
  type?: string;
  price?: string;
  status?: string;
  bannerImage?: string;
  registrationUrl?: string;
}

export interface CreatorInput {
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  expertise?: string[];
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  stats?: {
    projects?: number;
    followers?: string;
    contributions?: number;
  };
  featured?: boolean;
  published?: boolean;
  color?: 'mint' | 'gold';
}

export interface ProjectInput {
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  estimatedTime?: string;
  technologies?: string[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  steps?: Array<{
    title: string;
    content: string;
    order: number;
  }>;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  published?: boolean;
}

export interface ResourceInput {
  title: string;
  description?: string;
  category?: string;
  type?: 'guide' | 'tutorial' | 'documentation' | 'tool' | 'video' | 'course' | string;
  url?: string;
  image?: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  published?: boolean;
}

export interface BlogInput {
  title: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  category?: 'News' | 'Tutorial' | 'Guide' | 'Industry News' | 'Analysis' | 'Updates' | string;
  image?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  published?: boolean;
  color?: string;
}

export interface ShowcaseInput {
  title: string;
  description?: string;
  category?: 'DeFi' | 'NFT' | 'DAO' | 'GameFi' | 'Infrastructure' | 'Social' | 'Tools' | 'Other' | string;
  creator?: string;
  image?: string;
  tags?: string[];
  stats?: {
    stars?: number;
    users?: string;
    tvl?: string;
  };
  links?: {
    website?: string;
    github?: string;
    twitter?: string;
    discord?: string;
    documentation?: string;
  };
  featured?: boolean;
  trending?: boolean;
  color?: 'mint' | 'gold';
  published?: boolean;
}

export type { ApiResponse };
