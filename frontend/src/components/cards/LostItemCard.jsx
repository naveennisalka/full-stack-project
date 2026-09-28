import { formatDistanceToNow } from 'date-fns';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';

const LostItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  
  return (
    <div className="card overflow-hidden p-0 flex flex-col">
      <div className="h-48 w-full bg-gray-200 relative">
        {item.photo ? (
          <img src={item.photo} alt={item.itemName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            {isLost ? '❓' : '💡'}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge text={isLost ? 'Lost' : 'Found'} color={isLost ? 'red' : 'green'} />
        </div>
        {item.status === 'resolved' && (
          <div className="absolute top-2 right-2">
            <Badge text="Resolved" color="gray" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.itemName}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <span>📍</span> {item.location}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar src={item.reporter?.avatar} name={item.reporter?.name || 'R'} size="sm" />
            <div>
              <p className="text-xs font-medium text-gray-900">{item.reporter?.name || 'User'}</p>
              <p className="text-xs text-gray-500">
                {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemCard;
