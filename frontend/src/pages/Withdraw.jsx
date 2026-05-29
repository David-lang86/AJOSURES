import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

function Withdraw() {

  const [walletBalance, setWalletBalance] =
    useState(0)

  const [amount, setAmount] =
    useState('')

  const [bankName, setBankName] =
    useState('')

  const [accountNumber, setAccountNumber] =
    useState('')

  const [accountName, setAccountName] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [pageLoading, setPageLoading] =
    useState(true)

  // FETCH WALLET
  const fetchWallet = async () => {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {

        window.location.href = '/'

        return

      }

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {

        console.log(error)

      }

      if (data) {

        setWalletBalance(data.balance)

      }

    } catch (error) {

      console.log(error)

    } finally {

      setPageLoading(false)

    }

  }

  // LOAD WALLET
  useEffect(() => {

  const loadWallet = async () => {

    await fetchWallet()

  }

  loadWallet()

}, [])

  // HANDLE WITHDRAW
  const handleWithdraw = async (e) => {

    e.preventDefault()

    setLoading(true)

    try {

      const withdrawAmount =
        Number(amount)

      if (
        withdrawAmount <= 0
      ) {

        alert('Enter valid amount')

        setLoading(false)

        return

      }

      if (
        withdrawAmount >
        walletBalance
      ) {

        alert('Insufficient balance')

        setLoading(false)

        return

      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {

        alert('User not found')

        setLoading(false)

        return

      }

      // UPDATE WALLET
      const newBalance =
        walletBalance -
        withdrawAmount

      const { error: walletError } =
        await supabase
          .from('wallets')
          .update({
            balance: newBalance,
          })
          .eq('user_id', user.id)

      if (walletError) {

        alert(walletError.message)

        setLoading(false)

        return

      }

      // SAVE TRANSACTION
      const { error: txError } =
        await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,
              type: 'withdraw',
              amount: withdrawAmount,
              status: 'success',
              description:
                `Withdrawal to ${bankName}`,
            },
          ])

      if (txError) {

        console.log(txError)

      }

      // REFRESH WALLET
      setWalletBalance(newBalance)

      // RESET FORM
      setAmount('')
      setBankName('')
      setAccountNumber('')
      setAccountName('')

      alert(
        'Withdrawal successful'
      )

    } catch (error) {

      console.log(error)

      alert('Something went wrong')

    } finally {

      setLoading(false)

    }

  }

  if (pageLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">
          Loading wallet...
        </p>

      </div>
    )

  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-blue-600">
          Withdraw Funds
        </h1>

        <p className="text-gray-500 mt-2">
          Available Balance:
        </p>

        <h2 className="text-4xl font-bold mt-2">
          ₦{Number(walletBalance).toLocaleString()}
        </h2>

        <form
          onSubmit={handleWithdraw}
          className="bg-white rounded-3xl p-6 shadow-sm mt-8 space-y-5"
        >

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) =>
              setBankName(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) =>
              setAccountName(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-2xl font-semibold"
          >

            {loading
              ? 'Processing...'
              : 'Withdraw Funds'}

          </button>

        </form>

      </div>

    </div>
  )
}

export default Withdraw