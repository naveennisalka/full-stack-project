import { useState, useEffect } from 'react';
import { getMicroJobs } from '../../api/microJobApi';
import MicroJobCard from '../../components/cards/MicroJobCard';
import Modal from '../../components/common/Modal';
import CreateMicroJobForm from '../../components/forms/CreateMicroJobForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const MicroJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMicroJobs();
      setJobs(res.data.jobs || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Micro Jobs</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          + Post a Job
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState icon="💼" title="No jobs found" description="There are no micro jobs available right now." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <MicroJobCard key={job._id || job.id} job={job} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a Micro Job">
        <CreateMicroJobForm onSuccess={() => { setIsModalOpen(false); fetchJobs(); }} />
      </Modal>
    </div>
  );
};

export default MicroJobsPage;
