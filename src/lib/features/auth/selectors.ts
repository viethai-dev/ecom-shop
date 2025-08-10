import { RootState } from '@/lib/store'

export const selectAuthState = (state: RootState) => state.auth
export const selectAuthUser = (state: RootState) => state.auth.user
export const selectAuthToken = (state: RootState) => state.auth.token
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
export const selectAuthHydrated = (state: RootState) => state.auth.hydrated
export const selectVerifyStatus = (state: RootState) => state.auth.verification.status
export const selectVerifyMessage = (state: RootState) => state.auth.verification.message
export const selectVerifyLastToken = (state: RootState) => state.auth.verification.lastToken


