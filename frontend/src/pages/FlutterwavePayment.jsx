import { useMemo, useState } from 'react'
import { useFlutterwave } from 'flutterwave-react-v3'
import { supabase } from '../lib/supabase'
import { showSuccess, showError, showInfo } from '../lib/toast'

function FlutterwavePayment() {

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const txRef = useMemo(() => `AJO-${crypto.randomUUID()}`, [])

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: txRef,
    amount: Number(amount || 0),
    currency: 'NGN',
    payment_options: 'card, banktransfer, ussd',
    customer: {
      email: 'customer@email.com',
      phone_number: '08012345678',
      name: 'Ajosures User',
    },
    customizations: {
      title: 'Ajosures Wallet Funding',
      description: 'Secure wallet funding',
      logo: 'https://via.placeholder.com/150',
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  const saveTransaction = async (reference, paidAmount) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: wallet } = await supabase
      .from('wallets').select('*').eq('user_id', user.id).single()

    if (wallet) {
      await supabase.from('wallets')
        .update({ balance: Number(wallet.balance) + Number(paidAmount) })
        .eq('user_id', user.id)
    }

    await supabase.from('transactions').insert([{
      user_id: user.id,
      title: 'Wallet funding',
      amount: paidAmount,
      type: 'credit',
      status: 'successful',
      payment_reference: reference,
      gateway: 'flutterwave',
      verified: true,
    }])

    await supabase.from('push_notifications').insert([{
      user_id: user.id,
      title: 'Wallet Funded',
      body: `₦${Number(paidAmount).toLocaleString()} added successfully`,
    }])
  }

  const startPayment = () => {
    if (!amount || Number(amount) <= 0) {
      showError('Please enter a valid amount.')
      return
    }

    setLoading(true)

    handleFlutterPayment({
      callback: async (response) => {
        try {
          const verifyResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-flutterwave`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.tx_ref }),
            }
          )

          const verifyData = await verifyResponse.json()

          if (verifyData.status === 'success') {
            await saveTransaction(response.tx_ref, amount)
            showSuccess('Payment verified and wallet credited successfully!')
          } else {
            showError('Payment verification failed. Please contact support.')
          }

        } catch (error) {
          showError(error.message || 'Something went wrong during verification.')
        } finally {
          setLoading(false)
        }
      },

      onClose: () => {
        showInfo('Payment window closed.')
        setLoading(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-3xl font-bold text-blue-600">Fund Wallet</h1>
        <p className="text-gray-500 mt-2">Secure funding with Flutterwave</p>

        <div className="space-y-5 mt-8">

          <input
            type="number"
            placeholder="Enter amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <button
            onClick={startPayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default FlutterwavePayment