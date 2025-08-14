import { useState, useRef } from 'react';
import { X, Globe, FileText, ExternalLink, Upload } from 'lucide-react';
import { useResourcesStore } from '../../../stores/resourcesStore';
import { createResource } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  initialTab?: 'url' | 'note' | 'file';
}

const AddResourceModal = ({ isOpen, onClose, collectionId, initialTab = 'url' }: AddResourceModalProps) => {
  const { addResource } = useResourcesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'url' | 'note' | 'file'>(initialTab);
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const suggestTags = async (text: string, title: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ text, title })
      });

      if (!response.ok) {
        throw new Error('Nie udało się wygenerować tagów.');
      }

      const { suggestedTags } = await response.json();
      if (suggestedTags && suggestedTags.length > 0) {
        setTags(suggestedTags.join(', '));
      }
    } catch (err) {
      // Don't show error to user - tag suggestion is optional
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('text/') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setError('Dozwolone są tylko pliki tekstowe (.txt, .md) lub pliki z rozszerzeniem text/*');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const text = await file.text();
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      
      setContent(text);
      setTitle(fileName);
      
      // Suggest tags based on file content and name
      await suggestTags(text, fileName);
    } catch (err: any) {
      setError('Nie udało się odczytać pliku. Upewnij się, że plik jest w formacie tekstowym.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScrapeUrl = async () => {
    if (!sourceUrl.trim()) {
      setError('URL jest wymagany.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ url: sourceUrl })
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać treści strony.');
      }

      const data = await response.json();
      
      if (data.title) {
        setTitle(data.title);
      }
      if (data.content) {
        setContent(data.content);
      }
      if (data.suggestedTags) {
        setTags(data.suggestedTags.join(', '));
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas pobierania treści.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    
    // Suggest tags when content is added for notes
    if (activeTab === 'note' && newContent.trim().length > 50) {
      await suggestTags(newContent, title);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Tytuł jest wymagany.');
      return;
    }
    
    if (activeTab === 'url' && !sourceUrl.trim()) {
      setError('URL źródłowy jest wymagany.');
      return;
    }
    
    if (!content.trim()) {
      setError('Treść jest wymagana.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      
      const resourceData = {
        title: title.trim(),
        content: content.trim(),
        source_url: activeTab === 'url' ? sourceUrl.trim() : null,
        tags: tagsArray,
        is_private: isPrivate,
        is_note: activeTab === 'note',
        author: author.trim() || null,
        collection_id: collectionId,
      };
      
      const newResource = await createResource(resourceData);
      
      addResource(newResource);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas dodawania zasobu.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setSourceUrl('');
    setContent('');
    setAuthor('');
    setTags('');
    setIsPrivate(true);
    setActiveTab(initialTab);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Dodaj nowy zasób</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'url'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('url')}
          >
            <div className="flex items-center justify-center">
              <Globe size={16} className="mr-2" />
              Pobierz stronę
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'note'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('note')}
          >
            <div className="flex items-center justify-center">
              <FileText size={16} className="mr-2" />
              Utwórz notatkę
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'file'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('file')}
          >
            <div className="flex items-center justify-center">
              <Upload size={16} className="mr-2" />
              Wczytaj plik
            </div>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {activeTab === 'url' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      label="URL strony"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com"
                      fullWidth
                      required
                    />
                  </div>
                  <div className="md:self-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleScrapeUrl}
                      isLoading={isLoading}
                      icon={<ExternalLink size={16} />}
                    >
                      Pobierz
                    </Button>
                  </div>
                </div>
                
                <Input
                  label="Autor (opcjonalnie)"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Autor treści"
                  fullWidth
                />
              </div>
            )}
            
            {activeTab === 'file' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wybierz plik tekstowy
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,text/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Dozwolone formaty: .txt, .md lub pliki tekstowe
                  </p>
                </div>
              </div>
            )}
            
            <Input
              label="Tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activeTab === 'url' 
                  ? 'Tytuł strony (automatycznie pobrany)' 
                  : activeTab === 'file'
                  ? 'Tytuł zasobu (domyślnie nazwa pliku)'
                  : 'Tytuł notatki'
              }
              fullWidth
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treść
              </label>
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={
                  activeTab === 'url' 
                    ? 'Treść strony (automatycznie pobrana)' 
                    : activeTab === 'file'
                    ? 'Treść pliku (automatycznie wczytana)'
                    : 'Treść notatki'
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                rows={10}
                required
              />
            </div>
            
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
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              Dodaj zasób
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;