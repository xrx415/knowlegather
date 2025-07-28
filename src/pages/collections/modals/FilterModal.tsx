import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export interface FilterOptions {
  privacy: 'all' | 'private' | 'public';
  tags: string[];
}

const FilterModal = ({ isOpen, onClose, onApplyFilters, initialFilters }: FilterModalProps) => {
  const [privacy, setPrivacy] = useState<'all' | 'private' | 'public'>(initialFilters.privacy);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.tags);
  
  useEffect(() => {
    setPrivacy(initialFilters.privacy);
    setSelectedTags(initialFilters.tags);
  }, [initialFilters]);
  
  const handleApplyFilters = () => {
    onApplyFilters({
      privacy,
      tags: selectedTags,
    });
    onClose();
  };
  
  const handleReset = () => {
    setPrivacy('all');
    setSelectedTags([]);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filtry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Privacy filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Widoczność</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === 'all'}
                  onChange={() => setPrivacy('all')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Wszystkie</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === 'private'}
                  onChange={() => setPrivacy('private')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Tylko prywatne</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === 'public'}
                  onChange={() => setPrivacy('public')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Tylko publiczne</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-between rounded-b-lg">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Resetuj
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Anuluj
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyFilters}
            >
              Zastosuj
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;