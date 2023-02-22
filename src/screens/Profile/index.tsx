import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
	Center,
	Heading,
	ScrollView,
	Skeleton,
	Text,
	VStack,
} from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;

export const Profile = () => {
	const [isPhotoLoading, setIsPhotoLoading] = React.useState(false);

	return (
		<VStack flex={1}>
			<ScreenHeader title="Perfil" />

			<ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
				<Center mt={16} px={10}>
					{isPhotoLoading ? (
						<Skeleton
							w={PHOTO_SIZE}
							h={PHOTO_SIZE}
							rounded="full"
							startColor="gray.500"
							endColor="gray.400"
						/>
					) : (
						<UserPhoto
							source={{ uri: "https://github.com/Thiago-spart.png" }}
							size={PHOTO_SIZE}
							alt="Imagem do usuário"
						/>
					)}

					<TouchableOpacity>
						<Text
							color="green.500"
							fontWeight="bold"
							fontSize="md"
							mt={2}
							mb={8}
						>
							{" "}
							Alterar foto
						</Text>
					</TouchableOpacity>

					<Input bg="gray.600" placeholder="Nome" />

					<Input
						bg="gray.600"
						placeholder="E-mail"
						value="user000.000resu@gmail.com"
						isDisabled
					/>
				</Center>

				<Center px={10} mt={12} mb={9}>
					<Heading
						color="gray.200"
						fontSize="md"
						mb={2}
						alignSelf="flex-start"
						mt={12}
					>
						Alterar senha
					</Heading>

					<Input bg="gray.600" placeholder="Senha antiga" secureTextEntry />

					<Input bg="gray.600" placeholder="Nova senha" secureTextEntry />

					<Input
						bg="gray.600"
						placeholder="Confirme a nova senha"
						secureTextEntry
					/>

					<Button title="Atualizar" mt={4} />
				</Center>
			</ScrollView>
		</VStack>
	);
};
