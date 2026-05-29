import {
  useEffect,
  useState,
  useCallback,
} from 'react'

import {
  useParams,
  Link,
} from 'react-router-dom'

import {
  ArrowLeft,
  Users,
  Clock3,
  MessageCircle,
} from 'lucide-react'

import { supabase } from '../lib/supabase'

function GroupDetails() {

  const { id } = useParams()

  const [group, setGroup] =
    useState(null)

  const [members, setMembers] =
    useState([])

  const [transactions, setTransactions] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const fetchGroupDetails =
    useCallback(async () => {

      try {

        // GROUP
        const {
          data: groupData,
        } = await supabase
          .from('groups')
          .select('*')
          .eq('id', id)
          .single()

        if (groupData) {

          setGroup(groupData)

        }

        // MEMBERS
        const {
          data: membersData,
        } = await supabase
          .from('group_members')
          .select(`
            id,
            user_id,
            profiles (
              full_name
            )
          `)
          .eq('group_id', id)

        if (membersData) {

          setMembers(membersData)

        }

        // TRANSACTIONS
        const {
          data: transactionsData,
        } = await supabase
          .from('transactions')
          .select('*')
          .eq('group_id', id)
          .order('created_at', {
            ascending: false,
          })

        if (transactionsData) {

          setTransactions(
            transactionsData
          )

        }

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }, [id])

  useEffect(() => {

    const loadData = async () => {

      await fetchGroupDetails()

    }

    loadData()

  }, [fetchGroupDetails])

  const handleContribution =
    async () => {

      try {

        const {
          data: { user },
        } =
          await supabase.auth.getUser()

        if (!user) {

          alert('Login required')

          return

        }

        const {
          data: wallet,
        } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (
          Number(wallet.balance) <
          Number(
            group.contribution_amount
          )
        ) {

          alert(
            'Insufficient wallet balance'
          )

          return

        }

        // DEDUCT WALLET
        await supabase
          .from('wallets')
          .update({
            balance:
              Number(
                wallet.balance
              ) -
              Number(
                group.contribution_amount
              ),
          })
          .eq('user_id', user.id)

        // SAVE TRANSACTION
        await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,

              group_id: group.id,

              title: `Contribution to ${group.group_name}`,

              amount:
                group.contribution_amount,

              type:
                'group_contribution',

              status:
                'successful',
            },
          ])

        // CREATE NOTIFICATION
        await supabase
          .from(
            'notifications'
          )
          .insert([
            {
              user_id: user.id,

              title:
                'Contribution Successful',

              message: `You contributed ₦${Number(
                group.contribution_amount
              ).toLocaleString()} to ${group.group_name}`,
            },
          ])

        alert(
          'Contribution successful'
        )

        fetchGroupDetails()

      } catch (error) {

        console.log(error)

        alert(
          'Contribution failed'
        )

      }

    }

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">

          Loading...

        </p>

      </div>
    )

  }

  if (!group) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">

          Group not found

        </p>

      </div>
    )

  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 pt-8 pb-10 rounded-b-3xl">

        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white/90"
        >

          <ArrowLeft size={20} />

          Back

        </Link>

        <div className="mt-6">

          <h1 className="text-3xl font-bold">

            {group.group_name}

          </h1>

          <p className="text-blue-100 mt-2 capitalize">

            {group.frequency} Contributions

          </p>

        </div>

        {/* GROUP CARD */}
        <div className="bg-white text-gray-900 rounded-3xl p-6 mt-8 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">

                Contribution Amount

              </p>

              <h2 className="text-4xl font-bold mt-2">

                ₦
                {Number(
                  group.contribution_amount
                ).toLocaleString()}

              </h2>

            </div>

            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center">

              <Users className="text-green-600" />

            </div>

          </div>

          <div className="mt-6 space-y-2">

            <p className="text-gray-600">

              Members:
              <span className="font-semibold ml-2">

                {members.length}/
                {group.total_members}

              </span>

            </p>

            <p className="text-gray-600">

              Invite Code:
              <span className="font-semibold ml-2 text-blue-600">

                {group.invite_code}

              </span>

            </p>

          </div>

          {/* PAY BUTTON */}
          <button
            onClick={
              handleContribution
            }
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
          >

            <Clock3 size={18} />

            Pay Contribution

          </button>

          {/* CHAT BUTTON */}
          <Link
            to={`/group-chat/${group.id}`}
            className="w-full mt-4 border border-blue-600 text-blue-600 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          >

            <MessageCircle size={18} />

            Open Group Chat

          </Link>

        </div>

      </div>

      {/* MEMBERS */}
      <div className="px-6 mt-8">

        <h2 className="text-xl font-bold text-gray-900 mb-4">

          Group Members

        </h2>

        <div className="space-y-4">

          {members.map((member) => (

            <div
              key={member.id}
              className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between"
            >

              <div>

                <h3 className="font-semibold text-gray-900">

                  {
                    member.profiles
                      ?.full_name
                  }

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  Active Member

                </p>

              </div>

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">

                {member.profiles?.full_name
                  ?.charAt(0)}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* TRANSACTIONS */}
      <div className="px-6 mt-10">

        <h2 className="text-xl font-bold text-gray-900 mb-4">

          Transactions

        </h2>

        <div className="space-y-4">

          {transactions.length === 0 ? (

            <div className="bg-white rounded-3xl p-8 shadow-sm text-center">

              <p className="text-gray-500">

                No transactions yet

              </p>

            </div>

          ) : (

            transactions.map(
              (item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-gray-900">

                        {item.title}

                      </h3>

                      <p className="text-sm text-gray-500 mt-1">

                        {new Date(
                          item.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-lg">

                        ₦
                        {Number(
                          item.amount
                        ).toLocaleString()}

                      </p>

                      <p className="text-green-600 text-sm mt-1 capitalize">

                        {item.status}

                      </p>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>
  )
}

export default GroupDetails