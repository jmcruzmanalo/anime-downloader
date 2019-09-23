import { NyaaItem } from './dto/nyaa-response-item';

export interface Subscription {
  id?: number;
  animeName: string;
  nyaaResponse: NyaaItem[];
}