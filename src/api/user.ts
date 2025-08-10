const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...init,
    })
    if (!res.ok) {
        let message = 'Request failed'
        try {
            const data = await res.json()
            message = (data as any)?.message || (data as any)?.error || (data as any)?.detail || message
        } catch { }
        throw new Error(message)
    }
    try {
        return (await res.json()) as T
    } catch {
        return undefined as unknown as T
    }
}

export type SignInPayload = { email: string; password: string }
export type SignUpPayload = {
    email: string
    password: string
    name: string
    phone: string
    avatar_url: string
}

export const signIn = (data: SignInPayload) =>request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) })

export const signUp = (data: SignUpPayload) =>request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) })

export const signOut = () => request<any>('/auth/logout')

export const verifyEmail = (token: string) => request<any>(`/auth/verify-email?token=${encodeURIComponent(token)}`)

export const userProfile = (token: string ) => request<any>('/auth/me')
