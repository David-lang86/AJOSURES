import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return showError('Please enter your email address.');

    const toastId = showLoading('Sending reset email...');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    dismissToast(toastId);
    if (error) return showError(error.message);
    showSuccess('Check your email for the reset link.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Remember your password?
          <Link to="/login" className="text-blue-600 font-semibold ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
