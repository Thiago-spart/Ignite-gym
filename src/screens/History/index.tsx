import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Heading, SectionList, Text, useToast, VStack } from "native-base";
import React from "react";

export const History = () => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [exercises, setExercises] = React.useState<Array<HistoryByDayDTO>>([]);

	const toast = useToast();

	const fetchHistory = async () => {
		try {
			setIsLoading(true);
			const res = await api.get("/history");

			setExercises(res.data);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível carregar o histórico.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchHistory();
		}, [])
	);

	return (
		<VStack flex={1}>
			<ScreenHeader title="Histórico de Exercício" />

			{isLoading ? (
				<Loading />
			) : (
				<SectionList
					sections={exercises}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <HistoryCard data={item} />}
					renderSectionHeader={({ section }) => (
						<Heading
							color="gray.200"
							fontSize="md"
							mt={10}
							mb={3}
							fontFamily="heading"
						>
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
			)}
		</VStack>
	);
};
