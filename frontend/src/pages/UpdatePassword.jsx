import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return showError('Password must be at least 6 characters long.');
    }

    const toastId = showLoading('Updating password...');
    const { error } = await supabase.auth.updateUser({ password });
    dismissToast(toastId);
    if (error) return showError(error.message);
    showSuccess('Password updated successfully! Please log in.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
        <p className="text-gray-500 mt-2">
          Enter your new credentials below.
        </p>
        <form onSubmit={handleUpdate} className="mt-8 space-y-5">
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
