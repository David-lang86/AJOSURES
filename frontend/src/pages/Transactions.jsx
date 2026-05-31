import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast'
import jsPDF from 'jspdf'

function Transactions() {

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/'; return }

        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) { showError('Failed to load transactions.'); return }
        setTransactions(data || [])

      } catch (error) {
        showError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const exportTransactions = () => {
    if (transactions.length === 0) {
      showError('No transactions to export.')
      return
    }

    try {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('AJOSURES — Transaction History', 14, 20)
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)

      doc.setFontSize(11)
      doc.setTextColor(0)

      transactions.forEach((tx, i) => {
        const y = 40 + i * 10
        if (y > 270) return // guard against overflow
        doc.text(
          `${tx.created_at?.slice(0, 10) ?? '—'}  |  ${tx.title ?? tx.type ?? '—'}  |  ₦${Number(tx.amount).toLocaleString()}  |  ${tx.status ?? '—'}`,
          14, y
        )
      })

      doc.save('ajosures-transactions.pdf')
      showSuccess('Transactions exported as PDF!')

    } catch (err) {
      showError('Export failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Transactions</h1>
          <p className="text-gray-500 mt-2">Your wallet activities</p>
        </div>
        <button
          onClick={exportTransactions}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-2xl text-sm font-semibold"
        >
          Export PDF
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-3xl p-5 shadow-sm">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-gray-900 capitalize">
                    {transaction.title || transaction.type}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {transaction.description || 'Transaction'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-xl text-green-600">
                    ₦{Number(transaction.amount).toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize mt-1">{transaction.status}</p>
                </div>
              </div>

              {transaction.reference && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs text-gray-400">
                    Ref: <span className="ml-2 font-semibold text-gray-600">{transaction.reference}</span>
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