import { createSlice } from '@reduxjs/toolkit'

export type AuthUser = {
    id?: string
    email: string
    name?: string
    phone?: string
    avatar_url?: string,
    created_at?: string,
}

export type AuthState = {
    user: AuthUser | null
    token: string | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    hydrated: boolean
    verification: {
        status: 'idle' | 'loading' | 'succeeded' | 'failed'
        message: string | null
        lastToken: string | null
    }
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: 'idle',
    error: null,
    hydrated: false,
    verification: { status: 'idle', message: null, lastToken: null },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        hydrateFromStorage(state) {
            if (typeof window === 'undefined') return
            const token = localStorage.getItem('access_token')
            const userStr = localStorage.getItem('user')
            state.token = token
            state.user = userStr ? (JSON.parse(userStr) as AuthUser) : null
            state.hydrated = true
        },
        signInStart(state) {
            state.status = 'loading'
            state.error = null
        },
        signInSuccess(state, action) {
            state.status = 'succeeded'
            state.token = action.payload.token
            state.user = action.payload.user ?? null
            state.hydrated = true
        },
        signInFailure(state, action) {
            state.status = 'failed'
            state.error = action.payload
        },
        signUpStart(state) {
            state.status = 'loading'
            state.error = null
        },
        signUpSuccess(state) {
            state.status = 'succeeded'
        },
        signUpFailure(state, action) {
            state.status = 'failed'
            state.error = action.payload
        },
        signOut(state) {
            state.user = null
            state.token = null
            state.status = 'idle'
            state.error = null
            state.hydrated = true
        },
        getUserProfile(state, action) {

        },
        verifyEmailStart(state, action) {
            state.verification.status = 'loading'
            state.verification.message = null
            state.verification.lastToken = action.payload?.token ?? null
        },
        verifyEmailSuccess(state, action) {
            state.verification.status = 'succeeded'
            state.verification.message = action.payload?.message ?? 'Email verified successfully.'
        },
        verifyEmailFailure(state, action) {
            state.verification.status = 'failed'
            state.verification.message = action.payload || 'Email verification failed.'
        },
    },
    extraReducers: () => { },
})

export const {
    hydrateFromStorage,
    signInStart,
    signInSuccess,
    signInFailure,
    signUpStart,
    signUpSuccess,
    signUpFailure,
    signOut,
    verifyEmailStart,
    verifyEmailSuccess,
    verifyEmailFailure,
} = authSlice.actions
export default authSlice.reducer


