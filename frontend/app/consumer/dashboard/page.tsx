"use client"

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navigation from '../../components/Navigation'

export default function ConsumerDashboard() {
  const { isConnected, address } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <main className="min-h-screen bg-white text-black overflow-hidden">
      <Navigation variant="consumer" />
      
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 border border-black opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 border border-black opacity-15 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-black opacity-30 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-1 bg-black opacity-10 rotate-12"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border border-black opacity-10 rotate-45"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-light tracking-wider mb-4 font-mono">
            CONSUMER <span className="font-bold">DASHBOARD</span>
          </h1>
          <div className="w-64 h-px bg-black mb-8 relative">
            <div className="absolute left-0 top-0 h-full bg-black animate-pulse" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Wallet Info Card */}
        <div className="mb-8 p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black]">
          <h2 className="text-2xl font-mono font-bold mb-4">Connected Wallet</h2>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="font-mono text-lg">{address}</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Asset Submission Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">Submit Asset</h3>
            <p className="text-gray-600 mb-4">Request verification for your real-world assets</p>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono">
              Submit New Asset
            </button>
          </div>

          {/* My Assets Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">My Assets</h3>
            <p className="text-gray-600 mb-4">View and manage your tokenized assets</p>
            <div className="text-4xl font-bold font-mono">0</div>
            <p className="text-sm text-gray-500 mt-2">Total Assets</p>
          </div>

          {/* Verification Status Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">Pending Verifications</h3>
            <p className="text-gray-600 mb-4">Assets currently being verified</p>
            <div className="text-4xl font-bold font-mono">0</div>
            <p className="text-sm text-gray-500 mt-2">In Progress</p>
          </div>

          {/* Portfolio Value Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">Portfolio Value</h3>
            <p className="text-gray-600 mb-4">Total value of verified assets</p>
            <div className="text-4xl font-bold font-mono">$0</div>
            <p className="text-sm text-gray-500 mt-2">USD</p>
          </div>

          {/* Marketplace Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">Marketplace</h3>
            <p className="text-gray-600 mb-4">Browse and trade tokenized assets</p>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono">
              Explore Market
            </button>
          </div>

          {/* Activity Card */}
          <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
            <h3 className="text-xl font-mono font-bold mb-3">Recent Activity</h3>
            <p className="text-gray-600 mb-4">Your latest transactions</p>
            <p className="text-sm text-gray-500 italic">No recent activity</p>
          </div>
        </div>
      </div>
    </main>
  )
}
