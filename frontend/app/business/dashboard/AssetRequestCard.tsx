"use client"

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { routerConfig } from '../../../config/onchain'

const StatusBadge = ({ status }: { status: number }) => {
  const labels = ['PENDING', 'PROCESSING', 'VERIFIED', 'REJECTED']
  const colors = ['bg-yellow-100 text-yellow-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-red-100 text-red-800']
  return (
    <span className={`px-2 py-1 text-xs font-mono rounded ${colors[status] || colors[0]}`}>
      {labels[status] || 'UNKNOWN'}
    </span>
  )
}

export default function AssetRequestCard({ requestId }: { requestId: bigint }) {
  const [showDetails, setShowDetails] = useState(false)
  const [ipfsData, setIpfsData] = useState<any>(null)
  const [ipfsLoading, setIpfsLoading] = useState(false)
  const { data: request } = useReadContract({
    ...routerConfig,
    functionName: 'getRequest',
    args: [requestId],
  })

  // Fetch IPFS metadata when details are shown
  useEffect(() => {
    if (!showDetails || ipfsData || !request) return
    
    const req = request as any
    if (!req.ipfsHashes || req.ipfsHashes.length === 0) return

    const fetchIPFS = async () => {
      try {
        setIpfsLoading(true)
        const ipfsHash = req.ipfsHashes[0]
        const res = await fetch(`/api/ipfs/fetch?hash=${ipfsHash}`)
        if (!res.ok) throw new Error('Failed to fetch IPFS data')
        const data = await res.json()
        setIpfsData(data)
      } catch (err) {
        console.error('Failed to fetch IPFS:', err)
        setIpfsData(null)
      } finally {
        setIpfsLoading(false)
      }
    }

    fetchIPFS()
  }, [showDetails, request, ipfsData])

  if (!request) {
    return (
      <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  // Access struct properties directly (returned as object, not array)
  const req = request as any
  
  const assetTypes = ['Real Estate', 'Invoice', 'Vehicle', 'Art', 'Commodity', 'Other']
  const assetName = assetTypes[req.assetType || 0] || 'Unknown'
  const date = new Date(Number(req.timestamp) * 1000).toLocaleDateString()

  const agentStatuses = [
    { label: 'Agent 1', status: 'Pending' },
    { label: 'Agent 2', status: 'Pending' },
    { label: 'Agent 3', status: 'Pending' },
  ] as const

  return (
    <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-mono font-bold">Request #{req.requestId?.toString() || requestId}</h3>
          <p className="text-sm text-gray-600">{assetName}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>
      
      <div className="space-y-2 text-sm font-mono mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="truncate ml-2 text-right max-w-[60%]">{req.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Submitted:</span>
          <span>{date}</span>
        </div>
        {req.valuation > BigInt(0) && (
          <div className="flex justify-between">
            <span className="text-gray-600">Valuation:</span>
            <span className="font-bold">${(Number(req.valuation) / 1e18).toFixed(2)}</span>
          </div>
        )}
        {req.confidence > BigInt(0) && (
          <div className="flex justify-between">
            <span className="text-gray-600">Confidence:</span>
            <span>{req.confidence.toString()}%</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowDetails((prev) => !prev)}
        className="w-full px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm"
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-4 font-mono text-sm">
          {/* Basic Request Info */}
          <div className="p-3 border border-black rounded-lg bg-gray-50">
            <div className="text-xs font-semibold text-gray-600 mb-2">REQUEST INFO</div>
            <div className="flex justify-between"><span className="text-gray-600">Request ID</span><span>{req.requestId?.toString() || requestId.toString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Owner</span><span className="truncate ml-2 text-right max-w-[60%]">{req.owner}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Status</span><span>{StatusBadge && <StatusBadge status={req.status} />}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Submitted</span><span>{date}</span></div>
          </div>

          {/* Asset Details from IPFS */}
          {ipfsLoading ? (
            <div className="p-3 border border-black rounded-lg bg-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : ipfsData ? (
            <>
              <div className="p-3 border border-black rounded-lg bg-gray-50">
                <div className="text-xs font-semibold text-gray-600 mb-2">ASSET DETAILS</div>
                {ipfsData.asset?.name && <div className="flex justify-between"><span className="text-gray-600">Asset Name</span><span className="font-bold">{ipfsData.asset.name}</span></div>}
                {ipfsData.asset?.type && <div className="flex justify-between"><span className="text-gray-600">Type</span><span>{ipfsData.asset.type}</span></div>}
                {ipfsData.asset?.description && <div className="flex justify-between"><span className="text-gray-600">Description</span><span className="truncate ml-2 text-right max-w-[60%]">{ipfsData.asset.description}</span></div>}
              </div>

              {ipfsData.property && (
                <div className="p-3 border border-black rounded-lg bg-gray-50">
                  <div className="text-xs font-semibold text-gray-600 mb-2">PROPERTY</div>
                  {ipfsData.property.sizeSqft && <div className="flex justify-between"><span className="text-gray-600">Size</span><span>{ipfsData.property.sizeSqft} sq ft</span></div>}
                  {ipfsData.property.bedrooms !== null && <div className="flex justify-between"><span className="text-gray-600">Bedrooms</span><span>{ipfsData.property.bedrooms}</span></div>}
                  {ipfsData.property.bathrooms !== null && <div className="flex justify-between"><span className="text-gray-600">Bathrooms</span><span>{ipfsData.property.bathrooms}</span></div>}
                  {ipfsData.property.yearBuilt && <div className="flex justify-between"><span className="text-gray-600">Year Built</span><span>{ipfsData.property.yearBuilt}</span></div>}
                  {ipfsData.property.estValue && <div className="flex justify-between"><span className="text-gray-600">Est. Value</span><span>${ipfsData.property.estValue.toLocaleString()}</span></div>}
                  {ipfsData.property.notes && <div className="flex justify-between"><span className="text-gray-600">Notes</span><span className="truncate ml-2 text-right max-w-[60%]">{ipfsData.property.notes}</span></div>}
                </div>
              )}

              {ipfsData.location && (
                <div className="p-3 border border-black rounded-lg bg-gray-50">
                  <div className="text-xs font-semibold text-gray-600 mb-2">LOCATION</div>
                  {ipfsData.location.address && <div className="flex justify-between"><span className="text-gray-600">Address</span><span className="truncate ml-2 text-right max-w-[60%]">{ipfsData.location.address}</span></div>}
                  {ipfsData.location.gps && <div className="flex justify-between"><span className="text-gray-600">GPS</span><span>{ipfsData.location.gps.lat}, {ipfsData.location.gps.lng}</span></div>}
                </div>
              )}

              <div className="p-3 border border-black rounded-lg bg-gray-50">
                <div className="text-xs font-semibold text-gray-600 mb-2">PHOTOS</div>
                {(ipfsData.files?.photos || ipfsData.documents?.photos) && (ipfsData.files?.photos || ipfsData.documents?.photos).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(ipfsData.files?.photos || ipfsData.documents?.photos).map((hash: string, idx: number) => {
                      const cleanHash = hash.replace('ipfs://', '')
                      return (
                        <a 
                          key={idx}
                          href={`https://gateway.pinata.cloud/ipfs/${cleanHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border border-blue-500 rounded bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 truncate block text-center"
                          title={cleanHash}
                        >
                          Photo {idx + 1}
                        </a>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No photos</div>
                )}
              </div>

              <div className="p-3 border border-black rounded-lg bg-gray-50">
                <div className="text-xs font-semibold text-gray-600 mb-2">DOCUMENTS</div>
                {(ipfsData.files?.documents || ipfsData.documents?.files) && (ipfsData.files?.documents || ipfsData.documents?.files).length > 0 ? (
                  <div className="space-y-1">
                    {(ipfsData.files?.documents || ipfsData.documents?.files).map((hash: string, idx: number) => {
                      const cleanHash = hash.replace('ipfs://', '')
                      return (
                        <a 
                          key={idx}
                          href={`https://gateway.pinata.cloud/ipfs/${cleanHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border border-green-500 rounded bg-green-50 hover:bg-green-100 text-xs text-green-700 block text-center"
                          title={cleanHash}
                        >
                          📄 Document {idx + 1}
                        </a>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No documents</div>
                )}
              </div>
            </>
          ) : null}

          {/* Agent Status */}
          <div className="p-3 border border-black rounded-lg bg-gray-50">
            <div className="text-xs font-semibold text-gray-600 mb-2">AGENT VERIFICATION</div>
            <div className="space-y-1">
              {agentStatuses.map((agent) => (
                <div key={agent.label} className="flex justify-between items-center">
                  <span>{agent.label}</span>
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">{agent.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
