import { useState } from 'react'

import { Link } from 'react-router-dom'

import { supabase } from '../lib/supabase'

function Signup() {

  const [fullName, setFullName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleSignup = async (e) => {

    e.preventDefault()

    setLoading(true)

    try {

      // SIGN UP
      const {
        data,
        error,
      } = await supabase.auth.signUp({

        email,

        password,

        options: {

          data: {

            full_name: fullName,

          },

        },

      })

      if (error) {

        alert(error.message)

        setLoading(false)

        return

      }

      const user = data.user

      if (!user) {

        alert('Unable to create user')

        setLoading(false)

        return

      }

      // CREATE PROFILE
      const {
        error: profileError,
      } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            full_name: fullName,
            email: email,
          },
        ])

      if (profileError) {

        console.log(profileError)

      }

      // CREATE WALLET
      const {
        error: walletError,
      } = await supabase
        .from('wallets')
        .insert([
          {
            user_id: user.id,
            balance: 0,
          },
        ])

      if (walletError) {

        console.log(walletError)

      }

      alert('Account created successfully')

      window.location.href =
        '/dashboard'

    } catch (error) {

      console.log(error)

      alert('Something went wrong')

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-blue-600 text-center">
          AJOSURES
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Create your thrift account
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="font-semibold text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              required
              className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
            />

          </div>

          <div>

            <label className="font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              minLength={6}
              className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:border-blue-600"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-2xl font-semibold"
          >

            {loading
              ? 'Creating Account...'
              : 'Create Account'}

          </button>

        </form>

        <p className="text-center text-gray-500 mt-6">

          Already have an account?

          <Link
            to="/"
            className="text-blue-600 font-semibold ml-2"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Signup