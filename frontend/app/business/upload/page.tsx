"use client"

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'
import { Upload, FileText, Image, File, X } from 'lucide-react'

export default function UploadPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: 'real-estate',
    location: '',
    valuation: '',
    description: '',
    ownership: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    console.log('Files:', files)
    // TODO: Submit to Oracle for AI verification
  }

  return (
    <main className="min-h-screen bg-white text-black overflow-hidden">
      <Navigation variant="business" />
      
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

      {/* Upload Content */}
      <div className="relative z-10 pt-24 px-6 max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="text-6xl font-light tracking-wider mb-4 font-mono">
            ASSET <span className="font-bold">UPLOAD</span>
          </h1>
          <div className="w-64 h-px bg-black mb-8 relative">
            <div className="absolute left-0 top-0 h-full bg-black animate-pulse" style={{ width: "100%" }}></div>
          </div>
          <p className="text-gray-600 font-mono text-sm">
            Submit your real-world assets for AI oracle verification on Mantle Network
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Information Card */}
          <div className="p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black]">
            <h2 className="text-2xl font-mono font-bold mb-6">Asset Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Name */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Office Building"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Asset Type */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="real-estate">Real Estate</option>
                  <option value="art">Art & Collectibles</option>
                  <option value="commodity">Commodity</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, USA"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Estimated Valuation */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  Estimated Valuation (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="valuation"
                  value={formData.valuation}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000000"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Ownership Proof */}
              <div>
                <label className="block text-sm font-mono font-bold mb-2">
                  Ownership Document ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ownership"
                  value={formData.ownership}
                  onChange={handleInputChange}
                  placeholder="e.g., Title Deed #123456"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-mono font-bold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed description of the asset..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-black rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
                required
              />
            </div>
          </div>

          {/* Document Upload Card */}
          <div className="p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black]">
            <h2 className="text-2xl font-mono font-bold mb-6">Upload Documents</h2>
            
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-300 hover:border-black'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4" size={48} strokeWidth={1.5} />
              <p className="font-mono text-lg mb-2">
                Drag & drop files here
              </p>
              <p className="text-gray-500 text-sm font-mono mb-4">
                or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono cursor-pointer"
              >
                Browse Files
              </label>
              <p className="text-xs text-gray-400 font-mono mt-4">
                Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-mono font-bold text-lg">Uploaded Files ({files.length})</h3>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {file.type.includes('image') ? (
                        <Image size={24} />
                      ) : file.type.includes('pdf') ? (
                        <FileText size={24} />
                      ) : (
                        <File size={24} />
                      )}
                      <div>
                        <p className="font-mono font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Document Types Info */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-mono font-bold text-sm mb-2">Required Documents:</h3>
              <ul className="text-sm text-gray-600 font-mono space-y-1">
                <li>• Ownership certificate or title deed</li>
                <li>• Property valuation report (if available)</li>
                <li>• Recent photographs of the asset</li>
                <li>• Any relevant compliance certificates</li>
                <li>• Legal documentation (optional)</li>
              </ul>
            </div>
          </div>

          {/* Submit Section */}
          <div className="p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_black]">
            <h2 className="text-2xl font-mono font-bold mb-4">Oracle Verification</h2>
            <p className="text-gray-600 font-mono text-sm mb-6">
              Your asset will be verified by our hybrid AI oracle system using Claude, GPT-4, and Gemini 
              for multi-layer authentication. The verification process typically takes 24-48 hours.
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono font-bold text-lg shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
              >
                Submit for Verification
              </button>
              <button
                type="button"
                onClick={() => router.push('/business/dashboard')}
                className="px-8 py-4 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
