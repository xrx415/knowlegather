import { Link } from 'react-router-dom';
import { formatDistanceToNow } from '../../lib/dateUtils';
import { Collection } from '../../stores/collectionsStore';
import { Folder, Tag, Lock, Globe } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link 
      to={`/collections/${collection.id}`}
      className="block card transition-all hover:border-primary-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
            <Folder className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
              {collection.name}
            </h3>
            <p className="text-sm text-gray-500">
              Utworzono {formatDistanceToNow(new Date(collection.created_at))}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {collection.is_private ? (
            <Lock className="h-4 w-4 text-gray-400" />
          ) : (
            <Globe className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {collection.description && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {collection.description}
        </p>
      )}
      
      {collection.tags && collection.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {collection.tags.map((tag, index) => (
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
    </Link>
  );
};

export default CollectionCard;