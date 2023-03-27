import { UserDTO } from "@dtos/UserDTO";
import React from "react";

export interface AuthContextDataProps {
	user: UserDTO;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>
	updateUserProfile: (userUpdated: UserDTO) => Promise<void>
	isLoadingUserStorageData: boolean;
}

export interface AuthContextProviderProps extends React.PropsWithChildren {

}
