"use client"

import { useState, useEffect } from "react"
import { Cloud, Zap, Eye } from "lucide-react"

export default function VercelSection() {
  const [deploymentStatus, setDeploymentStatus] = useState("READY")
  const [edgeMetrics, setEdgeMetrics] = useState({
    regions: 23,
    requests: 1247892,
    latency: 47,
    uptime: 99.99,
  })

  const vercelFeatures = [
    {
      title: "FLUID COMPUTE",
      description: "Adaptive scaling with intelligent resource allocation and automatic optimization",
      status: "OPTIMIZED",
      metrics: { scaling: "Auto", efficiency: "94%", cost: "Optimized", regions: "Global" },
      icon: Cloud,
    },
    {
      title: "TURBO PREVIEWS",
      description: "Instant deployment previews with zero-config setup and real-time collaboration",
      status: "ACTIVE",
      metrics: { speed: "< 10s", accuracy: "100%", branches: "All", builds: "Parallel" },
      icon: Zap,
    },
    {
      title: "EDGE FUNCTIONS",
      description: "Global edge computing for minimal latency with intelligent request routing",
      status: "DEPLOYED",
      metrics: { regions: "23", latency: "< 50ms", coverage: "Global", runtime: "V8" },
      icon: Zap,
    },
    {
      title: "OBSERVABILITY",
      description: "Real-time monitoring and performance analytics with predictive insights",
      status: "MONITORING",
      metrics: { uptime: "99.99%", alerts: "Real-time", insights: "AI-powered", logs: "Structured" },
      icon: Eye,
    },
  ]

  useEffect(() => {
    const deploymentInterval = setInterval(() => {
      const statuses = ["READY", "BUILDING", "DEPLOYING", "LIVE"]
      setDeploymentStatus((prev) => {
        const currentIndex = statuses.indexOf(prev)
        return statuses[(currentIndex + 1) % statuses.length]
      })
    }, 4000)

    const metricsInterval = setInterval(() => {
      setEdgeMetrics((prev) => ({
        regions: 23,
        requests: prev.requests + Math.floor(Math.random() * 100),
        latency: Math.max(30, Math.min(80, prev.latency + Math.floor(Math.random() * 10 - 5))),
        uptime: Math.max(99.9, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.01)),
      }))
    }, 2000)

    return () => {
      clearInterval(deploymentInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  return (
    <section id="vercel" className="py-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="circuit-pattern" width="150" height="150" patternUnits="userSpaceOnUse">
              <path
                d="M 0 75 L 37.5 75 L 37.5 37.5 L 112.5 37.5 L 112.5 112.5 L 150 112.5"
                fill="none"
                stroke="#fff"
                strokeWidth="1"
              />
              <circle cx="37.5" cy="75" r="5" fill="#fff" />
              <circle cx="112.5" cy="37.5" r="5" fill="#fff" />
              <rect x="107.5" y="107.5" width="10" height="10" fill="none" stroke="#fff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">VERCEL INFRASTRUCTURE</h2>
          <div className="w-32 h-px bg-white mx-auto mb-8"></div>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Powered by Vercel's cutting-edge platform architecture with global edge computing
          </p>
        </div>

        <div className="mb-20 bg-gray-900 border-2 border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono font-bold text-xl">DEPLOYMENT STATUS</h3>
            <div
              className={`px-4 py-2 text-sm font-mono ${
                deploymentStatus === "LIVE"
                  ? "bg-green-600"
                  : deploymentStatus === "READY"
                    ? "bg-blue-600"
                    : "bg-yellow-600"
              }`}
            >
              {deploymentStatus}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-gray-400 text-xs font-mono mb-2">REGIONS</div>
              <div className="text-3xl font-mono font-bold">{edgeMetrics.regions}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs font-mono mb-2">REQUESTS</div>
              <div className="text-3xl font-mono font-bold">{edgeMetrics.requests.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs font-mono mb-2">LATENCY</div>
              <div className="text-3xl font-mono font-bold">{edgeMetrics.latency}ms</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs font-mono mb-2">UPTIME</div>
              <div className="text-3xl font-mono font-bold">{edgeMetrics.uptime.toFixed(2)}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {vercelFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="border-2 border-gray-700 bg-gray-900 p-8 relative group hover:border-gray-500 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="absolute top-6 right-6">
                  <div className="w-3 h-3 bg-white rounded-full opacity-60 animate-pulse"></div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <IconComponent size={24} className="text-gray-400" />
                  <h3 className="font-mono font-bold text-lg tracking-wide">{feature.title}</h3>
                </div>

                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{feature.description}</p>

                <div className="space-y-3 mb-6">
                  {Object.entries(feature.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs font-mono">
                      <span className="text-gray-500 uppercase">{key}:</span>
                      <span className="text-white font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">{feature.status}</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-6 bg-white opacity-80"></div>
                    <div className="w-1 h-6 bg-white opacity-60"></div>
                    <div className="w-1 h-6 bg-white opacity-40"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-2 border-gray-700 bg-gray-900 p-10">
          <h3 className="font-mono font-bold text-2xl mb-10 text-center">DEPLOYMENT ARCHITECTURE</h3>

          <div className="space-y-12">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-white flex items-center justify-center mb-3 relative">
                  <span className="text-lg font-mono">CLI</span>
                  {deploymentStatus === "BUILDING" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white animate-ping"></div>
                  )}
                </div>
                <span className="text-sm text-gray-400 font-mono">VERCEL CLI</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-16 bg-gray-600 relative">
                {deploymentStatus === "DEPLOYING" && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white animate-bounce"></div>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center space-x-20">
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-white flex items-center justify-center mb-3">
                  <span className="text-sm font-mono">EDGE</span>
                </div>
                <span className="text-sm text-gray-400 font-mono">GLOBAL NETWORK</span>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 border-2 border-white flex items-center justify-center mb-3">
                  <span className="text-sm font-mono">CDN</span>
                </div>
                <span className="text-sm text-gray-400 font-mono">CONTENT DELIVERY</span>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 border-2 border-white flex items-center justify-center mb-3">
                  <span className="text-sm font-mono">FN</span>
                </div>
                <span className="text-sm text-gray-400 font-mono">EDGE FUNCTIONS</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-px h-16 bg-gray-600"></div>
            </div>

            <div className="flex justify-center">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-white flex items-center justify-center mb-3 relative">
                  <span className="text-lg font-mono">APP</span>
                  {deploymentStatus === "LIVE" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 animate-pulse"></div>
                  )}
                </div>
                <span className="text-sm text-gray-400 font-mono">NEXORASIM</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-mono font-bold mb-2">{"< 100ms"}</div>
                <div className="text-sm text-gray-400 font-mono">COLD START</div>
              </div>
              <div>
                <div className="text-3xl font-mono font-bold mb-2">99.99%</div>
                <div className="text-sm text-gray-400 font-mono">AVAILABILITY</div>
              </div>
              <div>
                <div className="text-3xl font-mono font-bold mb-2">23</div>
                <div className="text-sm text-gray-400 font-mono">EDGE REGIONS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
