'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { signInWithOtp, verifyOtp } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/'

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await signInWithOtp(phone)

        if (error) {
            setError(error.message)
        } else {
            setStep('otp')
        }
        setLoading(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await verifyOtp(phone, otp)

        if (error) {
            setError(error.message)
        } else {
            router.push(redirectTo)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4 pt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="text-maroon" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-maroon font-serif">
                            {step === 'phone' ? 'Login with Phone' : 'Enter OTP'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {step === 'phone'
                                ? 'We\'ll send you a one-time password'
                                : `OTP sent to +91 ${phone}`}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="9876543210"
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange focus:border-orange outline-none"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || phone.length !== 10}
                                className="w-full py-4 bg-orange text-white font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Send OTP
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    One-Time Password
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange outline-none text-center text-2xl tracking-widest"
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full py-4 bg-orange text-white font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Verify & Login
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep('phone')
                                    setOtp('')
                                    setError('')
                                }}
                                className="w-full text-gray-500 hover:text-maroon transition-colors"
                            >
                                Change phone number
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <Loader2 className="animate-spin text-maroon" size={40} />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
