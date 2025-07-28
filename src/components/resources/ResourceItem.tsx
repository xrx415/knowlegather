import { FileText, Globe, FileCode, Edit, Tag } from 'lucide-react';
import { formatDistanceToNow } from '../../lib/dateUtils';
import { Resource } from '../../stores/resourcesStore';

interface ResourceItemProps {
  resource: Resource;
  onClick: () => void;
  isActive: boolean;
}

const ResourceItem = ({ resource, onClick, isActive }: ResourceItemProps) => {
  // Determine the icon based on resource type
  const getIcon = () => {
    if (resource.is_note) {
      return <Edit className="h-4 w-4" />;
    }
    if (resource.source_url?.includes('github.com')) {
      return <FileCode className="h-4 w-4" />;
    }
    if (resource.source_url) {
      return <Globe className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };
  
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-md cursor-pointer transition-colors mb-1 ${
        isActive 
          ? 'bg-primary-50 border-l-2 border-primary-500' 
          : 'hover:bg-gray-50 border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-start">
        <div className={`mr-2 mt-0.5 text-${isActive ? 'primary-600' : 'gray-500'}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{resource.title}</h4>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(resource.created_at))}
          </p>
          
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {resource.tags.slice(0, 2).map((tag, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                >
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {tag}
                </div>
              ))}
              {resource.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{resource.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceItem;