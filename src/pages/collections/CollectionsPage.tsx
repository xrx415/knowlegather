import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCollectionsStore, Collection } from '../../stores/collectionsStore';
import { fetchCollections } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import CollectionCard from '../../components/collections/CollectionCard';
import AiChat from '../../components/ai/AiChat';
import Input from '../../components/ui/Input';
import CreateCollectionModal from './modals/CreateCollectionModal';
import FilterModal, { FilterOptions } from './modals/FilterModal';

const CollectionsPage = () => {
  const { user } = useAuthStore();
  const { collections, setCollections, isLoading, setLoading, error, setError } = useCollectionsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    privacy: 'all',
    tags: [],
  });
  
  useEffect(() => {
    const loadCollections = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const collectionsData = await fetchCollections(user.id);
        setCollections(collectionsData);
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas pobierania kolekcji.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCollections();
  }, [user, setCollections, setLoading, setError]);
  
  const filteredCollections = collections.filter((collection) => {
    // Privacy filter
    if (filters.privacy === 'private' && !collection.is_private) return false;
    if (filters.privacy === 'public' && collection.is_private) return false;
    
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      collection.name.toLowerCase().includes(searchLower) ||
      collection.description?.toLowerCase().includes(searchLower) ||
      collection.tags?.some(tag => tag.toLowerCase().includes(searchLower));
    
    return matchesSearch;
  });
  
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moje kolekcje wiedzy</h1>
          <p className="text-gray-600 mt-1">
            Zarządzaj swoimi kolekcjami i organizuj wiedzę
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Nowa kolekcja
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Szukaj kolekcji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              icon={<Search size={16} className="text-gray-400" />}
            />
          </div>
          <Button
            variant="outline"
            icon={<Filter size={16} />}
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filtry
            {(filters.privacy !== 'all' || filters.tags.length > 0) && (
              <span className="ml-2 bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 rounded-full">
                {filters.privacy !== 'all' ? 1 : 0}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-middle"></div>
          <p className="mt-2 text-gray-600">Ładowanie kolekcji...</p>
        </div>
      ) : error ? (
        <div className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-md">
          {error}
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          {searchTerm || filters.privacy !== 'all' ? (
            <>
              <p className="text-gray-600 mb-2">
                Nie znaleziono kolekcji spełniających kryteria wyszukiwania
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ privacy: 'all', tags: [] });
                  }}
                >
                  Wyczyść filtry
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nie masz jeszcze żadnych kolekcji
              </h3>
              <p className="text-gray-600 mb-4">
                Utwórz swoją pierwszą kolekcję, aby rozpocząć gromadzenie wiedzy
              </p>
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Utwórz kolekcję
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
      
      {/* Modals */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
      
      {/* AI Chat */}
      <AiChat />
    </div>
  );
};

export default CollectionsPage;