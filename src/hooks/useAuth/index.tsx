import { AuthContext } from "@contexts/AuthContext";
import React from "react";

export const useAuth = () => {
	const context = React.useContext(AuthContext);

	return context;
};
