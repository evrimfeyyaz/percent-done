import { combineReducers, Reducer } from 'redux';
import {
  ADD_TIMETABLE_ENTRY,
  DELETE_TIMETABLE_ENTRY,
  EDIT_TIMETABLE_ENTRY,
  TimetableEntriesState,
  TimetableEntry,
  TimetableEntryActionTypes,
} from './types';
import { NormalizedEntityById } from '../types';
import _ from 'lodash';
import { convertDateToIndex } from '../../utilities';

const byId: Reducer<NormalizedEntityById<TimetableEntry>, TimetableEntryActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
    case EDIT_TIMETABLE_ENTRY:
      const timetableEntry = action.timetableEntry;
      return { ...state, [timetableEntry.id]: timetableEntry };
    case DELETE_TIMETABLE_ENTRY:
      return _.omit(state, action.timetableEntry.id);
    default:
      return state;
  }
};

const allIds: Reducer<string[], TimetableEntryActionTypes> = (state = [], action) => {
  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      return _.uniq([...state, action.timetableEntry.id]);
    case DELETE_TIMETABLE_ENTRY:
      return _.without(state, action.timetableEntry.id);
    default:
      return state;
  }
};

const idsByDate: Reducer<{ [date: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  let entry: TimetableEntry, dateIdx: string, ids: string[];

  switch (action.type) {
    case EDIT_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx] || [];

      let previousDateIdx = dateIdx;
      if (ids.indexOf(entry.id) === -1) {
        const stateKeys = Object.keys(state);

        for (const index of stateKeys) {
          if (state[index].indexOf(entry.id) !== -1) {
            previousDateIdx = index;
          }
        }
      }

      if (previousDateIdx !== dateIdx) {
        const previousDateIds = _.without(state[previousDateIdx], entry.id);

        return {
          ...state,
          [dateIdx]: [...ids, entry.id],
          [previousDateIdx]: previousDateIds,
        };
      }

      return { ...state, [dateIdx]: [...ids] };
    case ADD_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      dateIdx = convertDateToIndex(new Date(entry.startTimestamp));
      ids = state[dateIdx] || [];

      return { ...state, [dateIdx]: [...ids, entry.id] };
    case DELETE_TIMETABLE_ENTRY:
      const entryId = action.timetableEntry.id;
      const entryStartTimestamp = action.timetableEntry.startTimestamp;
      dateIdx = convertDateToIndex(new Date(entryStartTimestamp));
      ids = _.without(state[dateIdx], entryId);

      return { ...state, [dateIdx]: ids };
    default:
      return state;
  }
};

const idsByProjectId: Reducer<{ [projectId: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  let entry: TimetableEntry, projectId: (string | undefined), entryIds: string[];

  switch (action.type) {
    case EDIT_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      const entryPreviousState = action.oldTimetableEntry;
      projectId = entry.projectId;
      const previousProjectId = entryPreviousState.projectId;

      if (projectId == null && previousProjectId == null) {
        return state;
      } else if (projectId == null && previousProjectId != null) {
        const entryIds = state[previousProjectId] || [];

        return { ...state, [previousProjectId]: _.without(entryIds, entry.id) };
      } else if (projectId != null && previousProjectId == null) {
        const entryIds = state[projectId] || [];

        return { ...state, [projectId]: [...entryIds, entry.id] };
      } else if (previousProjectId != null && projectId != null) {
        const entryIdsForPreviousProject = state[previousProjectId] || [];
        const entryIdsForNewProject = state[projectId] || [];

        return {
          ...state,
          [previousProjectId]: _.without(entryIdsForPreviousProject, entry.id),
          [projectId]: _.uniq([...entryIdsForNewProject, entry.id]),
        };
      }

      return state;
    case ADD_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      projectId = entry.projectId;

      if (projectId == null) return state;

      entryIds = state[projectId] || [];

      return { ...state, [projectId]: [...entryIds, entry.id] };
    case DELETE_TIMETABLE_ENTRY:
      entry = action.timetableEntry;
      projectId = entry.projectId;

      if (projectId == null) return state;

      entryIds = state[projectId] || [];

      return { ...state, [projectId]: _.without(entryIds, entry.id) };
    default:
      return state;
  }
};

const idsByGoalId: Reducer<{ [goalId: string]: string[] }, TimetableEntryActionTypes> = (state = {}, action) => {
  let goalId: string, id: string, entryIdsForGoal: string[];

  switch (action.type) {
    case ADD_TIMETABLE_ENTRY:
      goalId = action.timetableEntry.goalId;
      id = action.timetableEntry.id;
      entryIdsForGoal = state[goalId];

      return { ...state, [goalId]: [...entryIdsForGoal, id] };
    case EDIT_TIMETABLE_ENTRY:
      goalId = action.timetableEntry.goalId;
      id = action.timetableEntry.id;
      entryIdsForGoal = state[goalId];

      const oldGoalId = action.oldTimetableEntry.goalId;
      const entryIdsForOldGoal = state[oldGoalId];

      return {
        ...state,
        [oldGoalId]: _.without(entryIdsForOldGoal, id),
        [goalId]: _.uniq([...entryIdsForGoal, id]),
      };
    case DELETE_TIMETABLE_ENTRY:
      goalId = action.timetableEntry.goalId;
      id = action.timetableEntry.id;
      entryIdsForGoal = state[goalId];

      return { ...state, [goalId]: _.without(entryIdsForGoal, id) };
    default:
      return state;
  }
};

export const timetableEntriesReducer: Reducer<TimetableEntriesState> = combineReducers({
  byId,
  allIds,
  idsByDate,
  idsByProjectId,
  idsByGoalId,
});
