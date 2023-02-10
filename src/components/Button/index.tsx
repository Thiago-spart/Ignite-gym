import { Button as NativeBaseButton, Text } from "native-base"
import { ButtonProps } from "./types"


export const Button: React.FC<ButtonProps> = ({ title, variant = "solid", ...rest }) => {
	return (
		<NativeBaseButton
			w="full"
			h={14}
			bg={variant === "outline" ? "transparent" : "green.700"}
			borderWidth={variant === "outline" ? 1 : 0}
			borderColor="green.500"
			rounded="sm"
			_pressed={{
				bg: variant === "outline" ? "gray.500" : "green.500"
			}}
			{...rest}
		>
			<Text
				color={variant === "outline" ? "green.500" : "white"}
				fontFamily="heading"
				fontSize="sm"
			>
				{title}
			</Text>
		</NativeBaseButton>
	)
}