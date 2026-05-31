import { Users, Wallet, Bell, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { showError } from '../lib/toast'

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWalletBalance: 0,
    pendingWithdrawals: 0,
  })
  const [loading, setLoading] = useState(true)

  const getAdminStats = async () => {
    try {
      const [
        { count: totalUsers },
        { data: wallets },
        { count: pendingWithdrawals },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('wallets').select('balance'),
        supabase.from('withdrawals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      const totalWalletBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) ?? 0

      setStats({
        totalUsers: totalUsers ?? 0,
        totalWalletBalance,
        pendingWithdrawals: pendingWithdrawals ?? 0,
      })

    } catch (error) {
      showError('Failed to load admin statistics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getAdminStats() }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">AJOSURES Analytics Overview</p>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Users className="text-blue-600" size={40} />
            <h2 className="text-4xl font-bold mt-5">
              {loading ? '...' : stats.totalUsers}
            </h2>
            <p className="text-gray-500 mt-2">Total Users</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Wallet className="text-green-600" size={40} />
            <h2 className="text-4xl font-bold mt-5">
              {loading ? '...' : `₦${Number(stats.totalWalletBalance).toLocaleString()}`}
            </h2>
            <p className="text-gray-500 mt-2">Total Wallet Balance</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Bell className="text-orange-500" size={40} />
            <h2 className="text-4xl font-bold mt-5">
              {loading ? '...' : stats.pendingWithdrawals}
            </h2>
            <p className="text-gray-500 mt-2">Pending Withdrawals</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <TrendingUp className="text-purple-600" size={40} />
            <h2 className="text-4xl font-bold mt-5">—</h2>
            <p className="text-gray-500 mt-2">Growth Rate</p>
          </div>

        </div>

        {/* QUICK LINKS */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <a
            href="/admin-withdrawals"
            className="bg-white rounded-3xl p-8 shadow-sm block hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold">Withdrawal Requests</h2>
            <p className="text-gray-500 mt-2">Review and approve pending withdrawal requests.</p>
          </a>
          <a
            href="/admin-payouts"
            className="bg-white rounded-3xl p-8 shadow-sm block hover:shadow-md transition"
          >
            <h2 className="text-2xl font-bold">Payout Engine</h2>
            <p className="text-gray-500 mt-2">Process group rotation payouts.</p>
          </a>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard