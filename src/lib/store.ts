import { getFrontendSupabase } from './supabaseClient';

export interface Registration {
  id: number;
  created_at: string;
  division: string;
  roll_number: number;
  name: string;
  topic: string;
  project_topic?: string | null;
  member2_project_topic?: string | null;
  has_uploaded: boolean;
  file_id: string | null;
  file_link: string | null;
  member2_roll_number: number | null;
  member2_name: string | null;
}

export interface TopicData {
  id: number;
  division: string;
  topic: string;
  project_topic?: string | null;
  member2_project_topic?: string | null;
  has_uploaded: boolean;
}

class CentralStore {
  private topics: TopicData[] = [];
  private registrations: Registration[] = [];
  private topicsLoaded = false;
  private registrationsLoaded = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Try to load cached topics from sessionStorage for instant 0ms render
    try {
      const cached = sessionStorage.getItem('evs_cached_topics');
      if (cached) {
        this.topics = JSON.parse(cached);
        this.topicsLoaded = true;
      }
    } catch {
      // ignore cache read error
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ---------------------------------------------------------
  // TOPICS MANAGEMENT (0ms Instant Browsing)
  // ---------------------------------------------------------
  getTopics(): TopicData[] {
    return this.topics;
  }

  isTopicsLoaded(): boolean {
    return this.topicsLoaded;
  }

  async loadTopics(forceRefresh = false): Promise<TopicData[]> {
    if (this.topicsLoaded && !forceRefresh && this.topics.length > 0) {
      // Background revalidation
      this.fetchTopicsFromSource().then(fresh => {
        if (JSON.stringify(fresh) !== JSON.stringify(this.topics)) {
          this.topics = fresh;
          this.saveTopicsCache();
          this.notify();
        }
      });
      return this.topics;
    }

    const data = await this.fetchTopicsFromSource();
    this.topics = data;
    this.topicsLoaded = true;
    this.saveTopicsCache();
    this.notify();
    return this.topics;
  }

  private saveTopicsCache() {
    try {
      sessionStorage.setItem('evs_cached_topics', JSON.stringify(this.topics));
    } catch {
      // ignore cache write error
    }
  }

  private async fetchTopicsFromSource(): Promise<TopicData[]> {
    const supabase = getFrontendSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('id, division, topic, project_topic, member2_project_topic, has_uploaded')
          .order('division', { ascending: true })
          .order('id', { ascending: false });

        if (!error && data) {
          return data as TopicData[];
        }
      } catch (e) {
        console.warn('Direct Supabase fetchTopics failed, falling back to API:', e);
      }
    }

    try {
      const response = await fetch('/api/topics');
      if (response.ok) {
        const json = await response.json();
        return json.topics || [];
      }
    } catch (err) {
      console.error('Fetch topics error:', err);
    }
    return this.topics;
  }

  // ---------------------------------------------------------
  // ADMIN REGISTRATIONS MANAGEMENT (Latest Submission First)
  // ---------------------------------------------------------
  getRegistrations(): Registration[] {
    // Ensure registrations are sorted latest submission first
    return [...this.registrations].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return b.id - a.id;
    });
  }

  isRegistrationsLoaded(): boolean {
    return this.registrationsLoaded;
  }

  async loadRegistrations(token?: string | null, pin?: string): Promise<Registration[]> {
    const supabase = getFrontendSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          this.registrations = data as Registration[];
          this.registrationsLoaded = true;
          this.notify();
          return this.getRegistrations();
        }
      } catch (e) {
        console.warn('Direct Supabase fetchRegistrations failed, falling back to API:', e);
      }
    }

    try {
      const activeToken = token || sessionStorage.getItem('evs_admin_token');
      const response = await fetch('/api/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${activeToken || ''}`,
          'x-admin-pin': pin || ''
        }
      });
      if (response.ok) {
        const json = await response.json();
        this.registrations = json.registrations || [];
        this.registrationsLoaded = true;
        this.notify();
      }
    } catch (err) {
      console.error('Fetch registrations error:', err);
    }
    return this.getRegistrations();
  }

  async deleteRegistration(id: number, token?: string | null, pin?: string): Promise<boolean> {
    const itemToDelete = this.registrations.find(r => r.id === id);
    
    // Direct Supabase delete attempt
    const supabase = getFrontendSupabase();
    let success = false;

    if (supabase) {
      try {
        const { error } = await supabase.from('registrations').delete().eq('id', id);
        if (!error) success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const activeToken = token || sessionStorage.getItem('evs_admin_token');
        const response = await fetch(`/api/admin/registrations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${activeToken || ''}`,
            'x-admin-pin': pin || ''
          }
        });
        if (response.ok) success = true;
      } catch {
        success = false;
      }
    }

    if (success && itemToDelete) {
      // Remove from store
      this.registrations = this.registrations.filter(r => r.id !== id);
      this.topics = this.topics.filter(t => t.id !== id);
      this.saveTopicsCache();
      this.notify();
    }

    return success;
  }
}

export const store = new CentralStore();
