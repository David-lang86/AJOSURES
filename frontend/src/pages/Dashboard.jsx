import { Link } from 'react-router-dom'

import {
  Home,
  Wallet,
  Bell,
  User,
  Plus,
  Users,
} from 'lucide-react'

import {
  useEffect,
  useState,
  useCallback,
} from 'react'

import { supabase } from '../lib/supabase'

function Dashboard() {

  const [fullName, setFullName] =
    useState('User')

  const [walletBalance, setWalletBalance] =
    useState(0)

  const [groups, setGroups] =
    useState([])

  const [notificationsCount,
    setNotificationsCount] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const fetchDashboard =
    useCallback(async () => {

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {

          window.location.href = '/'

          return

        }

        // PROFILE
        const { data: profile } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profile) {

          setFullName(
            profile.full_name
          )

        }

        // WALLET
        const { data: wallet } =
          await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (wallet) {

          setWalletBalance(
            wallet.balance
          )

        }

        // NOTIFICATIONS
        const {
          count,
        } = await supabase
          .from('notifications')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('user_id', user.id)
          .eq('read', false)

        setNotificationsCount(
          count || 0
        )

        // GROUPS
        const {
          data: memberGroups,
        } = await supabase
          .from('group_members')
          .select(`
            groups (
              id,
              group_name,
              contribution_amount,
              frequency,
              invite_code,
              total_members
            )
          `)
          .eq('user_id', user.id)

        if (memberGroups) {

          const formattedGroups =
            memberGroups
              .map(
                (item) =>
                  item.groups
              )
              .filter(Boolean)

          setGroups(
            formattedGroups
          )

        }

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }, [])

  useEffect(() => {

  const loadData = async () => {

    await fetchDashboard()
  }

  loadData()

}, [fetchDashboard])

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {

    const walletChannel =
      supabase
        .channel('wallet-live')

        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
          },
          () => {

            fetchDashboard()

          }
        )

        .subscribe()

    const transactionChannel =
      supabase
        .channel('transactions-live')

        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
          },
          () => {

            fetchDashboard()

          }
        )

        .subscribe()

    const notificationChannel =
      supabase
        .channel('notifications-live')

        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
          },
          () => {

            fetchDashboard()

          }
        )

        .subscribe()

    return () => {

      supabase.removeChannel(
        walletChannel
      )

      supabase.removeChannel(
        transactionChannel
      )

      supabase.removeChannel(
        notificationChannel
      )

    }

  }, [fetchDashboard])

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">
          Loading dashboard...
        </p>

      </div>
    )

  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 pt-8 pb-10 rounded-b-3xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-blue-100 text-sm">
              Welcome back
            </p>

            <h1 className="text-3xl font-bold mt-1">
              {fullName} 👋
            </h1>

          </div>

          <div className="relative">

            <Link
              to="/notifications"
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
            >

              <Bell />

            </Link>

            {notificationsCount > 0 && (

              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">

                {notificationsCount}

              </div>

            )}

          </div>

        </div>

        {/* WALLET */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 mt-8 shadow-sm">

          <p className="text-gray-500">
            Wallet Balance
          </p>

          <h2 className="text-4xl font-bold mt-3">

            ₦{Number(
              walletBalance
            ).toLocaleString()}

          </h2>

          <div className="flex items-center gap-3 mt-6">

            <Link
              to="/fund-wallet"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
            >
              Fund Wallet
            </Link>

            <Link
              to="/withdraw"
              className="border border-gray-300 px-5 py-3 rounded-2xl font-semibold"
            >
              Withdraw
            </Link>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="px-6 mt-6 space-y-6">

        {/* QUICK ACTIONS */}
        <div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <Link
              to="/create-group"
              className="bg-white p-5 rounded-3xl shadow-sm"
            >

              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">

                <Plus className="text-blue-600" />

              </div>

              <h3 className="font-semibold mt-4">
                Create Group
              </h3>

            </Link>

            <Link
              to="/join-group"
              className="bg-white p-5 rounded-3xl shadow-sm"
            >

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">

                <Users className="text-green-600" />

              </div>

              <h3 className="font-semibold mt-4">
                Join Group
              </h3>

            </Link>

          </div>

        </div>

        {/* ACTIVE GROUPS */}
        <div>

          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Active Groups
          </h2>

          <div className="space-y-4">

            {groups.length === 0 ? (

              <div className="bg-white rounded-3xl p-8 shadow-sm text-center">

                <h3 className="text-lg font-bold">
                  No Groups Yet
                </h3>

              </div>

            ) : (

              groups.map((group) => (

                <Link
                  to={`/group/${group.id}`}
                  key={group.id}
                  className="bg-white rounded-3xl p-6 shadow-sm block"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-lg">

                        {group.group_name}

                      </h3>

                      <p className="text-gray-500 mt-1">

                        {group.frequency}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-xl">

                        ₦{Number(
                          group.contribution_amount
                        ).toLocaleString()}

                      </p>

                      <p className="text-green-600 text-sm">

                        Active

                      </p>

                    </div>

                  </div>

                </Link>

              ))

            )}

          </div>

        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">

        <Link
          to="/dashboard"
          className="flex flex-col items-center text-blue-600"
        >

          <Home size={24} />

          <span className="text-xs mt-1">
            Home
          </span>

        </Link>

        <Link
          to="/wallet"
          className="flex flex-col items-center text-gray-400"
        >

          <Wallet size={24} />

          <span className="text-xs mt-1">
            Wallet
          </span>

        </Link>

        <Link
          to="/notifications"
          className="flex flex-col items-center text-gray-400"
        >

          <Bell size={24} />

          <span className="text-xs mt-1">
            Alerts
          </span>

        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center text-gray-400"
        >

          <User size={24} />

          <span className="text-xs mt-1">
            Profile
          </span>

        </Link>

      </div>

    </div>
  )
}

export default Dashboard