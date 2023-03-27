import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { TouchableOpacityProps } from "react-native";

export interface ExerciseCardProps extends TouchableOpacityProps {
	data: ExerciseDTO;
}