import {
	Center,
	Heading,
	Image,
	ScrollView,
	Text,
	useToast,
	VStack,
} from "native-base";

import BackgroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SignUpFormDataProps } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { api } from "@services/api";
import axios from "axios";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

const singUpSchema = yup.object({
	name: yup.string().required("Informe o nome"),
	email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
	password: yup
		.string()
		.required("Informe a senha")
		.min(6, "A senha deve ter pelo menos 6 dígitos"),
	password_confirmation: yup
		.string()
		.required("Confirme a senha.")
		.oneOf([yup.ref("password")], "A confirmação da senha não confere."),
});

export const SignUp = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	const navigation = useNavigation();
	const toast = useToast();

	const { signIn } = useAuth();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormDataProps>({
		resolver: yupResolver(singUpSchema),
	});

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleSignUp = async ({
		name,
		email,
		password,
	}: SignUpFormDataProps) => {
		try {
			setIsLoading(true);

			await api.post("/users", { name, email, password });

			await signIn(email, password);

			toast.show({
				title: "Cadastrado com sucesso",
				placement: "top",
			});

			return navigation.goBack();
		} catch (error) {
			setIsLoading(true);

			const isAppError = error instanceof AppError;

			const errorMessage = isAppError
				? error.message
				: "Não foi possível criar a conta. Tente mais tarde";

			return toast.show({
				title: errorMessage,
				bg: "red.500",
				placement: "top",
			});
		}
	};

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
		>
			<VStack flex={1} px={10} pb={16}>
				<Image
					source={BackgroundImg}
					defaultSource={BackgroundImg}
					alt="Pessoas treinando"
					resizeMode="contain"
					position="absolute"
				/>

				<Center my={24}>
					<LogoSvg />

					<Text color="gray.100" fontSize="sm">
						Treine sua mente e o seu corpo
					</Text>
				</Center>

				<Center>
					<Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
						Crie sua conta
					</Heading>

					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nome"
								onChangeText={onChange}
								value={value}
								errorMessage={errors.name?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="E-mail"
								keyboardType="email-address"
								autoCapitalize="none"
								value={value}
								onChangeText={onChange}
								errorMessage={errors.email?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								errorMessage={errors.password?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password_confirmation"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Confirmar Senha"
								onChangeText={onChange}
								secureTextEntry
								value={value}
								onSubmitEditing={handleSubmit(handleSignUp)}
								returnKeyType="send"
								errorMessage={errors.password_confirmation?.message}
							/>
						)}
					/>

					<Button
						title="Criar conta"
						onPress={handleSubmit(handleSignUp)}
						isLoading={isLoading}
					/>
				</Center>

				<Button
					title="Voltar para o login"
					variant="outline"
					mt={12}
					onPress={handleGoBack}
				/>
			</VStack>
		</ScrollView>
	);
};
