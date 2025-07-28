import { create } from 'zustand';

export interface Resource {
  id: string;
  title: string;
  content: string;
  source_url: string | null;
  tags: string[];
  is_private: boolean;
  is_note: boolean;
  author: string | null;
  collection_id: string;
  created_at: string;
  updated_at: string;
}

interface ResourcesState {
  resources: Resource[];
  currentResource: Resource | null;
  isLoading: boolean;
  error: string | null;
  setResources: (resources: Resource[]) => void;
  setCurrentResource: (resource: Resource | null) => void;
  addResource: (resource: Resource) => void;
  updateResource: (updatedResource: Resource) => void;
  removeResource: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResourcesStore = create<ResourcesState>((set) => ({
  resources: [],
  currentResource: null,
  isLoading: false,
  error: null,
  setResources: (resources) => set({ resources }),
  setCurrentResource: (currentResource) => set({ currentResource }),
  addResource: (resource) => 
    set((state) => ({ resources: [resource, ...state.resources] })),
  updateResource: (updatedResource) => 
    set((state) => ({
      resources: state.resources.map((resource) => 
        resource.id === updatedResource.id ? updatedResource : resource
      ),
      currentResource: state.currentResource?.id === updatedResource.id 
        ? updatedResource 
        : state.currentResource
    })),
  removeResource: (id) => 
    set((state) => ({
      resources: state.resources.filter((resource) => resource.id !== id),
      currentResource: state.currentResource?.id === id ? null : state.currentResource
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));