import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { showSuccess, showError, showLoading, dismissToast } from '../lib/toast'

function JoinGroup() {

  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoinGroup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // GET USER
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { showError('Please log in to join a group.'); return }

      // FIND GROUP
      const { data: group, error } = await supabase
        .from('groups').select('*')
        .eq('invite_code', inviteCode.toUpperCase()).single()

      if (error || !group) {
        showError('Invalid invite code. Please check and try again.')
        setLoading(false)
        return
      }

      // CHECK MEMBER
      const { data: existingMember } = await supabase
        .from('group_members').select('*')
        .eq('group_id', group.id).eq('user_id', user.id).single()

      if (existingMember) {
        showError('You are already a member of this group.')
        setLoading(false)
        return
      }

      // CHECK LIMIT
      const { count } = await supabase
        .from('group_members').select('*', { count: 'exact', head: true })
        .eq('group_id', group.id)

      if (count >= group.total_members) {
        showError('This group is already full.')
        setLoading(false)
        return
      }

      const toastId = showLoading('Joining group...')

      // JOIN GROUP
      const { error: joinError } = await supabase
        .from('group_members').insert([{ group_id: group.id, user_id: user.id }])

      if (joinError) {
        dismissToast(toastId)
        showError(joinError.message)
        setLoading(false)
        return
      }

      // GET ROTATION COUNT
      const { count: rotationCount } = await supabase
        .from('payout_rotations').select('*', { count: 'exact', head: true })
        .eq('group_id', group.id)

      // ADD ROTATION
      await supabase.from('payout_rotations').insert([{
        group_id: group.id,
        user_id: user.id,
        position: (rotationCount || 0) + 1,
      }])

      // NOTIFICATION
      await supabase.from('notifications').insert([{
        user_id: user.id,
        title: 'Joined Group',
        message: `You joined ${group.group_name}`,
      }])

      // TRANSACTION
      await supabase.from('transactions').insert([{
        user_id: user.id,
        group_id: group.id,
        title: `Joined ${group.group_name}`,
        amount: 0,
        type: 'group_join',
        status: 'successful',
      }])

      dismissToast(toastId)
      showSuccess(`Successfully joined ${group.group_name}!`)
      navigate('/dashboard')

    } catch (error) {
      showError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-blue-600">Join Group</h1>
        <p className="text-gray-500 mt-2">Enter a valid invite code</p>

        <form onSubmit={handleJoinGroup} className="bg-white rounded-3xl p-6 shadow-sm mt-8 space-y-5">

          <div>
            <label className="font-semibold text-gray-700">Invite Code</label>
            <input
              type="text"
              placeholder="Enter invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-4 uppercase outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? 'Joining Group...' : 'Join Group'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default JoinGroup