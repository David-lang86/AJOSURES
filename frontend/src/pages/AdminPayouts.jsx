import {
  useEffect,
  useState,
  useCallback,
} from 'react'

import { supabase } from '../lib/supabase'

function AdminPayouts() {

  const [payouts, setPayouts] =
    useState([])

  const fetchPayouts =
    useCallback(async () => {

      const { data } =
        await supabase
          .from('payout_queue')
          .select('*')
          .order('created_at', {
            ascending: false,
          })

      if (data) {

        setPayouts(data)

      }

    }, [])

  useEffect(() => {

    const loadData =
      async () => {

        await fetchPayouts()

      }

    loadData()

  }, [fetchPayouts])

  const processPayout =
    async (item) => {

      // CREDIT WALLET
      const { data: wallet } =
        await supabase
          .from('wallets')
          .select('*')
          .eq(
            'user_id',
            item.user_id
          )
          .single()

      if (!wallet) {

        return

      }

      await supabase
        .from('wallets')
        .update({
          balance:
            Number(
              wallet.balance
            ) +
            Number(item.amount),
        })
        .eq(
          'user_id',
          item.user_id
        )

      // MARK PAID
      await supabase
        .from('payout_queue')
        .update({
          paid: true,
        })
        .eq('id', item.id)

      // TRANSACTION
      await supabase
        .from('transactions')
        .insert([
          {
            user_id:
              item.user_id,

            title:
              'Group payout received',

            amount:
              item.amount,

            type: 'credit',

            status:
              'successful',
          },
        ])

      alert('Payout sent')

      fetchPayouts()

    }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <h1 className="text-3xl font-bold text-blue-600">

        Auto Payout Engine

      </h1>

      <div className="space-y-4 mt-8">

        {payouts.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-bold">

                  ₦
                  {Number(
                    item.amount
                  ).toLocaleString()}

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  {
                    item.paid
                      ? 'Paid'
                      : 'Pending'
                  }

                </p>

              </div>

              {!item.paid && (

                <button
                  onClick={() =>
                    processPayout(
                      item
                    )
                  }
                  className="bg-green-600 text-white px-5 py-3 rounded-2xl"
                >

                  Process

                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AdminPayouts