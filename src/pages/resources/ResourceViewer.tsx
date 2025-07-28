import { useState } from 'react';
import { 
  ExternalLink, 
  Edit, 
  Trash2, 
  MoreVertical,
  Copy,
  Download,
  Tag,
  MessageSquareText,
  Globe,
  FileText,
  Settings
} from 'lucide-react';
import { Resource, useResourcesStore } from '../../stores/resourcesStore';
import { formatDateTime } from '../../lib/dateUtils';
import Button from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import EditResourceModal from './EditResourceModal';
import { deleteResource, updateResource } from '../../lib/supabase';

interface ResourceViewerProps {
  resource: Resource | null;
  onAddResource?: () => void;
}

const ResourceViewer = ({ resource, onAddResource }: ResourceViewerProps) => {
  const { removeResource, updateResource: updateResourceInStore } = useResourcesStore();
  const [showActions, setShowActions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const handleCopyContent = async () => {
    if (!resource) return;
    
    try {
      await navigator.clipboard.writeText(resource.content);
      // Optional: Show a success toast/notification
    } catch (err) {
      setError('Nie udało się skopiować treści do schowka.');
    }
  };
  
  const handleDownload = () => {
    if (!resource) return;
    
    const blob = new Blob([resource.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  const handleDelete = async () => {
    if (!resource) return;
    
    try {
      await deleteResource(resource.id);
      removeResource(resource.id);
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas usuwania zasobu.');
    }
  };

  const handleSave = async () => {
    if (!resource) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const updatedResource = await updateResource(resource.id, {
        ...resource,
        content: editedContent,
      });
      
      updateResourceInStore(updatedResource);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Nie udało się zapisać zmian.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSummarizeWithAI = async () => {
    if (!resource) return;
    setIsSummarizing(true);
    setAiError(null);
    setAiSummary(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Stwórz krótkie podsumowanie poniższej treści:
${resource.content}` }
          ],
          context: `Resource: ${resource.title}`
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAiSummary(data.message.content);
    } catch (error: any) {
      setAiError(error.message || 'Wystąpił błąd podczas komunikacji z AI.');
    } finally {
      setIsSummarizing(false);
    }
  };
  
  if (!resource) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="rounded-full bg-gray-100 p-3 mx-auto mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Wybierz zasób
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Wybierz zasób z listy lub dodaj nowy zasób do kolekcji
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Globe size={16} />}
              onClick={onAddResource}
            >
              Pobierz stronę
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<FileText size={16} />}
              onClick={onAddResource}
            >
              Utwórz notatkę
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Resource header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-medium text-gray-900">{resource.title}</h2>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              {resource.author && (
                <span className="mr-3">Autor: {resource.author}</span>
              )}
              <span>Dodano: {formatDateTime(new Date(resource.created_at))}</span>
            </div>
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<MoreVertical size={16} />}
              className="p-1"
              onClick={() => setShowActions(!showActions)}
              aria-label="Więcej opcji"
            >
              {''}
            </Button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-30 animate-fade-in">
                <button
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Settings size={16} className="mr-2" />
                  Edytuj szczegóły
                </button>
                <button
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    setIsEditing(true);
                    setEditedContent(resource.content);
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Edytuj treść
                </button>
                <button
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    handleCopyContent();
                    setShowActions(false);
                  }}
                >
                  <Copy size={16} className="mr-2" />
                  Kopiuj treść
                </button>
                <button
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    handleDownload();
                    setShowActions(false);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Pobierz
                </button>
                <button
                  className="w-full text-left block px-4 py-2 text-sm text-error-700 hover:bg-error-50 flex items-center"
                  onClick={() => {
                    setShowActions(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <Trash2 size={16} className="mr-2" />
                  Usuń
                </button>
              </div>
            )}
          </div>
        </div>
        
        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {resource.tags.map((tag, index) => (
              <div 
                key={index}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
        )}
        
        {resource.source_url && (
          <div className="mt-2">
            <a
              href={resource.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Źródło <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-error-600">
            {error}
          </div>
        )}
      </div>
      
      {/* Resource content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white pb-20">
        {/* AI summary */}
        {isSummarizing && (
          <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded text-primary-700 animate-pulse">
            Generowanie podsumowania przez AI...
          </div>
        )}
        {aiError && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded text-error-700">
            {aiError}
          </div>
        )}
        {aiSummary && !isSummarizing && (
          <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded text-primary-700">
            <strong>Podsumowanie AI:</strong>
            <div className="mt-2 whitespace-pre-line">{aiSummary}</div>
          </div>
        )}
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {resource.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Resource footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center fixed left-0 right-0 bottom-0 z-40" style={{maxWidth: 'calc(100vw - 17rem)', marginLeft: '16rem'}}>
        <div className="text-sm text-gray-500">
          {resource.is_note ? 'Notatka użytkownika' : 'Pobrany zasób'}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent('');
                  setError(null);
                }}
                disabled={isSaving}
              >
                Anuluj
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Zapisz zmiany
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={<MessageSquareText size={16} />}
              onClick={handleSummarizeWithAI}
              disabled={isSummarizing}
            >
              Podsumuj z AI
            </Button>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Usunąć zasób?"
        message={`Czy na pewno chcesz usunąć zasób "${resource.title}"? Ta operacja jest nieodwracalna.`}
        confirmText="Usuń zasób"
        confirmVariant="danger"
      />

      {/* Edit resource modal */}
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resource={resource}
      />
    </div>
  );
};

export default ResourceViewer;