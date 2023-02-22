import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { FlatList, VStack } from "native-base";
import React from "react";

export const Home = () => {
	const [groups, setGroups] = React.useState(["costa", "ombro"]);
	const [groupSelected, setGroupSelected] = React.useState("costa");

	return (
		<VStack flex={1}>
			<HomeHeader />

			<FlatList
				data={groups}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<Group
						name={item}
						isActive={groupSelected === item}
						onPress={() => setGroupSelected(item)}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				_contentContainerStyle={{ px: 8 }}
				my={10}
				maxH={10}
			/>
		</VStack>
	);
};
