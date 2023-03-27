import { AxiosError, AxiosInstance } from "axios";

type SignOutProps = () => void

export interface APIInstanceProps extends AxiosInstance {
	registerInterceptTokenManager: (signOut: SignOutProps) => () => void
}

export interface PromiseType {
	onSuccess: (token: string) => void;
	onFailure: (error: AxiosError) => void;
}