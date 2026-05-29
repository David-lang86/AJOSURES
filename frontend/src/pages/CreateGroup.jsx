import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { supabase } from '../lib/supabase'

function CreateGroup() {

  const navigate = useNavigate()

  const [groupName, setGroupName] =
    useState('')

  const [amount, setAmount] =
    useState('')

  const [frequency, setFrequency] =
    useState('Weekly')

  const [members, setMembers] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const generateInviteCode = () => {

    return Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

  }

  const handleCreateGroup =
    async (e) => {

      e.preventDefault()

      setLoading(true)

      try {

        const {
          data: { user },
        } =
          await supabase.auth.getUser()

        if (!user) {

          alert('User not found')

          return

        }

        // CREATE GROUP
        const {
          data,
          error,
        } = await supabase
          .from('groups')
          .insert([
            {
              creator_id: user.id,

              group_name: groupName,

              contribution_amount:
                Number(amount),

              frequency,

              total_members:
                Number(members),

              invite_code:
                generateInviteCode(),

              next_due_date:
                new Date()
                  .toISOString()
                  .split('T')[0],
            },
          ])
          .select()
          .single()

        if (error) {

          alert(error.message)

          return

        }

        // AUTO JOIN CREATOR
        const {
          error: memberError,
        } = await supabase
          .from('group_members')
          .insert([
            {
              group_id: data.id,
              user_id: user.id,
            },
          ])

        if (memberError) {

          console.log(memberError)

        }

        // CREATE FIRST ROTATION
        await supabase
          .from('payout_rotations')
          .insert([
            {
              group_id: data.id,
              user_id: user.id,
              position: 1,
            },
          ])

        // CREATE NOTIFICATION
        await supabase
          .from('notifications')
          .insert([
            {
              user_id: user.id,
              title:
                'Group Created',
              message: `You created ${groupName}`,
            },
          ])

        // CREATE TRANSACTION
        await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,

              group_id: data.id,

              title:
                'Group Created',

              amount: 0,

              type:
                'group_creation',

              status:
                'successful',
            },
          ])

        alert(
          'Group created successfully'
        )

        navigate('/dashboard')

      } catch (error) {

        console.log(error)

        alert(
          'Something went wrong'
        )

      } finally {

        setLoading(false)

      }

    }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-blue-600">

          Create Group

        </h1>

        <p className="text-gray-500 mt-2">

          Start a real thrift savings circle

        </p>

        <form
          onSubmit={
            handleCreateGroup
          }
          className="bg-white rounded-3xl p-6 shadow-sm mt-8 space-y-5"
        >

          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) =>
              setGroupName(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            type="number"
            placeholder="Contribution Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          >

            <option>
              Weekly
            </option>

            <option>
              Monthly
            </option>

          </select>

          <input
            type="number"
            placeholder="Total Members"
            value={members}
            onChange={(e) =>
              setMembers(
                e.target.value
              )
            }
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >

            {loading
              ? 'Creating...'
              : 'Create Group'}

          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateGroup