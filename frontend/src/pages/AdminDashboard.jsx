import {
  Users,
  Wallet,
  Bell,
  TrendingUp,
} from 'lucide-react'

function AdminDashboard() {

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              AJOSURES Analytics Overview
            </p>

          </div>

        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <Users
              className="text-blue-600"
              size={40}
            />

            <h2 className="text-4xl font-bold mt-5">
              120
            </h2>

            <p className="text-gray-500 mt-2">
              Total Users
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <Wallet
              className="text-green-600"
              size={40}
            />

            <h2 className="text-4xl font-bold mt-5">
              ₦2.4M
            </h2>

            <p className="text-gray-500 mt-2">
              Total Contributions
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <Bell
              className="text-orange-500"
              size={40}
            />

            <h2 className="text-4xl font-bold mt-5">
              18
            </h2>

            <p className="text-gray-500 mt-2">
              Pending Withdrawals
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <TrendingUp
              className="text-purple-600"
              size={40}
            />

            <h2 className="text-4xl font-bold mt-5">
              89%
            </h2>

            <p className="text-gray-500 mt-2">
              Growth Rate
            </p>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="bg-white rounded-3xl p-8 shadow-sm mt-10">

          <h2 className="text-2xl font-bold">
            Recent Transactions
          </h2>

          <div className="space-y-5 mt-8">

            <div className="flex items-center justify-between border-b pb-4">

              <div>

                <h3 className="font-semibold">
                  Wallet Funding
                </h3>

                <p className="text-sm text-gray-500">
                  John funded wallet
                </p>

              </div>

              <p className="font-bold text-green-600">
                +₦50,000
              </p>

            </div>

            <div className="flex items-center justify-between border-b pb-4">

              <div>

                <h3 className="font-semibold">
                  Group Contribution
                </h3>

                <p className="text-sm text-gray-500">
                  Sarah paid contribution
                </p>

              </div>

              <p className="font-bold text-blue-600">
                ₦20,000
              </p>

            </div>

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Withdrawal Approved
                </h3>

                <p className="text-sm text-gray-500">
                  Admin approved payout
                </p>

              </div>

              <p className="font-bold text-red-500">
                -₦100,000
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default AdminDashboard