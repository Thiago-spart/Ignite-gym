import { HistoryDTO } from "./HistoryDTO";

export interface HistoryByDayDTO {
	title: string;
	data: Array<HistoryDTO>;
}