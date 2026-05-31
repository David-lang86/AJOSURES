import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  Phone,
  CreditCard,
  LogOut,
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'
import { showSuccess, showError } from '../lib/toast'

function Profile() {

  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)

  // GET PROFILE
  const getProfile = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {

      console.log(error)

    }

    if (data) {

      setProfile(data)

    }

  }

  // LOGOUT
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) { showError(error.message); return }
    showSuccess('Logged out successfully.')
    navigate('/')
  }

  useEffect(() => {

    const loadProfile = async () => {

      await getProfile()

    }

    loadProfile()

  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <Link
          to="/dashboard"
          className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your account
          </p>

        </div>

      </div>

      {/* PROFILE CARD */}
      <div className="bg-blue-600 rounded-3xl p-6 mt-8 text-white shadow-sm">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">

            {profile?.full_name?.charAt(0)}

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {profile?.full_name}
            </h2>

            <p className="text-blue-100 mt-1">
              AJOSURES Member
            </p>

            <div className="flex items-center gap-2 mt-3">

              <ShieldCheck size={18} />

              <span className="text-sm">
                Verified Account
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* INFO */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

        <h2 className="text-lg font-bold text-gray-900">
          Personal Information
        </h2>

        <div className="mt-6 space-y-5">

          {/* EMAIL */}
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Mail className="text-blue-600" />
            </div>

            <div>

              <p className="font-semibold">
                Email Address
              </p>

              <p className="text-sm text-gray-500">
                {profile?.email}
              </p>

            </div>

          </div>

          {/* PHONE */}
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Phone className="text-green-600" />
            </div>

            <div>

              <p className="font-semibold">
                Phone Number
              </p>

              <p className="text-sm text-gray-500">
                {profile?.phone}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* VERIFICATION */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

        <h2 className="text-lg font-bold text-gray-900">
          Verification
        </h2>

        <div className="mt-6 space-y-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <CreditCard className="text-orange-600" />
              </div>

              <div>

                <p className="font-semibold">
                  BVN Verification
                </p>

                <p className="text-sm text-gray-500">
                  Pending
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 bg-red-600 hover:bg-red-700 transition text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3"
      >

        <LogOut size={20} />

        Logout

      </button>

    </div>
  )
}

export default Profile