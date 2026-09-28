import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser, registerOrg } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RegisterPage = () => {
  const [tab, setTab] = useState('student');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (tab === 'student') {
        res = await registerUser(formData);
      } else {
        res = await registerOrg(formData);
      }
      login(res.data.token, res.data.user);
      navigate('/feed');
      toast.success('Registration successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an Account</h2>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'student' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setTab('student'); setFormData({}); }}
            type="button"
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'organization' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setTab('organization'); setFormData({}); }}
            type="button"
          >
            Organization
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" required className="input" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="input" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="input" onChange={handleChange} />
          </div>

          {tab === 'student' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input type="text" name="studentId" required className="input" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <input type="text" name="faculty" required className="input" onChange={handleChange} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" required className="input" onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="club">Club</option>
                  <option value="society">Society</option>
                  <option value="department">Department</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" required className="input" onChange={handleChange} rows="3"></textarea>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary flex justify-center py-2.5 mt-6">
            {loading ? <LoadingSpinner size="sm" /> : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
