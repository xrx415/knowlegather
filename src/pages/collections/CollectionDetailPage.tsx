import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Globe,
  FileText,
  FileCode,
  Upload,
  Download,
  Tag,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCollectionsStore } from '../../stores/collectionsStore';
import { useResourcesStore, Resource } from '../../stores/resourcesStore';
import {
  fetchCollectionById,
  fetchResourcesByCollectionId,
  deleteCollection
} from '../../lib/supabase';
import Button from '../../components/ui/Button';
import ResourceItem from '../../components/resources/ResourceItem';
import AiChat from '../../components/ai/AiChat';
import AddResourceModal from './modals/AddResourceModal';
import EditCollectionModal from './modals/EditCollectionModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ResourceViewer from '../resources/ResourceViewer';
import ResourceViewerMDX from '../resources/ResourceViewerMDX';
import { useSidebarPortal } from '../../contexts/SidebarPortalContext';

const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentCollection, 
    setCurrentCollection,
    removeCollection 
  } = useCollectionsStore();
  const {
    resources,
    setResources,
    currentResource,
    setCurrentResource,
    isLoading: resourcesLoading,
    setLoading: setResourcesLoading,
    error: resourcesError,
    setError: setResourcesError
  } = useResourcesStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState(false);
  const [initialResourceTab, setInitialResourceTab] = useState<'url' | 'note' | 'file'>('url');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [useMDX, setUseMDX] = useState(false);
  const sidebarSlot = useSidebarPortal();
  
  // Load collection and resources
  useEffect(() => {
    const loadCollection = async () => {
      if (!id || !user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const collectionData = await fetchCollectionById(id, user.id);
        setCurrentCollection(collectionData);
        
        setResourcesLoading(true);
        const resourcesData = await fetchResourcesByCollectionId(id);
        setResources(resourcesData);
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas pobierania kolekcji.');
        setResourcesError(err.message || 'Wystąpił błąd podczas pobierania zasobów.');
      } finally {
        setIsLoading(false);
        setResourcesLoading(false);
      }
    };
    
    loadCollection();
    
    // Cleanup
    return () => {
      setCurrentCollection(null);
      setResources([]);
      setCurrentResource(null);
    };
  }, [id, user, setCurrentCollection, setResources, setCurrentResource, setResourcesLoading, setResourcesError]);
  
  const handleResourceSelect = (resource: Resource) => {
    setCurrentResource(resource);
  };
  
  const handleDeleteCollection = async () => {
    if (!id) return;
    
    try {
      await deleteCollection(id);
      removeCollection(id);
      navigate('/collections');
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas usuwania kolekcji.');
    }
  };

  const handleAddResource = (type: 'url' | 'note' | 'file') => {
    setInitialResourceTab(type);
    setIsAddResourceModalOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-middle"></div>
        <p className="mt-2 text-gray-600">Ładowanie kolekcji...</p>
      </div>
    );
  }
  
  if (error || !currentCollection) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-md">
          {error || 'Nie znaleziono kolekcji.'}
        </div>
        <div className="mt-4">
          <Button
            variant="outline"
            icon={<ChevronLeft size={16} />}
            onClick={() => navigate('/collections')}
          >
            Powrót do listy kolekcji
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Collection header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              icon={<ChevronLeft size={16} />}
              onClick={() => navigate('/collections')}
            >
              Kolekcje
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{currentCollection.name}</h1>
            <div className="ml-3">
              {currentCollection.is_private ? (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  Prywatna
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <Globe className="h-3 w-3 mr-1" />
                  Publiczna
                </span>
              )}
            </div>
          </div>
          {currentCollection.description && (
            <p className="text-gray-600">{currentCollection.description}</p>
          )}
          {currentCollection.tags && currentCollection.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {currentCollection.tags.map((tag, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={() => setUseMDX(!useMDX)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              useMDX 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Przełącz renderer markdown"
          >
            {useMDX ? '⚡ MDX' : '📝 Markdown'}
          </button>
          <Button
            variant="outline"
            size="sm"
            icon={<Edit size={16} />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edytuj
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Usuń
          </Button>
        </div>
      </div>
      
      {/* Resources sidebar — rendered into unified sidebar via portal */}
      {sidebarSlot && createPortal(
        <div className="flex flex-col h-full border-t border-gray-200 bg-gray-50">
          <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
            <h2 className="font-medium text-sm text-gray-900">Zasoby</h2>
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => handleAddResource('url')}
                className="p-1"
                aria-label="Dodaj zasób"
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<Upload size={16} />}
                onClick={() => handleAddResource('file')}
                className="p-1"
                aria-label="Wczytaj plik"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {resourcesLoading ? (
              <div className="text-center py-6">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary-500 border-r-transparent align-middle"></div>
                <p className="mt-2 text-xs text-gray-500">Ładowanie...</p>
              </div>
            ) : resourcesError ? (
              <div className="p-3 text-sm text-error-700">
                {resourcesError}
              </div>
            ) : resources.length === 0 ? (
              <div className="p-3 text-center">
                <p className="text-sm text-gray-500">Brak zasobów w tej kolekcji</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus size={16} />}
                  onClick={() => handleAddResource('url')}
                  className="mt-2"
                >
                  Dodaj pierwszy zasób
                </Button>
              </div>
            ) : (
              resources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onClick={() => handleResourceSelect(resource)}
                  isActive={currentResource?.id === resource.id}
                />
              ))
            )}
          </div>
        </div>,
        sidebarSlot
      )}

      {/* Resource viewer — full width */}
      <div className="flex-1 overflow-hidden flex flex-col border border-gray-200 rounded-lg shadow-sm">
        {useMDX ? (
          <ResourceViewerMDX
            resource={currentResource}
            onAddResource={() => handleAddResource('url')}
          />
        ) : (
          <ResourceViewer
            resource={currentResource}
            onAddResource={() => handleAddResource('url')}
          />
        )}
      </div>
      
      {/* Modals */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => {
          setIsAddResourceModalOpen(false);
          setInitialResourceTab('url');
        }}
        collectionId={currentCollection.id}
        initialTab={initialResourceTab}
      />
      
      <EditCollectionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        collection={currentCollection}
      />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCollection}
        title="Usunąć kolekcję?"
        message={`Czy na pewno chcesz usunąć kolekcję "${currentCollection.name}"? Ta operacja jest nieodwracalna i spowoduje usunięcie wszystkich zasobów w tej kolekcji.`}
        confirmText="Usuń kolekcję"
        confirmVariant="danger"
      />
      
      {/* AI Chat */}
      <AiChat collection={currentCollection} currentResource={currentResource} />
    </div>
  );
};

export default CollectionDetailPage;