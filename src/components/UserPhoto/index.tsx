import { Image } from "native-base";
import { UserPhotoProps } from "./types";

export const UserPhoto: React.FC<UserPhotoProps> = ({ size, ...rest }) => {
	return (
		<Image
			w={size}
			h={size}
			rounded="full"
			borderWidth={2}
			borderColor="gray.400"
			{...rest}
		/>
	);
};
