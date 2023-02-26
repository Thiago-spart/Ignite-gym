import { FormControl, Input as NativeBaseInput } from "native-base";
import { InputProps } from "./types";

export const Input: React.FC<InputProps> = ({
	errorMessage = null,
	isInvalid,
	...rest
}) => {
	const isInputInvalid = !!errorMessage || isInvalid;

	return (
		<FormControl isInvalid={isInputInvalid} mb={4}>
			<NativeBaseInput
				bg="gray.700"
				h={14}
				px={4}
				borderWidth={0}
				isInvalid={isInputInvalid}
				fontSize="md"
				color="white"
				fontFamily="body"
				placeholderTextColor="gray.300"
				_invalid={{
					borderWidth: 1,
					borderColor: "red.500",
				}}
				_focus={{
					bg: "gray.700",
					borderWidth: 1,
					borderColor: "green.500",
				}}
				{...rest}
			/>

			<FormControl.ErrorMessage _text={{ color: "red.500" }}>
				{errorMessage}
			</FormControl.ErrorMessage>
		</FormControl>
	);
};
