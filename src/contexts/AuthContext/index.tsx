import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import {
	storageAuthTokenGet,
	storageAuthTokenRemove,
	storageAuthTokenSave,
} from "@storage/storageAuthToken";
import {
	storageUserGet,
	storageUserRemove,
	storageUserSave,
} from "@storage/storageUser";
import React from "react";
import { AuthContextDataProps, AuthContextProviderProps } from "./types";

export const AuthContext = React.createContext<AuthContextDataProps>(
	{} as AuthContextDataProps
);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
		React.useState(true);
	const [user, setUser] = React.useState<UserDTO>({} as UserDTO);

	const userAndTokenUpdate = async (userData: UserDTO, token: string) => {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		setUser(userData);
	};

	const storageUserAndTokenSave = async (
		userData: UserDTO,
		token: string,
		refresh_token: string
	) => {
		try {
			setIsLoadingUserStorageData(true);

			await storageUserSave(userData);
			await storageAuthTokenSave({ token, refresh_token });
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorageData(false);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const { data } = await api.post("/sessions", { email, password });

			if (data.user && data.token && data.refresh_token) {
				await storageUserAndTokenSave(
					data.user,
					data.token,
					data.refresh_token
				);

				userAndTokenUpdate(data.user, data.token);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorageData(false);
		}
	};

	const signOut = async () => {
		try {
			setIsLoadingUserStorageData(true);

			setUser({} as UserDTO);
			await storageUserRemove();
			await storageAuthTokenRemove();
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorageData(false);
		}
	};

	const updateUserProfile = async (userUpdated: UserDTO) => {
		try {
			setUser(userUpdated);

			await storageUserSave(userUpdated);
		} catch (error) {
			throw error;
		}
	};

	const loadUserData = async () => {
		try {
			setIsLoadingUserStorageData(true);

			const userLogged = await storageUserGet();

			const { token } = await storageAuthTokenGet();

			if (token && userLogged) {
				userAndTokenUpdate(userLogged, token);
			}
		} catch (error) {
			throw error;
		} finally {
			setIsLoadingUserStorageData(false);
		}
	};

	React.useEffect(() => {
		loadUserData();
	}, []);

	React.useEffect(() => {
		const subscribe = api.registerInterceptTokenManager(signOut);

		return () => {
			subscribe;
		};
	}, [signOut]);

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signOut,
				isLoadingUserStorageData,
				updateUserProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
