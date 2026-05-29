import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateGroup from './pages/CreateGroup'
import JoinGroup from './pages/JoinGroup'
import GroupDetails from './pages/GroupDetails'
import GroupChat from './pages/GroupChat'
import Notifications from './pages/Notifications'
import Wallet from './pages/Wallet'
import Withdraw from './pages/Withdraw'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'
import FlutterwavePayment
from './pages/FlutterwavePayment'

import AdminDashboard
from './pages/AdminDashboard'

import AdminWithdrawals
from './pages/AdminWithdrawals'

import AdminPayouts
from './pages/AdminPayouts'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/create-group"
          element={<CreateGroup />}
        />

        <Route
          path="/join-group"
          element={<JoinGroup />}
        />

        <Route
          path="/group/:id"
          element={<GroupDetails />}
        />

        <Route
          path="/group-chat/:id"
          element={<GroupChat />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/wallet"
          element={<Wallet />}
        />

        <Route
          path="/withdraw"
          element={<Withdraw />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/fund-wallet"
          element={<FlutterwavePayment />}
        />

        {/* ADMIN */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-withdrawals"
          element={<AdminWithdrawals />}
        />

        <Route
          path="/admin-payouts"
          element={<AdminPayouts />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App