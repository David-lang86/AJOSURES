import { useState } from 'react'
import PaystackPop from '@paystack/inline-js'
import { showSuccess, showInfo, showError } from '../lib/toast'

function FundWallet() {

  const [amount, setAmount] = useState('')

  const payWithPaystack = () => {

    if (!amount || Number(amount) <= 0) {
      showError('Please enter a valid amount.')
      return
    }

    const paystack = new PaystackPop()

    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      amount: Number(amount) * 100,
      email: 'customer@email.com',

      onSuccess: (transaction) => {
        showSuccess(`Payment successful! Ref: ${transaction.reference}`)
      },

      onCancel: () => {
        showInfo('Transaction cancelled.')
      },
    })

  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-blue-600">Fund Wallet</h1>

        <div className="bg-white rounded-3xl p-6 shadow-sm mt-8 space-y-5">

          <input
            type="number"
            placeholder="Enter amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <button
            onClick={payWithPaystack}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            Pay Now
          </button>

        </div>

      </div>

    </div>
  )
}

export default FundWallet