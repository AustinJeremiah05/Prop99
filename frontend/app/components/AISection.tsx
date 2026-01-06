"use client"

import { useState, useEffect } from "react"
import { Brain, Zap, Settings } from "lucide-react"

export default function AISection() {
  const [activePanel, setActivePanel] = useState(0)
  const [processingData, setProcessingData] = useState(false)
  const [metrics, setMetrics] = useState({
    throughput: 1247,
    accuracy: 99.8,
    latency: 47,
    efficiency: 94.2,
  })

  const panels = [
    {
      title: "WORKFLOW AUTOMATION",
      description: "Intelligent process optimization and task scheduling with machine learning algorithms",
      metrics: ["99.9% Uptime", "< 50ms Response", "Auto-scaling", "ML-powered"],
      processes: ["Data Ingestion", "Pattern Recognition", "Decision Making", "Action Execution"],
      icon: Settings,
    },
    {
      title: "PREDICTIVE ANALYTICS",
      description: "Advanced pattern recognition and usage forecasting using deep learning models",
      metrics: ["Real-time Analysis", "95% Accuracy", "Data-driven", "Trend Prediction"],
      processes: ["Data Collection", "Feature Extraction", "Model Training", "Prediction Output"],
      icon: Brain,
    },
    {
      title: "SMART PROVISIONING",
      description: "Automated eSIM deployment and configuration management with zero-touch operations",
      metrics: ["Zero-touch Deploy", "Bulk Operations", "Error Recovery", "Auto-healing"],
      processes: ["Profile Creation", "Validation", "Deployment", "Monitoring"],
      icon: Zap,
    },
  ]

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMetrics((prev) => ({
        throughput: prev.throughput + Math.floor(Math.random() * 20 - 10),
        accuracy: Math.max(95, Math.min(100, prev.accuracy + (Math.random() - 0.5) * 0.2)),
        latency: Math.max(30, Math.min(80, prev.latency + Math.floor(Math.random() * 10 - 5))),
        efficiency: Math.max(90, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 0.5)),
      }))
    }, 2000)

    const processingInterval = setInterval(() => {
      setProcessingData(true)
      setTimeout(() => setProcessingData(false), 1500)
    }, 5000)

    return () => {
      clearInterval(metricsInterval)
      clearInterval(processingInterval)
    }
  }, [])

  return (
    <section id="ai" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light tracking-wider mb-6 font-mono">
            ONE<span className="font-bold">X</span>™ AI ENGINE
          </h2>
          <div className="w-32 h-px bg-black mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Advanced artificial intelligence powering next-generation eSIM management and automation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            {panels.map((panel, index) => {
              const IconComponent = panel.icon
              return (
                <div
                  key={index}
                  className={`border-2 p-8 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activePanel === index ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setActivePanel(index)}
                >
                  {activePanel === index && processingData && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <div className="text-sm font-mono text-black animate-pulse">PROCESSING...</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent size={24} className="text-gray-600" />
                      <h3 className="font-mono font-bold text-xl">{panel.title}</h3>
                    </div>
                    <div
                      className={`w-4 h-4 ${activePanel === index ? "bg-black animate-pulse" : "bg-gray-300"}`}
                    ></div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{panel.description}</p>

                  {activePanel === index && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3">
                        {panel.metrics.map((metric, i) => (
                          <span key={i} className="bg-black text-white px-3 py-2 text-xs font-mono text-center">
                            {metric}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-mono text-gray-500 mb-3">PROCESS FLOW:</div>
                        {panel.processes.map((process, i) => (
                          <div key={i} className="flex items-center space-x-3 text-sm">
                            <div
                              className={`w-3 h-3 ${processingData && i <= 2 ? "bg-black animate-pulse" : "bg-gray-400"}`}
                            ></div>
                            <span className="font-mono">{process}</span>
                            {i < panel.processes.length - 1 && <div className="flex-1 h-px bg-gray-300 ml-2"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="space-y-8">
            <div className="relative h-96 border-2 border-gray-200 bg-gray-50 p-8">
              <h4 className="font-mono font-bold text-lg mb-6">NEURAL NETWORK ACTIVITY</h4>
              <div className="relative h-full">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <g>
                    {[0, 1, 2, 3].map((i) => (
                      <circle
                        key={`input-${i}`}
                        cx="60"
                        cy={60 + i * 60}
                        r="8"
                        fill="#000"
                        opacity={processingData ? "0.8" : "0.4"}
                      >
                        {processingData && (
                          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
                        )}
                      </circle>
                    ))}
                  </g>

                  <g>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <circle
                        key={`hidden1-${i}`}
                        cx="180"
                        cy={40 + i * 50}
                        r="6"
                        fill="#000"
                        opacity={processingData ? "0.6" : "0.3"}
                      >
                        {processingData && (
                          <animate
                            attributeName="opacity"
                            values="0.3;0.6;0.3"
                            dur="1s"
                            begin={`${i * 0.1}s`}
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    ))}
                  </g>

                  <g>
                    {[0, 1, 2].map((i) => (
                      <circle
                        key={`hidden2-${i}`}
                        cx="300"
                        cy={80 + i * 60}
                        r="6"
                        fill="#000"
                        opacity={processingData ? "0.6" : "0.3"}
                      >
                        {processingData && (
                          <animate
                            attributeName="opacity"
                            values="0.3;0.6;0.3"
                            dur="1s"
                            begin={`${i * 0.15}s`}
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    ))}
                  </g>

                  <g>
                    {[0, 1].map((i) => (
                      <circle
                        key={`output-${i}`}
                        cx="420"
                        cy={100 + i * 60}
                        r="8"
                        fill="#000"
                        opacity={processingData ? "0.8" : "0.4"}
                      >
                        {processingData && (
                          <animate
                            attributeName="opacity"
                            values="0.4;0.8;0.4"
                            dur="1s"
                            begin="0.5s"
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    ))}
                  </g>

                  {[0, 1, 2, 3].map((i) =>
                    [0, 1, 2, 3, 4].map((j) => (
                      <line
                        key={`conn-input-${i}-${j}`}
                        x1="60"
                        y1={60 + i * 60}
                        x2="180"
                        y2={40 + j * 50}
                        stroke="#000"
                        strokeWidth="1"
                        opacity={processingData ? "0.3" : "0.1"}
                      />
                    )),
                  )}

                  {[0, 1, 2, 3, 4].map((i) =>
                    [0, 1, 2].map((j) => (
                      <line
                        key={`conn-hidden1-${i}-${j}`}
                        x1="180"
                        y1={40 + i * 50}
                        x2="300"
                        y2={80 + j * 60}
                        stroke="#000"
                        strokeWidth="1"
                        opacity={processingData ? "0.3" : "0.1"}
                      />
                    )),
                  )}

                  {[0, 1, 2].map((i) =>
                    [0, 1].map((j) => (
                      <line
                        key={`conn-hidden2-${i}-${j}`}
                        x1="300"
                        y1={80 + i * 60}
                        x2="420"
                        y2={100 + j * 60}
                        stroke="#000"
                        strokeWidth="1"
                        opacity={processingData ? "0.3" : "0.1"}
                      />
                    )),
                  )}
                </svg>

                <div className="absolute bottom-4 left-0 right-0 flex justify-between text-xs font-mono text-gray-500">
                  <span>INPUT</span>
                  <span>HIDDEN</span>
                  <span>HIDDEN</span>
                  <span>OUTPUT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-gray-200 p-6 bg-white">
                <div className="text-xs font-mono text-gray-500 mb-2">THROUGHPUT</div>
                <div className="text-3xl font-mono font-bold">{metrics.throughput.toLocaleString()}</div>
                <div className="text-xs text-gray-500">req/sec</div>
              </div>
              <div className="border-2 border-gray-200 p-6 bg-white">
                <div className="text-xs font-mono text-gray-500 mb-2">ACCURACY</div>
                <div className="text-3xl font-mono font-bold">{metrics.accuracy.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">prediction</div>
              </div>
              <div className="border-2 border-gray-200 p-6 bg-white">
                <div className="text-xs font-mono text-gray-500 mb-2">LATENCY</div>
                <div className="text-3xl font-mono font-bold">{metrics.latency}ms</div>
                <div className="text-xs text-gray-500">avg response</div>
              </div>
              <div className="border-2 border-gray-200 p-6 bg-white">
                <div className="text-xs font-mono text-gray-500 mb-2">EFFICIENCY</div>
                <div className="text-3xl font-mono font-bold">{metrics.efficiency.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">resource util</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
