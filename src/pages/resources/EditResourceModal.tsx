import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Resource, useResourcesStore } from '../../stores/resourcesStore';
import { updateResource } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource;
}

const EditResourceModal = ({ isOpen, onClose, resource }: EditResourceModalProps) => {
  const { updateResource: updateResourceInStore } = useResourcesStore();
  
  const [title, setTitle] = useState(resource.title);
  const [sourceUrl, setSourceUrl] = useState(resource.source_url || '');
  const [author, setAuthor] = useState(resource.author || '');
  const [tags, setTags] = useState(resource.tags ? resource.tags.join(', ') : '');
  const [isPrivate, setIsPrivate] = useState(resource.is_private);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Update form when resource changes
  useEffect(() => {
    setTitle(resource.title);
    setSourceUrl(resource.source_url || '');
    setAuthor(resource.author || '');
    setTags(resource.tags ? resource.tags.join(', ') : '');
    setIsPrivate(resource.is_private);
  }, [resource]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Tytuł jest wymagany.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      
      const updatedResource = await updateResource(resource.id, {
        ...resource,
        title: title.trim(),
        source_url: sourceUrl.trim() || null,
        author: author.trim() || null,
        tags: tagsArray,
        is_private: isPrivate,
      });
      
      updateResourceInStore(updatedResource);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas aktualizacji zasobu.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edytuj zasób</h2>
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
              label="Tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tytuł zasobu"
              required
              fullWidth
            />
            
            {!resource.is_note && (
              <Input
                label="URL źródłowy"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com"
                fullWidth
              />
            )}
            
            <Input
              label="Autor (opcjonalnie)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Autor treści"
              fullWidth
            />
            
            <Input
              label="Tagi (oddzielone przecinkami)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Np. javascript, tutorial, dokumentacja"
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
                Zasób prywatny (widoczny tylko dla Ciebie)
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

export default EditResourceModal;