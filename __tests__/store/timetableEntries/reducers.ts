import { timetableEntriesReducer } from '../../../src/store/timetableEntries/reducers';
import { AddTimetableEntryAction, TimetableEntriesState } from '../../../src/store/timetableEntries/types';
import { createTimetableEntry } from '../../../src/factories';
import { convertDateToIndex, momentWithDeviceLocale } from '../../../src/utilities';
import { deleteTimetableEntry, editTimetableEntry } from '../../../src/store/timetableEntries/actions';

describe('timetable entries reducer', () => {
  const initialState: TimetableEntriesState = {
    byId: {},
    allIds: [],
    idsByDate: {},
    idsByProjectId: {},
    idsByGoalId: {},
  };

  const startDate = new Date();
  const dateIdx = convertDateToIndex(startDate);
  const projectId = 'SOME_PROJECT_ID';
  const timetableEntry = createTimetableEntry({
    startDate,
    startHour: 10,
    durationInMin: 30,
    projectId,
  });
  const stateWithEntry: TimetableEntriesState = {
    byId: {
      [timetableEntry.id]: timetableEntry,
    },
    idsByDate: {
      [dateIdx]: [timetableEntry.id],
    },
    idsByProjectId: {
      [projectId]: [timetableEntry.id],
    },
    idsByGoalId: {
      [timetableEntry.goalId]: [timetableEntry.id],
    },
    allIds: [timetableEntry.id],
  };

  it('returns the initial state', () => {
    // @ts-ignore
    expect(timetableEntriesReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('handles adding an entry', () => {
    const action: AddTimetableEntryAction = {
      type: 'ADD_TIMETABLE_ENTRY',
      timetableEntry,
    };

    const result = timetableEntriesReducer(initialState, action);

    expect(result.allIds).toEqual([timetableEntry.id]);
    expect(result.byId[timetableEntry.id]).toEqual(timetableEntry);
    expect(result.idsByGoalId[timetableEntry.goalId]).toEqual([timetableEntry.id]);
    expect(result.idsByProjectId[projectId]).toEqual([timetableEntry.id]);
    expect(result.idsByDate[dateIdx]).toEqual([timetableEntry.id]);
  });

  it('handles editing an entry', () => {
    const newStartDate = momentWithDeviceLocale(Date.now()).add(15, 'days').toDate();
    const newDateIdx = convertDateToIndex(newStartDate);
    const newProjectId = 'SOME_NEW_PROJECT_ID';
    const editedTimetableEntry = createTimetableEntry({
      id: timetableEntry.id,
      projectId: newProjectId,
      startDate: newStartDate,
      startHour: 10,
      durationInMin: 60,
    });
    const action = editTimetableEntry(editedTimetableEntry, timetableEntry);

    const result = timetableEntriesReducer(stateWithEntry, action);

    expect(result.allIds).toEqual([timetableEntry.id]);
    expect(result.byId[timetableEntry.id]).toEqual(editedTimetableEntry);
    expect(result.idsByGoalId[timetableEntry.goalId]).toEqual([]);
    expect(result.idsByGoalId[editedTimetableEntry.goalId]).toEqual([timetableEntry.id]);
    expect(result.idsByProjectId[projectId]).toEqual([]);
    expect(result.idsByProjectId[newProjectId]).toEqual([timetableEntry.id]);
    expect(result.idsByDate[dateIdx]).toEqual([]);
    expect(result.idsByDate[newDateIdx]).toEqual([timetableEntry.id]);
  });

  it('handles deleting an entry', () => {
    const action = deleteTimetableEntry(timetableEntry);

    const result = timetableEntriesReducer(stateWithEntry, action);

    expect(result.allIds).toEqual([]);
    expect(result.byId[timetableEntry.id]).toBeUndefined();
    expect(result.idsByGoalId[timetableEntry.goalId]).toEqual([]);
    expect(result.idsByProjectId[projectId]).toEqual([]);
    expect(result.idsByDate[dateIdx]).toEqual([]);
  });
});
