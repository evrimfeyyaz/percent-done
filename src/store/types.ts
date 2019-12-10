import { GoalsState } from './goals/types';
import { TimetableEntriesState } from './timetableEntries/types';
import { ProjectsState } from './projects/types';

export interface NormalizedEntityById<T> {
  [id: string]: T,
}

export interface NormalizedEntityState<T> {
  byId: NormalizedEntityById<T>;
  allIds: string[];
}

export interface StoreState {
  goals: GoalsState;
  timetableEntries: TimetableEntriesState;
  projects: ProjectsState;
}
