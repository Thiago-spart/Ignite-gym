import AsyncStorage from "@react-native-async-storage/async-storage"
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig"

import { StorageAuthTokenProps } from "./types"

export const storageAuthTokenSave = async ({token, refresh_token}: StorageAuthTokenProps) => {
	await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({token, refresh_token})) 
}

export const storageAuthTokenGet = async () => {
	const res = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

	const { refresh_token, token }: StorageAuthTokenProps = res ? JSON.parse(res) : {}

	return { token, refresh_token };
}

export const storageAuthTokenRemove = async () => {
	await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
