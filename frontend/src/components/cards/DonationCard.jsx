import { format } from 'date-fns';
import Avatar from '../common/Avatar';

const DonationCard = ({ donation, onDonate }) => {
  const progress = Math.min(100, Math.round(((donation.currentAmount || 0) / (donation.goalAmount || 1)) * 100));
  const isExpired = donation.deadline && new Date(donation.deadline) < new Date();
  
  return (
    <div className="card flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{donation.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{donation.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-primary-600">${donation.currentAmount || 0} raised</span>
          <span className="text-gray-500">of ${donation.goalAmount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <Avatar src={donation.creator?.avatar} name={donation.creator?.name || 'C'} size="sm" />
          <span>{donation.creator?.name || 'User'}</span>
        </div>
        <div>
          {donation.deadline ? `Ends ${format(new Date(donation.deadline), 'dd MMM')}` : 'No deadline'}
        </div>
      </div>
      
      <button 
        onClick={() => onDonate(donation)} 
        disabled={isExpired}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          isExpired ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-accent-500 text-white hover:bg-accent-600'
        }`}
      >
        {isExpired ? 'Campaign Ended' : 'Donate Now'}
      </button>
    </div>
  );
};

export default DonationCard;
