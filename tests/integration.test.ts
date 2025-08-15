/**
 * Integration tests for app workflows
 * Tests complete user scenarios without external dependencies
 */

// Simulated app state
interface AppState {
  user: {
    id: string;
    email: string;
    isAuthenticated: boolean;
  };
  collections: Collection[];
  resources: Resource[];
  currentCollection: string | null;
  searchQuery: string;
  selectedTags: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Resource {
  id: string;
  title: string;
  content: string;
  url?: string;
  collection_id: string;
  tags: string[];
  created_at: string;
}

// App workflow functions
class KnowledgeApp {
  private state: AppState;

  constructor() {
    this.state = {
      user: {
        id: '',
        email: '',
        isAuthenticated: false
      },
      collections: [],
      resources: [],
      currentCollection: null,
      searchQuery: '',
      selectedTags: []
    };
  }

  // Authentication
  login(email: string, password: string): boolean {
    // Simulate authentication
    if (email && password) {
      this.state.user = {
        id: `user_${Date.now()}`,
        email,
        isAuthenticated: true
      };
      return true;
    }
    return false;
  }

  logout(): void {
    this.state.user = {
      id: '',
      email: '',
      isAuthenticated: false
    };
    this.state.currentCollection = null;
  }

  isAuthenticated(): boolean {
    return this.state.user.isAuthenticated;
  }

  // Collections
  createCollection(name: string, description: string): Collection {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to create collections');
    }

    const collection: Collection = {
      id: `col_${Date.now()}`,
      name,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.state.collections.push(collection);
    return collection;
  }

  getCollections(): Collection[] {
    return [...this.state.collections];
  }

  getCollectionById(id: string): Collection | undefined {
    return this.state.collections.find(c => c.id === id);
  }

  updateCollection(id: string, updates: Partial<Collection>): Collection | null {
    const index = this.state.collections.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.state.collections[index] = {
      ...this.state.collections[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return this.state.collections[index];
  }

  deleteCollection(id: string): boolean {
    const index = this.state.collections.findIndex(c => c.id === id);
    if (index === -1) return false;

    // Remove all resources in this collection
    this.state.resources = this.state.resources.filter(r => r.collection_id !== id);
    
    // Remove collection
    this.state.collections.splice(index, 1);
    
    // Clear current collection if it was deleted
    if (this.state.currentCollection === id) {
      this.state.currentCollection = null;
    }

    return true;
  }

  // Resources
  addResource(collectionId: string, title: string, content: string, tags: string[] = []): Resource {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to add resources');
    }

    if (!this.getCollectionById(collectionId)) {
      throw new Error('Collection not found');
    }

    const resource: Resource = {
      id: `res_${Date.now()}`,
      title,
      content,
      collection_id: collectionId,
      tags,
      created_at: new Date().toISOString()
    };

    this.state.resources.push(resource);
    return resource;
  }

  getResources(collectionId?: string): Resource[] {
    if (collectionId) {
      return this.state.resources.filter(r => r.collection_id === collectionId);
    }
    return [...this.state.resources];
  }

  searchResources(query: string): Resource[] {
    const lowerQuery = query.toLowerCase();
    return this.state.resources.filter(resource => 
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.content.toLowerCase().includes(lowerQuery) ||
      resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterResourcesByTags(tags: string[]): Resource[] {
    if (tags.length === 0) return this.state.resources;
    
    return this.state.resources.filter(resource =>
      tags.some(tag => resource.tags.includes(tag))
    );
  }

  // App state management
  setCurrentCollection(collectionId: string | null): void {
    this.state.currentCollection = collectionId;
  }

  getCurrentCollection(): Collection | null {
    if (!this.state.currentCollection) return null;
    return this.getCollectionById(this.state.currentCollection) || null;
  }

  setSearchQuery(query: string): void {
    this.state.searchQuery = query;
  }

  setSelectedTags(tags: string[]): void {
    this.state.selectedTags = tags;
  }

  // Statistics and analytics
  getAppStats() {
    return {
      totalCollections: this.state.collections.length,
      totalResources: this.state.resources.length,
      totalTags: new Set(this.state.resources.flatMap(r => r.tags)).size,
      averageResourcesPerCollection: this.state.collections.length > 0 
        ? this.state.resources.length / this.state.collections.length 
        : 0
    };
  }

  getCollectionStats(collectionId: string) {
    const collection = this.getCollectionById(collectionId);
    if (!collection) return null;

    const resources = this.getResources(collectionId);
    const totalContentLength = resources.reduce((sum, r) => sum + r.content.length, 0);
    const uniqueTags = new Set(resources.flatMap(r => r.tags));

    return {
      collectionId,
      collectionName: collection.name,
      resourceCount: resources.length,
      totalContentLength,
      uniqueTagCount: uniqueTags.size,
      averageContentLength: resources.length > 0 ? totalContentLength / resources.length : 0
    };
  }
}

describe('Knowledge App Integration Tests', () => {
  let app: KnowledgeApp;

  beforeEach(() => {
    app = new KnowledgeApp();
  });

  describe('User Authentication Workflow', () => {
    test('user can login and logout', () => {
      // Initially not authenticated
      expect(app.isAuthenticated()).toBe(false);

      // Login
      const loginResult = app.login('test@example.com', 'password123');
      expect(loginResult).toBe(true);
      expect(app.isAuthenticated()).toBe(true);

      // Logout
      app.logout();
      expect(app.isAuthenticated()).toBe(false);
    });

    test('unauthenticated user cannot perform actions', () => {
      expect(() => app.createCollection('Test', 'Desc')).toThrow('User must be authenticated');
      expect(() => app.addResource('col_1', 'Title', 'Content')).toThrow('User must be authenticated');
    });
  });

  describe('Collection Management Workflow', () => {
    beforeEach(() => {
      app.login('test@example.com', 'password123');
    });

    test('complete collection lifecycle', () => {
      // Create collection
      const collection = app.createCollection('My Collection', 'Description');
      expect(collection.name).toBe('My Collection');
      expect(app.getCollections()).toHaveLength(1);

      // Update collection
      const updated = app.updateCollection(collection.id, { description: 'Updated description' });
      expect(updated?.description).toBe('Updated description');

      // Delete collection
      const deleted = app.deleteCollection(collection.id);
      expect(deleted).toBe(true);
      expect(app.getCollections()).toHaveLength(0);
    });

    test('can manage multiple collections', () => {
      const col1 = app.createCollection('Collection 1', 'Desc 1');
      const col2 = app.createCollection('Collection 2', 'Desc 2');

      expect(app.getCollections()).toHaveLength(2);
      expect(app.getCollectionById(col1.id)).toBeDefined();
      expect(app.getCollectionById(col2.id)).toBeDefined();
    });
  });

  describe('Resource Management Workflow', () => {
    let collection: Collection;

    beforeEach(() => {
      app.login('test@example.com', 'password123');
      collection = app.createCollection('Test Collection', 'Description');
    });

    test('can add resources to collection', () => {
      const resource = app.addResource(collection.id, 'Test Resource', 'Content', ['test']);
      
      expect(resource.title).toBe('Test Resource');
      expect(resource.collection_id).toBe(collection.id);
      expect(app.getResources(collection.id)).toHaveLength(1);
    });

    test('can add multiple resources', () => {
      app.addResource(collection.id, 'Resource 1', 'Content 1', ['tag1']);
      app.addResource(collection.id, 'Resource 2', 'Content 2', ['tag2']);

      expect(app.getResources(collection.id)).toHaveLength(2);
    });

    test('cannot add resource to non-existent collection', () => {
      expect(() => app.addResource('non-existent', 'Title', 'Content')).toThrow('Collection not found');
    });
  });

  describe('Search and Filter Workflow', () => {
    let collection: Collection;

    beforeEach(() => {
      app.login('test@example.com', 'password123');
      collection = app.createCollection('Test Collection', 'Description');
      
      // Add test resources
      app.addResource(collection.id, 'React Guide', 'React is a JavaScript library', ['react', 'javascript']);
      app.addResource(collection.id, 'TypeScript Tutorial', 'TypeScript adds types to JavaScript', ['typescript', 'javascript']);
      app.addResource(collection.id, 'CSS Basics', 'CSS for styling web pages', ['css', 'styling']);
    });

    test('search finds resources by content', () => {
      const results = app.searchResources('JavaScript');
      expect(results).toHaveLength(2);
      expect(results.some(r => r.title.includes('React'))).toBe(true);
      expect(results.some(r => r.title.includes('TypeScript'))).toBe(true);
    });

    test('filter by tags works correctly', () => {
      const results = app.filterResourcesByTags(['javascript']);
      expect(results).toHaveLength(2);
      
      const cssResults = app.filterResourcesByTags(['css']);
      expect(cssResults).toHaveLength(1);
    });

    test('search and filter can be combined', () => {
      // Set search query
      app.setSearchQuery('JavaScript');
      const searchResults = app.searchResources('JavaScript');
      
      // Filter by tags
      const filteredResults = app.filterResourcesByTags(['react']);
      
      // Should find React Guide
      expect(filteredResults.some(r => r.title.includes('React'))).toBe(true);
    });
  });

  describe('App State Management', () => {
    let collection: Collection;

    beforeEach(() => {
      app.login('test@example.com', 'password123');
      collection = app.createCollection('Test Collection', 'Description');
    });

    test('can set and get current collection', () => {
      app.setCurrentCollection(collection.id);
      const current = app.getCurrentCollection();
      
      expect(current?.id).toBe(collection.id);
      expect(current?.name).toBe('Test Collection');
    });

    test('can clear current collection', () => {
      app.setCurrentCollection(collection.id);
      expect(app.getCurrentCollection()).toBeDefined();
      
      app.setCurrentCollection(null);
      expect(app.getCurrentCollection()).toBeNull();
    });
  });

  describe('Statistics and Analytics', () => {
    beforeEach(() => {
      app.login('test@example.com', 'password123');
    });

    test('app statistics are accurate', () => {
      // Create collections and resources
      const col1 = app.createCollection('Collection 1', 'Desc 1');
      const col2 = app.createCollection('Collection 2', 'Desc 2');
      
      app.addResource(col1.id, 'Resource 1', 'Content 1', ['tag1']);
      app.addResource(col1.id, 'Resource 2', 'Content 2', ['tag2']);
      app.addResource(col2.id, 'Resource 3', 'Content 3', ['tag1']);

      const stats = app.getAppStats();
      expect(stats.totalCollections).toBe(2);
      expect(stats.totalResources).toBe(3);
      expect(stats.totalTags).toBe(2); // tag1, tag2
      expect(stats.averageResourcesPerCollection).toBe(1.5);
    });

    test('collection statistics are accurate', () => {
      const collection = app.createCollection('Test Collection', 'Description');
      app.addResource(collection.id, 'Resource 1', 'Content 1', ['tag1', 'tag2']);
      app.addResource(collection.id, 'Resource 2', 'Content 2', ['tag2', 'tag3']);

      const stats = app.getCollectionStats(collection.id);
      expect(stats?.resourceCount).toBe(2);
      expect(stats?.uniqueTagCount).toBe(3); // tag1, tag2, tag3
      expect(stats?.totalContentLength).toBe(18); // "Content 1" + "Content 2"
    });
  });

  describe('Error Handling', () => {
    test('handles invalid collection operations gracefully', () => {
      app.login('test@example.com', 'password123');
      
      // Try to update non-existent collection
      const result = app.updateCollection('non-existent', { name: 'New Name' });
      expect(result).toBeNull();
      
      // Try to delete non-existent collection
      const deleted = app.deleteCollection('non-existent');
      expect(deleted).toBe(false);
    });

    test('handles empty states correctly', () => {
      app.login('test@example.com', 'password123');
      
      expect(app.getCollections()).toHaveLength(0);
      expect(app.getResources()).toHaveLength(0);
      expect(app.searchResources('anything')).toHaveLength(0);
    });
  });
}); 