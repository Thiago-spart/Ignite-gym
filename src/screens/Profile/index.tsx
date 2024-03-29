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
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
	name: yup.string().min(3, "O nome deve possuir mais de 3 caracteres"),
	password: yup
		.string()
		.min(6, "A senha deve ter pelo menos 6 dígitos")
		.nullable()
		.transform((value) => (!!value ? value : null)),
	confirm_password: yup
		.string()
		.nullable()
		.transform((value) => (!!value ? value : null))
		.oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
		.when("password", {
			is: (Field: any) => Field,
			then: (schema) =>
				schema
					.nullable()
					.required("Informe a confirmação da senha.")
					.transform((value) => (!!value ? value : null)),
		}),
});

export const Profile = () => {
	const [isUpdating, setIsUpdating] = React.useState(false);
	const [isPhotoLoading, setIsPhotoLoading] = React.useState(false);

	const { user, updateUserProfile } = useAuth();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormDataProps>({
		resolver: yupResolver(profileSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
		},
	});

	const toast = useToast();

	const handleSelectUserPhoto = async () => {
		setIsPhotoLoading(true);

		try {
			const photoSelected = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				aspect: [4, 4],
				allowsEditing: true,
			});

			if (photoSelected.canceled) {
				return;
			}

			if (photoSelected.assets[0].uri) {
				const photoInfo = await FileSystem.getInfoAsync(
					photoSelected.assets[0].uri
				);

				if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
					return toast.show({
						title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
						placement: "top",
						bgColor: "red.500",
					});
				}

				const fileExtension = photoSelected.assets[0].uri.split(".").pop();

				const photoFile = {
					name: `${user.name}.${fileExtension}`.toLowerCase(),
					uri: photoSelected.assets[0].uri,
					type: `${photoSelected.assets[0].type}/${fileExtension}`,
				} as any;

				const userPhotoUploadForm = new FormData();

				userPhotoUploadForm.append("avatar", photoFile);

				const avatarUpdtedResponse = await api.patch(
					"/users/avatar",
					userPhotoUploadForm,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				const userUpdated = user;

				userUpdated.avatar = avatarUpdtedResponse.data.avatar;

				await updateUserProfile(userUpdated);

				toast.show({
					title: "Foto atualizada!",
					placement: "top",
					bgColor: "green.500",
				});
			}
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Error ao fazer upload da foto",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsPhotoLoading(false);
		}
	};

	const handleUpdateProfile = async (data: ProfileFormDataProps) => {
		try {
			setIsUpdating(true);

			const userUpdated = user;

			userUpdated.name = data.name;

			await api.put("/users", data);

			await updateUserProfile(userUpdated);

			toast.show({
				title: "Perfil atualizado com sucesso!",
				placement: "top",
				bgColor: "green.500",
			});
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível atualizar os dados. Tente novamente mais tarde.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsUpdating(false);
		}
	};

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
							source={
								user.avatar
									? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
									: defaultUserPhotoImg
							}
							size={PHOTO_SIZE}
							alt={`Imagem do ${user.name}`}
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

					<Controller
						control={control}
						name="email"
						render={({ field: { value } }) => (
							<Input
								bg="gray.600"
								placeholder="E-mail"
								isDisabled
								value={value}
							/>
						)}
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
								bg="gray.600"
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nova senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.password?.message}
								bg="gray.600"
							/>
						)}
					/>

					<Controller
						control={control}
						name="confirm_password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Confirme a nova senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.password?.message}
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
						isLoading={isUpdating}
					/>
				</Center>
			</ScrollView>
		</VStack>
	);
};
