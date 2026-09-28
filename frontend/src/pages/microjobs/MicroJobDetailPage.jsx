import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getMicroJob, applyForJob, getJobApplications, updateApplicationStatus, completeJob } from '../../api/microJobApi';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MicroJobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [message, setMessage] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getMicroJob(id);
        setJob(res.data.job || res.data);
        if (res.data.job?.poster?._id === user?.id || res.data.poster?._id === user?._id) {
          const appRes = await getJobApplications(id);
          setApplications(appRes.data.applications || appRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applyForJob(id, { message, deliverableUrl });
      toast.success('Application submitted!');
      setMessage('');
      setDeliverableUrl('');
    } catch (err) {
      toast.error('Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleApprove = async (appId) => {
    try {
      await updateApplicationStatus(id, appId, { status: 'accepted' });
      toast.success('Application accepted!');
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: 'accepted' } : a));
    } catch (err) {
      toast.error('Error accepting');
    }
  };

  const handleComplete = async () => {
    try {
      await completeJob(id, { rating: 5, feedback: 'Great work!' });
      toast.success('Job marked as completed!');
      setJob(prev => ({ ...prev, status: 'completed' }));
    } catch (err) {
      toast.error('Error completing job');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return <div>Job not found</div>;

  const isPoster = job.poster?._id === user?.id || job.poster?._id === user?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <Badge text={job.status || 'open'} color={job.status === 'completed' ? 'gray' : 'green'} />
        </div>
        
        <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-100">
          <Avatar src={job.poster?.avatar} name={job.poster?.name || 'P'} />
          <div>
            <p className="font-medium text-gray-900">{job.poster?.name}</p>
            <p className="text-sm text-gray-500">Poster</p>
          </div>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-8">{job.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl mb-8 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Reward</p>
            <p className="font-bold text-gray-900">{job.reward} {job.rewardType}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Deliverable</p>
            <p className="font-medium text-gray-900">{job.deliverableType}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Deadline</p>
            <p className="font-medium text-gray-900">{job.deadline ? format(new Date(job.deadline), 'MMM dd, yyyy') : 'No deadline'}</p>
          </div>
        </div>

        {!isPoster && job.status === 'open' && (
          <form onSubmit={handleApply} className="bg-primary-50 p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg mb-2 text-primary-900">Apply for this Job</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea required className="input" rows="3" value={message} onChange={e => setMessage(e.target.value)}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deliverable URL (Optional)</label>
              <input type="text" className="input" value={deliverableUrl} onChange={e => setDeliverableUrl(e.target.value)} />
            </div>
            <button type="submit" disabled={applying} className="btn-primary">
              {applying ? <LoadingSpinner size="sm" /> : 'Submit Application'}
            </button>
          </form>
        )}

        {isPoster && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Applications ({applications.length})</h3>
              {job.status !== 'completed' && (
                <button onClick={handleComplete} className="btn-secondary text-sm">Mark Job as Completed</button>
              )}
            </div>
            
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="card bg-gray-50 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar src={app.applicant?.avatar} name={app.applicant?.name || 'A'} size="sm" />
                      <span className="font-medium">{app.applicant?.name}</span>
                    </div>
                    <Badge text={app.status || 'pending'} color={app.status === 'accepted' ? 'green' : 'yellow'} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{app.message}</p>
                  {app.deliverableUrl && (
                    <a href={app.deliverableUrl} target="_blank" rel="noreferrer" className="text-primary-600 text-sm hover:underline block mb-3">
                      View Deliverable
                    </a>
                  )}
                  {app.status !== 'accepted' && job.status !== 'completed' && (
                    <button onClick={() => handleApprove(app._id)} className="btn-primary text-xs py-1 px-3">
                      Accept
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroJobDetailPage;
