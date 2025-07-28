import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCollectionsStore, Collection } from '../../../stores/collectionsStore';
import { updateCollection } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
}

const EditCollectionModal = ({ isOpen, onClose, collection }: EditCollectionModalProps) => {
  const { updateCollection: updateCollectionInStore } = useCollectionsStore();
  
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description || '');
  const [tags, setTags] = useState(collection.tags ? collection.tags.join(', ') : '');
  const [isPrivate, setIsPrivate] = useState(collection.is_private);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Update form when collection changes
  useEffect(() => {
    setName(collection.name);
    setDescription(collection.description || '');
    setTags(collection.tags ? collection.tags.join(', ') : '');
    setIsPrivate(collection.is_private);
  }, [collection]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Nazwa kolekcji jest wymagana.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      
      const updatedCollection = await updateCollection(
        collection.id,
        {
          name: name.trim(),
          description: description.trim() || null,
          tags: tagsArray,
          is_private: isPrivate,
        }
      );
      
      updateCollectionInStore(updatedCollection);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas aktualizacji kolekcji.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edytuj kolekcję</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              label="Nazwa kolekcji"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Np. JavaScript Podstawy"
              required
              fullWidth
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis (opcjonalnie)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Krótki opis kolekcji..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                rows={3}
              />
            </div>
            
            <Input
              label="Tagi (oddzielone przecinkami)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Np. javascript, frontend, web"
              fullWidth
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                Kolekcja prywatna (widoczna tylko dla Ciebie)
              </label>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollectionModal;