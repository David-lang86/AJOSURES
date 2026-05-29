import { useCallback, useEffect, useState } from 'react'

import { Bell } from 'lucide-react'

import { supabase } from '../lib/supabase'

function Notifications() {

  const [notifications, setNotifications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const fetchNotifications =
    useCallback(async () => {

      try {

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } =
          await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', {
              ascending: false,
            })

        if (error) {

          console.log(error)

          return

        }

        setNotifications(data || [])

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }, [])

  useEffect(() => {

    let mounted = true

    const loadData = async () => {

      if (mounted) {

        await fetchNotifications()

      }

    }

    loadData()

    const channel =
      supabase
        .channel('notifications-live')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
          },
          async () => {

            if (mounted) {

              await fetchNotifications()

            }

          }
        )
        .subscribe()

    return () => {

      mounted = false

      supabase.removeChannel(channel)

    }

  }, [fetchNotifications])

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <p className="text-gray-500">
          Loading notifications...
        </p>

      </div>
    )

  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

            <Bell className="text-blue-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-gray-500 mt-1">
              Realtime updates from your thrift groups
            </p>

          </div>

        </div>

        {notifications.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 shadow-sm text-center">

            <h2 className="text-xl font-bold text-gray-800">
              No Notifications Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Your updates will appear here
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className="bg-white rounded-3xl p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-bold text-gray-900">
                        {notification.title}
                      </h3>

                      <p className="text-gray-500 mt-2">
                        {notification.message}
                      </p>

                    </div>

                    {!notification.is_read && (

                      <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />

                    )}

                  </div>

                  <p className="text-xs text-gray-400 mt-4">

                    {new Date(
                      notification.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  )
}

export default Notifications