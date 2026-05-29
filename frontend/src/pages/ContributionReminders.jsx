import {
  useEffect,
  useState,
} from 'react'

import { supabase } from '../lib/supabase'

function ContributionReminders() {

  const [groups, setGroups] =
    useState([])

  useEffect(() => {

    const fetchReminders =
      async () => {

        const {
          data: { user },
        } =
          await supabase.auth.getUser()

        if (!user) return

        const { data } =
          await supabase
            .from('group_members')
            .select(`
              groups (
                id,
                group_name,
                contribution_amount,
                next_due_date
              )
            `)
            .eq('user_id', user.id)

        const formatted =
          data.map(
            (item) =>
              item.groups
          )

        setGroups(formatted)
      }

    fetchReminders()

  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <h1 className="text-3xl font-bold text-blue-600">

        Contribution Reminders

      </h1>

      <div className="space-y-4 mt-8">

        {groups.map((group) => (

          <div
            key={group.id}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >

            <h2 className="font-bold text-lg">

              {group.group_name}

            </h2>

            <p className="text-gray-500 mt-2">

              Due Date:
              <span className="font-semibold ml-2">

                {group.next_due_date}

              </span>

            </p>

            <p className="text-green-600 font-bold mt-3">

              ₦
              {Number(
                group.contribution_amount
              ).toLocaleString()}

            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

export default ContributionReminders