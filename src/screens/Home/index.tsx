import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRouterProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";
import React from "react";

export const Home = () => {
	const [groups, setGroups] = React.useState<Array<string>>([]);
	const [exercises, setExercises] = React.useState<Array<ExerciseDTO>>([]);
	const [groupSelected, setGroupSelected] = React.useState("costa");

	const toast = useToast();

	const navigation = useNavigation<AppNavigatorRouterProps>();

	const handleOpenExerciseDetails = () => {
		navigation.navigate("exercise");
	};

	const fetchGroups = async () => {
		try {
			const res = await api.get("/groups");

			setGroups(res.data);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível carregar os grupos musculares.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500",
			});
		}
	};

	const fetchExercisesByGroup = async () => {
		try {
			const res = await api.get(`/exercises/bygroup/${groupSelected}`);

			setExercises(res.data);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível carregar os exercícios.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500",
			});
		}
	};

	React.useEffect(() => {
		fetchGroups();
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			fetchExercisesByGroup();
		}, [groupSelected])
	);

	return (
		<VStack flex={1}>
			<HomeHeader />

			<FlatList
				data={groups}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<Group
						name={item}
						isActive={groupSelected.toUpperCase() === item.toUpperCase()}
						onPress={() => setGroupSelected(item)}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				_contentContainerStyle={{ px: 8 }}
				my={10}
				maxH={10}
				minH={10}
			/>

			<VStack flex={1} px={8}>
				<HStack justifyContent="space-between" mb={5}>
					<Heading color="gray.200" fontSize="md" fontFamily="heading">
						Exercícios
					</Heading>

					<Text color="gray.200" fontSize="sm">
						{exercises.length}
					</Text>
				</HStack>

				<FlatList
					data={exercises}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<ExerciseCard onPress={handleOpenExerciseDetails} />
					)}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ paddingBottom: 20 }}
				/>
			</VStack>
		</VStack>
	);
};
