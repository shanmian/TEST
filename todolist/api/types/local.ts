export interface LocalData {
  id: number;
  name: string;
  description: string;
}

export interface LocalResponse {
  code: number;
  message: string;
  data: LocalData[];
}