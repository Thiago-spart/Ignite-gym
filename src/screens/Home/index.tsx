import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRouterProps } from "@routes/app.routes";
import { FlatList, Heading, HStack, Text, VStack } from "native-base";
import React from "react";

export const Home = () => {
	const [groups, setGroups] = React.useState(["costa", "ombro"]);
	const [exercises, getExercises] = React.useState(["1", "2", "3"]);
	const [groupSelected, setGroupSelected] = React.useState("costa");

	const navigation = useNavigation<AppNavigatorRouterProps>();

	const handleOpenExerciseDetails = () => {
		navigation.navigate("exercise");
	};

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
					keyExtractor={(item) => item}
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
