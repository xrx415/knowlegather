/**
 * Application functionality tests
 * Tests core app features without external dependencies
 */

// Mock data structures that match the app
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

// Business logic functions for testing
let collectionCounter = 0;
function createCollection(name: string, description: string): Collection {
  const now = new Date().toISOString();
  collectionCounter++;
  return {
    id: `col_${collectionCounter}`,
    name,
    description,
    created_at: now,
    updated_at: now
  };
}

let resourceCounter = 0;
function addResourceToCollection(
  collection: Collection,
  title: string,
  content: string,
  tags: string[] = []
): Resource {
  const now = new Date().toISOString();
  resourceCounter++;
  return {
    id: `res_${resourceCounter}`,
    title,
    content,
    collection_id: collection.id,
    tags,
    created_at: now
  };
}

function searchResources(
  resources: Resource[],
  query: string
): Resource[] {
  const lowerQuery = query.toLowerCase();
  return resources.filter(resource => 
    resource.title.toLowerCase().includes(lowerQuery) ||
    resource.content.toLowerCase().includes(lowerQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

function filterResourcesByTags(
  resources: Resource[],
  tags: string[]
): Resource[] {
  if (tags.length === 0) return resources;
  
  return resources.filter(resource =>
    tags.every(tag => resource.tags.includes(tag))
  );
}

function calculateCollectionStats(collections: Collection[], resources: Resource[]) {
  return collections.map(collection => {
    const collectionResources = resources.filter(r => r.collection_id === collection.id);
    const totalContentLength = collectionResources.reduce((sum, r) => sum + r.content.length, 0);
    const uniqueTags = new Set(collectionResources.flatMap(r => r.tags));
    
    return {
      collectionId: collection.id,
      collectionName: collection.name,
      resourceCount: collectionResources.length,
      totalContentLength,
      uniqueTagCount: uniqueTags.size,
      averageContentLength: collectionResources.length > 0 ? totalContentLength / collectionResources.length : 0
    };
  });
}

describe('Application Functionality Tests', () => {
  let testCollection: Collection;
  let testResources: Resource[];

  beforeEach(() => {
    // Setup test data
    testCollection = createCollection('Test Collection', 'A test collection for testing');
    testResources = [
      addResourceToCollection(testCollection, 'React Basics', 'React is a JavaScript library for building user interfaces', ['react', 'javascript', 'frontend']),
      addResourceToCollection(testCollection, 'TypeScript Guide', 'TypeScript adds static typing to JavaScript', ['typescript', 'javascript', 'programming']),
      addResourceToCollection(testCollection, 'Tailwind CSS', 'Utility-first CSS framework', ['css', 'tailwind', 'styling'])
    ];
  });

  describe('Collection Management', () => {
    test('creates collection with correct properties', () => {
      const collection = createCollection('New Collection', 'Description');
      
      expect(collection.name).toBe('New Collection');
      expect(collection.description).toBe('Description');
      expect(collection.id).toMatch(/^col_\d+$/);
      expect(collection.created_at).toBeDefined();
      expect(collection.updated_at).toBeDefined();
    });

    test('creates multiple collections with unique IDs', () => {
      const col1 = createCollection('Collection 1', 'Desc 1');
      const col2 = createCollection('Collection 2', 'Desc 2');
      
      expect(col1.id).not.toBe(col2.id);
      expect(col1.name).not.toBe(col2.name);
    });
  });

  describe('Resource Management', () => {
    test('adds resource to collection', () => {
      const resource = addResourceToCollection(testCollection, 'Test Resource', 'Content', ['test']);
      
      expect(resource.title).toBe('Test Resource');
      expect(resource.content).toBe('Content');
      expect(resource.collection_id).toBe(testCollection.id);
      expect(resource.tags).toEqual(['test']);
      expect(resource.id).toMatch(/^res_\d+$/);
    });

    test('creates resource without tags', () => {
      const resource = addResourceToCollection(testCollection, 'No Tags', 'Content');
      
      expect(resource.tags).toEqual([]);
    });
  });

  describe('Search Functionality', () => {
    test('finds resources by title', () => {
      const results = searchResources(testResources, 'React');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('React Basics');
    });

    test('finds resources by content', () => {
      const results = searchResources(testResources, 'JavaScript');
      
      expect(results).toHaveLength(2);
      expect(results.some(r => r.title === 'React Basics')).toBe(true);
      expect(results.some(r => r.title === 'TypeScript Guide')).toBe(true);
    });

    test('finds resources by tags', () => {
      const results = searchResources(testResources, 'css');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Tailwind CSS');
    });

    test('returns empty array for no matches', () => {
      const results = searchResources(testResources, 'Python');
      
      expect(results).toHaveLength(0);
    });

    test('case insensitive search', () => {
      const results = searchResources(testResources, 'react');
      
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('React Basics');
    });
  });

  describe('Tag Filtering', () => {
    test('filters resources by single tag', () => {
      const results = filterResourcesByTags(testResources, ['javascript']);
      
      expect(results).toHaveLength(2);
      expect(results.some(r => r.title === 'React Basics')).toBe(true);
      expect(results.some(r => r.title === 'TypeScript Guide')).toBe(true);
    });

    test('filters resources by multiple tags', () => {
      const results = filterResourcesByTags(testResources, ['javascript', 'frontend']);
      
      // Should find React Basics (has both javascript and frontend tags)
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('React Basics');
    });

    test('returns all resources when no tags specified', () => {
      const results = filterResourcesByTags(testResources, []);
      
      expect(results).toHaveLength(3);
    });

    test('returns empty array when no matches', () => {
      const results = filterResourcesByTags(testResources, ['python']);
      
      expect(results).toHaveLength(0);
    });
  });

  describe('Collection Statistics', () => {
    test('calculates collection statistics correctly', () => {
      const stats = calculateCollectionStats([testCollection], testResources);
      
      expect(stats).toHaveLength(1);
      expect(stats[0].collectionName).toBe('Test Collection');
      expect(stats[0].resourceCount).toBe(3);
      expect(stats[0].uniqueTagCount).toBe(8); // react, javascript, frontend, typescript, programming, css, tailwind, styling
    });

    test('handles empty collection', () => {
      const emptyCollection = createCollection('Empty', 'No resources');
      const stats = calculateCollectionStats([emptyCollection], []);
      
      expect(stats[0].resourceCount).toBe(0);
      expect(stats[0].totalContentLength).toBe(0);
      expect(stats[0].averageContentLength).toBe(0);
    });

    test('calculates average content length', () => {
      const stats = calculateCollectionStats([testCollection], testResources);
      const totalLength = testResources.reduce((sum, r) => sum + r.content.length, 0);
      
      expect(stats[0].averageContentLength).toBe(totalLength / 3);
    });
  });

  describe('Data Validation', () => {
    test('collection has required fields', () => {
      const collection = createCollection('Test', 'Desc');
      
      expect(collection).toHaveProperty('id');
      expect(collection).toHaveProperty('name');
      expect(collection).toHaveProperty('description');
      expect(collection).toHaveProperty('created_at');
      expect(collection).toHaveProperty('updated_at');
    });

    test('resource has required fields', () => {
      const resource = addResourceToCollection(testCollection, 'Title', 'Content');
      
      expect(resource).toHaveProperty('id');
      expect(resource).toHaveProperty('title');
      expect(resource).toHaveProperty('content');
      expect(resource).toHaveProperty('collection_id');
      expect(resource).toHaveProperty('tags');
      expect(resource).toHaveProperty('created_at');
    });
  });
}); 