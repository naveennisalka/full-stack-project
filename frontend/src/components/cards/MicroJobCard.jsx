import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';

const MicroJobCard = ({ job }) => {
  let statusColor = 'green';
  if (job.status === 'in-review') statusColor = 'yellow';
  else if (job.status === 'completed') statusColor = 'gray';

  return (
    <div className="card flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
        <Badge text={job.status || 'open'} color={statusColor} />
      </div>
      
      <div className="flex gap-2 mb-3">
        <Badge text={job.deliverableType || 'Task'} color="purple" />
        <Badge text={`Reward: ${job.reward} ${job.rewardType}`} color="blue" />
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Avatar src={job.poster?.avatar} name={job.poster?.name || 'P'} size="sm" />
          <span>{job.poster?.name || 'User'}</span>
        </div>
        <div>
          📅 {job.deadline ? format(new Date(job.deadline), 'dd MMM yyyy') : 'No deadline'}
        </div>
      </div>
      
      <Link to={`/microjobs/${job._id || job.id}`} className="btn-primary w-full text-center">
        View & Apply
      </Link>
    </div>
  );
};

export default MicroJobCard;
