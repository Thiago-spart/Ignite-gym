import { Pressable, Text } from "native-base";
import type { GroupProps } from "./types";

export const Group: React.FC<GroupProps> = ({ name, isActive, ...rest }) => {
	return (
		<Pressable
			mr={3}
			w={24}
			h={10}
			bg="gray.600"
			rounded="md"
			justifyContent="center"
			alignItems="center"
			overflow="hidden"
			_pressed={{
				borderColor: "green.500",
				borderWidth: 1,
			}}
			isPressed={isActive}
			{...rest}
		>
			<Text
				color={isActive ? "green.500" : "gray.200"}
				textTransform="uppercase"
				fontSize="xs"
				fontWeight="bold"
			>
				{name}
			</Text>
		</Pressable>
	);
};
