import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export const Routes = () => {
	const nativeBaseTheme = useTheme();

	const theme = DefaultTheme;
	theme.colors.background = nativeBaseTheme.colors.gray[700];

	return (
		<Box flex={1} bg="gray.700">
			<NavigationContainer theme={theme}>
				<AppRoutes />
				{/* <AuthRoutes /> */}
			</NavigationContainer>
		</Box>
	);
};
