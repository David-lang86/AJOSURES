import {
  useState,
} from 'react'

import { supabase }
from '../lib/supabase'

function WithdrawFunds() {

  const [amount,
    setAmount] =
      useState('')

  const [bankName,
    setBankName] =
      useState('')

  const [accountNumber,
    setAccountNumber] =
      useState('')

  const [accountName,
    setAccountName] =
      useState('')

  const handleWithdraw =
    async (e) => {

      e.preventDefault()

      const {
        data: { user },
      } =
        await supabase.auth.getUser()

      if (!user) {

        return

      }

      await supabase
        .from('withdrawals')
        .insert([
          {
            user_id:
              user.id,

            amount,

            bank_name:
              bankName,

            account_number:
              accountNumber,

            account_name:
              accountName,
          },
        ])

      alert(
        'Withdrawal request submitted'
      )

    }

  return (

    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-3xl font-bold text-blue-600">

          Withdraw Funds

        </h1>

        <form
          onSubmit={
            handleWithdraw
          }
          className="space-y-5 mt-8"
        >

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-2xl px-4 py-4"
          />

          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) =>
              setBankName(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-2xl px-4 py-4"
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
            className="w-full border border-gray-300 rounded-2xl px-4 py-4"
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
            className="w-full border border-gray-300 rounded-2xl px-4 py-4"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold"
          >

            Submit Request

          </button>

        </form>

      </div>

    </div>

  )

}

export default WithdrawFunds