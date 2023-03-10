import { Heading, HStack, Icon, Image, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { ExerciseCardProps } from "./types";

import { Entypo } from "@expo/vector-icons";

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ ...rest }) => {
	return (
		<TouchableOpacity {...rest}>
			<HStack
				bg="gray.500"
				alignItems="center"
				p={2}
				pr={4}
				rounded="md"
				mb={3}
			>
				<Image
					source={{ uri: "#" }}
					alt="Imagem do exercício"
					w={16}
					h={16}
					mr={4}
					resizeMode="cover"
					rounded="md"
				/>

				<VStack flex={1}>
					<Heading fontSize="lg" color="white" fontFamily="heading">
						Remada unilateral
					</Heading>

					<Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
						3 séries X 12 repetições
					</Text>
				</VStack>

				<Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
			</HStack>
		</TouchableOpacity>
	);
};
