import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast'

function Withdraw() {

  const navigate = useNavigate()
  const [walletBalance, setWalletBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // FETCH WALLET
  const fetchWallet = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data, error } = await supabase
        .from('wallets').select('*').eq('user_id', user.id).single()

      if (error) { showError('Could not fetch wallet balance.'); return }
      if (data) setWalletBalance(data.balance)

    } catch (error) {
      showError(error.message)
    } finally {
      setPageLoading(false)
    }
  }

  // LOAD WALLET
  useEffect(() => { fetchWallet() }, [])

  // HANDLE WITHDRAW — now submits to `withdrawals` table (pending admin approval)
  const handleWithdraw = async (e) => {
    e.preventDefault()
    const withdrawAmount = Number(amount)

    if (withdrawAmount <= 0) { showError('Please enter a valid amount.'); return }
    if (withdrawAmount > walletBalance) { showError('Insufficient wallet balance.'); return }

    setLoading(true)
    const toastId = showLoading('Submitting withdrawal request...')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { dismissToast(toastId); showError('Session expired. Please log in again.'); return }

      const bankDetails = { bankName, accountNumber, accountName }

      // Submit withdrawal request (pending admin approval)
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: withdrawAmount,
          bank_details: bankDetails,
          status: 'pending',
        })

      dismissToast(toastId)

      if (error) { showError(error.message); return }

      // Reset form
      setAmount('')
      setBankName('')
      setAccountNumber('')
      setAccountName('')

      showSuccess('Withdrawal request submitted successfully. Pending admin approval.')

    } catch (error) {
      dismissToast(toastId)
      showError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading wallet...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-blue-600">Withdraw Funds</h1>

        <p className="text-gray-500 mt-2">Available Balance:</p>
        <h2 className="text-4xl font-bold mt-2">₦{Number(walletBalance).toLocaleString()}</h2>

        <form onSubmit={handleWithdraw} className="bg-white rounded-3xl p-6 shadow-sm mt-8 space-y-5">

          <input
            type="number"
            placeholder="Amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default Withdraw