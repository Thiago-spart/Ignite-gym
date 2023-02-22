import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Center, Heading, SectionList, Text, VStack } from "native-base";
import React from "react";

export const History = () => {
	const [exercises, setExercises] = React.useState([
		{
			title: "data",
			data: ["teste 1", "teste 2", "teste 3"],
		},
		{
			title: "data",
			data: ["teste 1", "teste 2", "teste 3"],
		},
		{
			title: "data",
			data: ["teste 1", "teste 2", "teste 3"],
		},
	]);

	return (
		<VStack flex={1}>
			<ScreenHeader title="Histórico de Exercício" />

			<SectionList
				sections={exercises}
				keyExtractor={(item) => item}
				renderItem={({ item }) => <HistoryCard />}
				renderSectionHeader={({ section }) => (
					<Heading color="gray.200" fontSize="md" mt={10} mb={3}>
						{section.title}
					</Heading>
				)}
				px={8}
				contentContainerStyle={
					exercises.length === 0 && { flex: 1, justifyContent: "center" }
				}
				ListEmptyComponent={() => (
					<Text color="gray.100" textAlign="center">
						Não há exercícios registrados ainda. {"\n"}
						Vamos fazer exercícios hoje?
					</Text>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</VStack>
	);
};
