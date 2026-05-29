import {
  useEffect,
  useState,
  useCallback,
} from 'react'

import { supabase } from '../lib/supabase'

function AdminWithdrawals() {

  const [requests, setRequests] =
    useState([])

  const fetchRequests =
    useCallback(async () => {

      const { data } =
        await supabase
          .from(
            'withdrawal_requests'
          )
          .select('*')
          .order('created_at', {
            ascending: false,
          })

      if (data) {

        setRequests(data)

      }

    }, [])

  useEffect(() => {

    const loadData =
      async () => {

        await fetchRequests()

      }

    loadData()

  }, [fetchRequests])

  const approveWithdrawal =
    async (id) => {

      await supabase
        .from(
          'withdrawal_requests'
        )
        .update({
          approved: true,
          status:
            'approved',
        })
        .eq('id', id)

      fetchRequests()

    }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <h1 className="text-3xl font-bold text-blue-600">

        Withdrawal Requests

      </h1>

      <div className="space-y-4 mt-8">

        {requests.map((item) => (

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

                  {item.status}

                </p>

              </div>

              {!item.approved && (

                <button
                  onClick={() =>
                    approveWithdrawal(
                      item.id
                    )
                  }
                  className="bg-green-600 text-white px-5 py-3 rounded-2xl"
                >

                  Approve

                </button>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AdminWithdrawals