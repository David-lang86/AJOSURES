import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

function Transactions() {

  const [transactions, setTransactions] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const loadTransactions =
      async () => {

        try {

          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {

            window.location.href = '/'

            return

          }

          const {
            data,
            error,
          } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', {
              ascending: false,
            })

          if (error) {

            console.log(error)

            return

          }

          setTransactions(data || [])

        } catch (error) {

          console.log(error)

        } finally {

          setLoading(false)

        }

      }

    loadTransactions()

  }, [])

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">

          Loading transactions...

        </p>

      </div>
    )

  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <h1 className="text-3xl font-bold text-blue-600">

        Transactions

      </h1>

      <p className="text-gray-500 mt-2">

        Your wallet activities

      </p>

      <div className="mt-8 space-y-4">

        {transactions.length === 0 ? (

          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">

            <p className="text-gray-500">

              No transactions yet

            </p>

          </div>

        ) : (

          transactions.map((transaction) => (

            <div
              key={transaction.id}
              className="bg-white rounded-3xl p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-bold text-lg text-gray-900 capitalize">

                    {transaction.type}

                  </h2>

                  <p className="text-gray-500 text-sm mt-1">

                    {transaction.description ||
                      'Transaction'}

                  </p>

                  <p className="text-xs text-gray-400 mt-2">

                    {new Date(
                      transaction.created_at
                    ).toLocaleString()}

                  </p>

                </div>

                <div className="text-right">

                  <h3 className="font-bold text-xl text-green-600">

                    ₦
                    {Number(
                      transaction.amount
                    ).toLocaleString()}

                  </h3>

                  <p className="text-sm text-gray-500 capitalize mt-1">

                    {transaction.status}

                  </p>

                </div>

              </div>

              {transaction.reference && (

                <div className="mt-4 border-t pt-3">

                  <p className="text-xs text-gray-400">

                    Ref:

                    <span className="ml-2 font-semibold text-gray-600">

                      {transaction.reference}

                    </span>

                  </p>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  )
}

export default Transactions