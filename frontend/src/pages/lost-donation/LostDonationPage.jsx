import { useState, useEffect } from 'react';
import { getLostItems, getDonations, donate } from '../../api/lostDonationApi';
import LostItemCard from '../../components/cards/LostItemCard';
import DonationCard from '../../components/cards/DonationCard';
import Modal from '../../components/common/Modal';
import CreateLostItemForm from '../../components/forms/CreateLostItemForm';
import CreateDonationForm from '../../components/forms/CreateDonationForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

const LostDonationPage = () => {
  const [tab, setTab] = useState('lost-found');
  const [items, setItems] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donateModalData, setDonateModalData] = useState(null);
  const [donateAmount, setDonateAmount] = useState('');

  const fetchLostItems = async () => {
    setLoading(true);
    try {
      const res = await getLostItems();
      setItems(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await getDonations();
      setDonations(res.data.donations || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'lost-found') fetchLostItems();
    else fetchDonations();
  }, [tab]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donateAmount || isNaN(donateAmount)) return;
    try {
      await donate(donateModalData._id || donateModalData.id, { amount: Number(donateAmount) });
      toast.success('Donation successful!');
      setDonateModalData(null);
      setDonateAmount('');
      fetchDonations();
    } catch (err) {
      toast.error('Failed to donate');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lost & Found / Donations</h1>
        {tab === 'lost-found' ? (
          <button onClick={() => setIsLostModalOpen(true)} className="btn-primary">
            + Report Item
          </button>
        ) : (
          <button onClick={() => setIsDonationModalOpen(true)} className="btn-primary">
            + Start Campaign
          </button>
        )}
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg mb-6 max-w-sm">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'lost-found' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('lost-found')}
        >
          Lost & Found
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'donations' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setTab('donations')}
        >
          Donations
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tab === 'lost-found' ? (
        items.length === 0 ? (
          <EmptyState icon="🔍" title="No items reported" description="There are no lost or found items reported yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => <LostItemCard key={item._id || item.id} item={item} />)}
          </div>
        )
      ) : (
        donations.length === 0 ? (
          <EmptyState icon="❤️" title="No active campaigns" description="There are no donation campaigns active right now." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map(donation => <DonationCard key={donation._id || donation.id} donation={donation} onDonate={setDonateModalData} />)}
          </div>
        )
      )}

      <Modal isOpen={isLostModalOpen} onClose={() => setIsLostModalOpen(false)} title="Report Lost/Found Item">
        <CreateLostItemForm onSuccess={() => { setIsLostModalOpen(false); fetchLostItems(); }} />
      </Modal>

      <Modal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} title="Start Donation Campaign">
        <CreateDonationForm onSuccess={() => { setIsDonationModalOpen(false); fetchDonations(); }} />
      </Modal>

      <Modal isOpen={!!donateModalData} onClose={() => setDonateModalData(null)} title="Donate">
        <form onSubmit={handleDonate} className="space-y-4">
          <p className="text-gray-600 mb-4">You are donating to: <strong>{donateModalData?.title}</strong></p>
          <div>
            <label className="block text-sm font-medium mb-1">Amount ($)</label>
            <input type="number" min="1" required className="input" value={donateAmount} onChange={e => setDonateAmount(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">Confirm Donation</button>
        </form>
      </Modal>
    </div>
  );
};

export default LostDonationPage;
