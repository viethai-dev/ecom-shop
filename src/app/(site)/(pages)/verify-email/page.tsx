'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { verifyEmail } from '@/api/user'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/lib/store'
import { selectVerifyMessage, selectVerifyStatus, selectVerifyLastToken } from '@/lib/features/auth/selectors'
import { verifyEmailFailure, verifyEmailStart, verifyEmailSuccess } from '@/lib/features/auth/authSlice'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token') || ''
    const dispatch = useDispatch()
    const status = useAppSelector(selectVerifyStatus)
    const message = useAppSelector(selectVerifyMessage) || ''
    const lastToken = useAppSelector(selectVerifyLastToken)

    const calledRef = useRef(false)

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null
        const run = async () => {
            if (!token) {
                dispatch(verifyEmailFailure('Missing verify token.'))
                return
            }
            // Guard against double-invoke in React StrictMode/dev and repeated tokens
            if (calledRef.current) return
            if (lastToken === token) return
            try {
                calledRef.current = true
                dispatch(verifyEmailStart({ token }))
                const res: any = await verifyEmail(token)
                if (res?.status) {
                    dispatch(verifyEmailSuccess({ message: res?.message }))
                    timeout = setTimeout(() => router.replace('/signin'), 2000)
                }
            } catch (err: any) {
                dispatch(verifyEmailFailure(err?.message || 'Email verification failed.'))
            }
        }
        run()
        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [token, router, dispatch, lastToken])

    return (
        <section className="overflow-hidden pt-40 mt-25 pb-20 bg-gray-2 min-h-screen">
            <div className="relative z-[1] max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11 text-center">
                    <h1 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                        Verify Email
                    </h1>
                    <p className="text-custom-sm text-dark-4">
                        We are verifying your email. This only takes a moment.
                    </p>

                    {status === 'loading' && (
                        <div className="mt-8 flex items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue border-t-transparent"></div>
                        </div>
                    )}

                    {status === 'succeeded' && (
                        <div className="mt-8 rounded-lg border border-green-light-3 bg-green-light-6 px-4 py-3 text-custom-sm text-green">
                            {message}
                            <div className="mt-2">Redirecting to login...</div>
                        </div>
                    )}

                    {status === 'failed' && (
                        <div className="mt-8 rounded-lg border border-red-light-3 bg-red-light-6 px-4 py-3 text-custom-sm text-red">
                            {message}
                            <div className="mt-2">
                                <Link href="/signin" className="font-medium text-blue hover:text-blue-dark">
                                    Go to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}


