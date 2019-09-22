import { Goal } from './goals/types';
import { TimetableEntriesState, TimetableEntry } from './timetableEntries/types';

export interface NormalizedEntityById<T> {
  [id: string]: T,
}

export interface NormalizedEntityState<T> {
  byId: NormalizedEntityById<T>;
  allIds: string[];
}

export interface StoreState {
  goals: NormalizedEntityState<Goal>;
  timetableEntries: TimetableEntriesState;
}
