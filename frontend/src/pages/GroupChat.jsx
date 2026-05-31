import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { showError } from '../lib/toast'

function GroupChat() {

  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('group_messages')
      .select('*, profiles(full_name)')
      .eq('group_id', id)
      .order('created_at', { ascending: true })

    if (error) { showError('Failed to load messages.'); return }
    if (data) setMessages(data)
  }, [id])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`group-chat-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public',
        table: 'group_messages', filter: `group_id=eq.${id}`,
      }, () => { fetchMessages() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMessages, id])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { showError('Please log in to send messages.'); return }

      const { error } = await supabase
        .from('group_messages')
        .insert([{ group_id: id, user_id: user.id, message }])

      if (error) { showError('Failed to send message. Please try again.'); return }
      setMessage('')

    } catch (error) {
      showError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <div className="bg-blue-600 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">Group Chat</h1>
        <p className="text-blue-100 mt-1">Realtime conversation</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <p className="text-gray-500">No messages yet — say hello!</p>
          </div>
        ) : (
          messages.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{item.profiles?.full_name}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleTimeString()}
                </p>
              </div>
              <p className="text-gray-700 mt-3">{item.message}</p>
            </div>
          ))
        )}
      </div>

      {/* SEND MESSAGE */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-gray-200 p-4 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition"
        >
          <Send size={20} />
        </button>
      </form>

    </div>
  )
}

export default GroupChat