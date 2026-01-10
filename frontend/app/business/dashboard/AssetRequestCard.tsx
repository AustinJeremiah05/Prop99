"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const [showModal, setShowModal] = useState(false)
  const [ipfsData, setIpfsData] = useState<any>(null)
  const [ipfsLoading, setIpfsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const { data: request } = useReadContract({
    ...routerConfig,
    functionName: 'getRequest',
    args: [requestId],
  })

  // Memoize request data to prevent re-renders
  const req = useMemo(() => request as any, [request])
  const assetTypes = useMemo(() => ['Real Estate', 'Invoice', 'Vehicle', 'Art', 'Commodity', 'Other'], [])
  const assetName = useMemo(() => assetTypes[req?.assetType || 0] || 'Unknown', [assetTypes, req?.assetType])
  const date = useMemo(() => req?.timestamp ? new Date(Number(req.timestamp) * 1000).toLocaleDateString() : '', [req?.timestamp])

  // Memoized callbacks to prevent re-renders
  const handleImageClick = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setSelectedImage(null)
  }, [])

  // Fetch IPFS metadata only once when modal opens
  useEffect(() => {
    if (!showModal) {
      return
    }
    
    if (ipfsData || !req) return
    
    if (!req.ipfsHashes || req.ipfsHashes.length === 0) return

    let isCancelled = false

    const fetchIPFS = async () => {
      try {
        setIpfsLoading(true)
        const ipfsHash = req.ipfsHashes[0]
        const res = await fetch(`/api/ipfs/fetch?hash=${ipfsHash}`)
        if (!res.ok) throw new Error('Failed to fetch IPFS data')
        const data = await res.json()
        
        if (!isCancelled) {
          setIpfsData(data)
        }
      } catch (err) {
        console.error('Failed to fetch IPFS:', err)
        if (!isCancelled) {
          setIpfsData(null)
        }
      } finally {
        if (!isCancelled) {
          setIpfsLoading(false)
        }
      }
    }

    fetchIPFS()

    return () => {
      isCancelled = true
    }
  }, [showModal, req, ipfsData])

  if (!request) {
    return (
      <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_black] transition-all">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-mono font-bold">Request #{req.requestId?.toString() || requestId.toString()}</h3>
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
          onClick={() => setShowModal(true)}
          className="w-full px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm"
        >
          View Details
        </button>
      </div>

      {/* Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl border-4 border-black shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-4 border-black p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-mono font-bold">Request #{req.requestId?.toString() || requestId.toString()}</h2>
                <p className="text-gray-600 font-mono">{assetName} • Submitted {date}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-black font-bold text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {ipfsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                  <p className="mt-4 font-mono text-gray-600">Loading asset details...</p>
                </div>
              ) : ipfsData ? (
                <>
                  {/* 3 Column Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Asset Information */}
                    <div className="p-6 bg-gray-50 border-2 border-black rounded-xl">
                      <h3 className="text-lg font-mono font-bold mb-4 border-b-2 border-black pb-2">Asset Information</h3>
                      <div className="space-y-3 text-sm font-mono">
                        {ipfsData.asset?.name && (
                          <div>
                            <span className="text-gray-600 block mb-1">Asset Name</span>
                            <p className="font-bold">{ipfsData.asset.name}</p>
                          </div>
                        )}
                        {ipfsData.asset?.type && (
                          <div>
                            <span className="text-gray-600 block mb-1">Type</span>
                            <p className="font-bold">{ipfsData.asset.type}</p>
                          </div>
                        )}
                        {ipfsData.asset?.description && (
                          <div>
                            <span className="text-gray-600 block mb-1">Description</span>
                            <p className="font-bold break-words">{ipfsData.asset.description}</p>
                          </div>
                        )}
                        {ipfsData.location?.address && (
                          <div>
                            <span className="text-gray-600 block mb-1">Location</span>
                            <p className="font-bold break-words">{ipfsData.location.address}</p>
                          </div>
                        )}
                        {ipfsData.location?.gps && (
                          <div>
                            <span className="text-gray-600 block mb-1">GPS Coordinates</span>
                            <p className="font-mono text-xs break-all">{ipfsData.location.gps.lat}, {ipfsData.location.gps.lng}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Property Details */}
                    {ipfsData.property && (
                      <div className="p-6 bg-gray-50 border-2 border-black rounded-xl">
                        <h3 className="text-lg font-mono font-bold mb-4 border-b-2 border-black pb-2">Property Details</h3>
                        <div className="space-y-3 text-sm font-mono">
                          {ipfsData.property.sizeSqft && (
                            <div>
                              <span className="text-gray-600 block mb-1">Size</span>
                              <span className="font-bold">{ipfsData.property.sizeSqft} sq ft</span>
                            </div>
                          )}
                          {ipfsData.property.bedrooms !== null && ipfsData.property.bedrooms !== undefined && (
                            <div>
                              <span className="text-gray-600 block mb-1">Bedrooms</span>
                              <span className="font-bold">{ipfsData.property.bedrooms}</span>
                            </div>
                          )}
                          {ipfsData.property.bathrooms !== null && ipfsData.property.bathrooms !== undefined && (
                            <div>
                              <span className="text-gray-600 block mb-1">Bathrooms</span>
                              <span className="font-bold">{ipfsData.property.bathrooms}</span>
                            </div>
                          )}
                          {ipfsData.property.yearBuilt && (
                            <div>
                              <span className="text-gray-600 block mb-1">Year Built</span>
                              <span className="font-bold">{ipfsData.property.yearBuilt}</span>
                            </div>
                          )}
                          {ipfsData.property.estValue && (
                            <div>
                              <span className="text-gray-600 block mb-1">Estimated Value</span>
                              <span className="font-bold text-green-600 text-lg">${ipfsData.property.estValue.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes Section */}
                    {ipfsData.property?.notes && (
                      <div className="p-6 bg-gray-50 border-2 border-black rounded-xl">
                        <h3 className="text-lg font-mono font-bold mb-4 border-b-2 border-black pb-2">Notes</h3>
                        <p className="text-sm font-mono text-gray-700 whitespace-pre-wrap">{ipfsData.property.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Property Photos */}
                  {(ipfsData.files?.photos || ipfsData.documents?.photos) && (ipfsData.files?.photos || ipfsData.documents?.photos).length > 0 && (
                    <div className="p-6 bg-white border-2 border-black rounded-xl">
                      <h3 className="text-xl font-mono font-bold mb-4">Property Photos ({(ipfsData.files?.photos || ipfsData.documents?.photos).length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(ipfsData.files?.photos || ipfsData.documents?.photos).map((hash: string, idx: number) => {
                          const cleanHash = hash.replace('ipfs://', '')
                          const imageUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`
                          return (
                            <div 
                              key={`photo-${cleanHash}-${idx}`}
                              className="relative border-2 border-black rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform select-none"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleImageClick(imageUrl)
                              }}
                            >
                              <img 
                                src={imageUrl}
                                alt={`Property photo ${idx + 1}`}
                                className="w-full h-40 object-cover select-none"
                                loading="lazy"
                                draggable={false}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-mono p-2 text-center">
                                Photo {idx + 1}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {(ipfsData.files?.documents || ipfsData.documents?.files) && (ipfsData.files?.documents || ipfsData.documents?.files).length > 0 && (
                    <div className="p-6 bg-white border-2 border-black rounded-xl">
                      <h3 className="text-xl font-mono font-bold mb-4">Documents ({(ipfsData.files?.documents || ipfsData.documents?.files).length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(ipfsData.files?.documents || ipfsData.documents?.files).map((hash: string, idx: number) => {
                          const cleanHash = hash.replace('ipfs://', '')
                          const docUrl = `https://gateway.pinata.cloud/ipfs/${cleanHash}`
                          return (
                            <a 
                              key={`doc-${cleanHash}-${idx}`}
                              href={docUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-4 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">📄</div>
                                <div>
                                  <p className="font-mono font-bold text-sm">Document {idx + 1}</p>
                                  <p className="text-xs text-gray-500 font-mono truncate max-w-[200px]">{cleanHash}</p>
                                </div>
                              </div>
                              <div className="text-black group-hover:text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Verification Status */}
                  <div className="p-6 bg-white border-2 border-black rounded-xl">
                    <h3 className="text-xl font-mono font-bold mb-4">Verification Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 font-mono">Owner:</span>
                        <p className="text-xs font-mono break-all">{req.owner}</p>
                      </div>
                      {req.valuation > BigInt(0) && (
                        <div>
                          <span className="text-sm text-gray-600 font-mono">Blockchain Valuation:</span>
                          <p className="text-xl font-mono font-bold text-green-600">${(Number(req.valuation) / 1e18).toFixed(2)}</p>
                        </div>
                      )}
                      {req.confidence > BigInt(0) && (
                        <div>
                          <span className="text-sm text-gray-600 font-mono">Confidence Score:</span>
                          <p className="text-xl font-mono font-bold">{req.confidence.toString()}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 font-mono">
                  No IPFS data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-fadeIn"
          onClick={handleCloseLightbox}
        >
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 font-bold text-4xl z-10"
            aria-label="Close image"
          >
            ×
          </button>
          <img 
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </>
  )
}
