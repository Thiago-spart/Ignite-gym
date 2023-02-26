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
	useToast,
	VStack,
} from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import { ProfileFormDataProps } from "./types";

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
	name: yup.string().length(3, "O nome deve possuir mais de 3 caracteres"),
	old_password: yup
		.string()
		.required("Informe a senha")
		.min(6, "A senha deve ter pelo menos 6 dígitos"),
	new_password: yup
		.string()
		.required("Informe a senha")
		.min(6, "A senha deve ter pelo menos 6 dígitos"),
	new_password_confirmation: yup
		.string()
		.required("Confirme a senha.")
		.oneOf([yup.ref("password")], "A confirmação da senha não confere."),
});

export const Profile = () => {
	const [isPhotoLoading, setIsPhotoLoading] = React.useState(false);
	const [userPhoto, setUserPhoto] = React.useState(
		"https://github.com/Thiago-spart.png"
	);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormDataProps>({
		resolver: yupResolver(profileSchema),
	});

	const toast = useToast();

	const handleSelectUserPhoto = async () => {
		setIsPhotoLoading(true);

		try {
			const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				aspect: [4, 4],
				allowsEditing: true,
			});

			if (selectedPhoto.canceled) return;

			const photoInfo = await FileSystem.getInfoAsync(
				selectedPhoto.assets[0].uri
			);

			if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
				return toast.show({
					title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
					placement: "top",
					bgColor: "red.500",
				});
			}

			setUserPhoto(String(selectedPhoto.assets[0].uri));
		} catch (error) {
			console.log(error);
		} finally {
			setIsPhotoLoading(false);
		}
	};

	const handleUpdateProfile = (data: ProfileFormDataProps) => {};

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
							source={{ uri: userPhoto }}
							size={PHOTO_SIZE}
							alt="Imagem do usuário"
						/>
					)}

					<TouchableOpacity onPress={handleSelectUserPhoto}>
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

					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nome"
								bg="gray.600"
								onChangeText={onChange}
								value={value}
								errorMessage={errors.name?.message}
							/>
						)}
					/>

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
						fontFamily="heading"
					>
						Alterar senha
					</Heading>

					<Controller
						control={control}
						name="old_password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Senha antiga"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.old_password?.message}
								bg="gray.600"
							/>
						)}
					/>

					<Controller
						control={control}
						name="new_password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nova senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.new_password?.message}
								bg="gray.600"
							/>
						)}
					/>

					<Controller
						control={control}
						name="new_password_confirmation"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Confirme a nova senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.new_password?.message}
								onSubmitEditing={handleSubmit(handleUpdateProfile)}
								returnKeyType="send"
								bg="gray.600"
							/>
						)}
					/>

					<Button
						title="Atualizar"
						mt={4}
						onPress={handleSubmit(handleUpdateProfile)}
					/>
				</Center>
			</ScrollView>
		</VStack>
	);
};
