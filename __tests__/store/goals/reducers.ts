import { goalsReducer } from '../../../src/store/goals/reducers';
import {
  addGoal,
  deleteGoal,
  editGoal,
  removeTrackedGoal,
  setTrackedGoal,
  updateTrackedGoalProjectId,
} from '../../../src/store/goals/actions';
import { createGoal } from '../../../src/factories';
import {
  UPDATE_TRACKED_GOAL_START_TIMESTAMP,
  UpdateTrackedGoalStartTimestampAction,
} from '../../../src/store/goals/types';

describe('goals reducer', () => {
  const initialState = {
    byId: {},
    allIds: [],
    trackedGoal: {},
  };

  const stateWithTrackedGoal = {
    ...initialState,
    trackedGoal: {
      id: 'SOME_GOAL_ID',
      startTimestamp: Date.now(),
    },
  };

  it('returns the initial state', () => {
    // @ts-ignore
    const result = goalsReducer(undefined, { type: undefined });

    expect(result).toEqual(initialState);
  });

  it('handles adding a goal', () => {
    const notSavedGoal = createGoal({});
    const action = addGoal(notSavedGoal);
    const { goal } = action;

    const result = goalsReducer(initialState, action);

    expect(result.byId).toEqual({
      [goal.id]: goal,
    });
    expect(result.allIds).toEqual([goal.id]);
  });

  it('handles editing a goal', () => {
    const goal = createGoal({});

    const editedTitle = 'Edited Title';
    const editedGoal = { ...goal, title: editedTitle };

    const action = editGoal(editedGoal);

    const stateWithGoal = {
      ...initialState,
      byId: {
        [goal.id]: goal,
      },
      allIds: [goal.id],
    };

    const result = goalsReducer(stateWithGoal, action);

    expect(result.byId).toEqual({
      [goal.id]: editedGoal,
    });
    expect(result.allIds).toEqual([goal.id]);
  });

  it('handles soft deleting a goal', () => {
    const goal = createGoal({});
    const action = deleteGoal(goal.id);

    const stateWithGoal = {
      ...initialState,
      byId: {
        [goal.id]: goal,
      },
      allIds: [goal.id],
    };

    const result = goalsReducer(stateWithGoal, action);

    expect(typeof result.byId[goal.id].deletedAtTimestamp).toEqual('number');
    expect(Object.keys(result.byId)).toEqual([goal.id]);
    expect(result.allIds).toEqual([goal.id]);
  });

  it('handles setting the tracked goal', () => {
    const goalId = 'GOAL_ID';
    const startTimestamp = Date.now();
    const action = setTrackedGoal(goalId, startTimestamp);

    const result = goalsReducer(initialState, action);

    expect(result.trackedGoal).toEqual({
      startTimestamp,
      id: goalId,
    });
  });

  it('handles removing the tracked goal', () => {
    const action = removeTrackedGoal();

    const result = goalsReducer(stateWithTrackedGoal, action);

    expect(result.trackedGoal).toEqual(initialState.trackedGoal);
  });

  it('handles updating the start timestamp of the tracked goal', () => {
    const newStartTimestamp = Date.now();
    const action: UpdateTrackedGoalStartTimestampAction = {
      type: UPDATE_TRACKED_GOAL_START_TIMESTAMP,
      startTimestamp: newStartTimestamp,
    };

    const result = goalsReducer(stateWithTrackedGoal, action);

    expect(result.trackedGoal).toEqual({
      ...stateWithTrackedGoal.trackedGoal,
      startTimestamp: newStartTimestamp,
    });
  });

  it('handles updating the project ID of the tracked goal ', () => {
    const projectId = 'SOME_PROJECT_ID';
    const action = updateTrackedGoalProjectId(projectId);

    const result = goalsReducer(initialState, action);

    expect(result.trackedGoal.projectId).toEqual(projectId);
  });
});
