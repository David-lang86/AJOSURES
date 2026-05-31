import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast'

function AdminWithdrawals() {

  const [requests, setRequests] = useState([])

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setRequests(data)
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const approveWithdrawal = async (item) => {
    const toastId = showLoading('Approving withdrawal...')

    // 1. Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets').select('balance').eq('user_id', item.user_id).single()

    if (!wallet || wallet.balance < item.amount) {
      dismissToast(toastId)
      showError('User has insufficient balance.')
      return
    }

    // 2. Deduct from wallet
    const { error: walletError } = await supabase
      .from('wallets')
      .update({ balance: wallet.balance - item.amount })
      .eq('user_id', item.user_id)

    if (walletError) {
      dismissToast(toastId)
      showError('Failed to deduct wallet balance.')
      return
    }

    // 3. Update withdrawal status
    const { error: withdrawalError } = await supabase
      .from('withdrawals')
      .update({ status: 'approved' })
      .eq('id', item.id)

    dismissToast(toastId)

    if (withdrawalError) { showError(withdrawalError.message); return }

    // 4. Log transaction
    await supabase.from('transactions').insert([{
      user_id: item.user_id,
      title: 'Withdrawal approved',
      amount: item.amount,
      type: 'debit',
      status: 'successful',
    }])

    showSuccess('Withdrawal approved and wallet updated.')
    fetchRequests()
  }

  const rejectWithdrawal = async (id) => {
    const { error } = await supabase
      .from('withdrawals').update({ status: 'rejected' }).eq('id', id)

    if (error) { showError(error.message); return }
    showSuccess('Withdrawal rejected.')
    fetchRequests()
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <h1 className="text-3xl font-bold text-blue-600">Withdrawal Requests</h1>

      <div className="space-y-4 mt-8">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <p className="text-gray-500">No withdrawal requests yet.</p>
          </div>
        ) : (
          requests.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">₦{Number(item.amount).toLocaleString()}</h3>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{item.status}</p>
                  {item.bank_details && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.bank_details.bankName} — {item.bank_details.accountNumber}
                    </p>
                  )}
                </div>
                {item.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveWithdrawal(item)}
                      className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-2xl text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectWithdrawal(item.id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-2xl text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default AdminWithdrawals