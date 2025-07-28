import { create } from 'zustand';

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  is_private: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CollectionsState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;
  setCollections: (collections: Collection[]) => void;
  setCurrentCollection: (collection: Collection | null) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (updatedCollection: Collection) => void;
  removeCollection: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,
  setCollections: (collections) => set({ collections }),
  setCurrentCollection: (currentCollection) => set({ currentCollection }),
  addCollection: (collection) => 
    set((state) => ({ collections: [collection, ...state.collections] })),
  updateCollection: (updatedCollection) => 
    set((state) => ({
      collections: state.collections.map((collection) => 
        collection.id === updatedCollection.id ? updatedCollection : collection
      ),
      currentCollection: state.currentCollection?.id === updatedCollection.id 
        ? updatedCollection 
        : state.currentCollection
    })),
  removeCollection: (id) => 
    set((state) => ({
      collections: state.collections.filter((collection) => collection.id !== id),
      currentCollection: state.currentCollection?.id === id ? null : state.currentCollection
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));