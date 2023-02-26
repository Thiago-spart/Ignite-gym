import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";

import BackgroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRouterProps } from "@routes/auth.routes";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { SignInFormDataProps } from "./types";
import { Controller, useForm } from "react-hook-form";

const singInSchema = yup.object({
	email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
	password: yup
		.string()
		.required("Informe a senha")
		.min(6, "A senha deve ter pelo menos 6 dígitos"),
});

const handleSignIn = (data: SignInFormDataProps) => {};

export const SignIn = () => {
	const navigation = useNavigation<AuthNavigatorRouterProps>();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormDataProps>({
		resolver: yupResolver(singInSchema),
	});

	const handleNewAccount = () => {
		navigation.navigate("signUp");
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
						Acesse sua conta
					</Heading>

					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="E-mail"
								keyboardType="email-address"
								autoCapitalize="none"
								onChangeText={onChange}
								value={value}
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
								onSubmitEditing={handleSubmit(handleSignIn)}
								returnKeyType="send"
							/>
						)}
					/>

					<Button title="Acessar" onPress={handleSubmit(handleSignIn)} />
				</Center>

				<Center mt={24}>
					<Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
						Ainda não tem acesso?
					</Text>

					<Button
						title="Criar conta"
						variant="outline"
						onPress={handleNewAccount}
					/>
				</Center>
			</VStack>
		</ScrollView>
	);
};
