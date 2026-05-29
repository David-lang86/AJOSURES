import {
  ArrowLeft,
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'

import { Link } from 'react-router-dom'

function Wallet() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-24">

      {/* Header */}
      <div className="flex items-center gap-4">

        <Link
          to="/dashboard"
          className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Wallet
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your thrift funds securely
          </p>

        </div>

      </div>

      {/* Balance Card */}
      <div className="bg-blue-600 rounded-3xl p-6 mt-8 text-white shadow-sm">

        <p className="text-blue-100">
          Available Balance
        </p>

        <h2 className="text-5xl font-bold mt-4">
          ₦25,000
        </h2>

        <div className="flex items-center gap-3 mt-8">

          <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl font-semibold transition">
            Fund Wallet
          </button>

          <button className="bg-white text-gray-900 px-5 py-3 rounded-2xl font-semibold">
            Withdraw
          </button>

        </div>

      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Payment Methods
            </h2>

            <p className="text-gray-500 mt-1">
              Linked cards and banks
            </p>

          </div>

          <button className="text-blue-600 font-semibold">
            Add New
          </button>

        </div>

        {/* Bank Card */}
        <div className="border border-gray-200 rounded-2xl p-4 mt-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Landmark className="text-blue-600" />
            </div>

            <div>

              <h3 className="font-semibold">
                GTBank
              </h3>

              <p className="text-sm text-gray-500">
                0123456789
              </p>

            </div>

          </div>

          <p className="text-green-600 font-semibold">
            Linked
          </p>

        </div>

        {/* Card */}
        <div className="border border-gray-200 rounded-2xl p-4 mt-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <CreditCard className="text-green-600" />
            </div>

            <div>

              <h3 className="font-semibold">
                Visa Card
              </h3>

              <p className="text-sm text-gray-500">
                **** 4589
              </p>

            </div>

          </div>

          <p className="text-green-600 font-semibold">
            Active
          </p>

        </div>

      </div>

      {/* Recent Wallet Activity */}
      <div className="mt-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-bold text-gray-900">
            Wallet Activity
          </h2>

          <button className="text-blue-600 font-semibold">
            View All
          </button>

        </div>

        <div className="space-y-4">

          {/* Incoming */}
          <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <ArrowDownLeft className="text-green-600" />
              </div>

              <div>

                <h3 className="font-semibold">
                  Wallet Funding
                </h3>

                <p className="text-sm text-gray-500">
                  Today
                </p>

              </div>

            </div>

            <p className="font-bold text-green-600">
              + ₦10,000
            </p>

          </div>

          {/* Outgoing */}
          <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <ArrowUpRight className="text-red-600" />
              </div>

              <div>

                <h3 className="font-semibold">
                  Contribution Payment
                </h3>

                <p className="text-sm text-gray-500">
                  Yesterday
                </p>

              </div>

            </div>

            <p className="font-bold text-red-600">
              - ₦5,000
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Wallet