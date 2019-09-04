// import {
//   goalPercentProgress,
//   convertDateToIndex,
//   isGoalCompleted,
//   getGoalsByDate,
//   getGoalsByDateAsGoalListProps,
// } from '../../../src/utilities';
// import { createGoal } from '../../factories/createGoal';
// import { createTimetableEntry } from '../../factories/createTimetableEntry';
// import { createNormalizedEntityState } from '../../factories/createNormalizedEntityState';
// import { Goal } from '../../../src/store/core/types';
// import { GoalsListProps } from '../../../src/components';
//
// const today = new Date();
// const todayIndex = convertDateToIndex(today);
//
// const ten = new Date();
// ten.setUTCHours(10, 0);
// const tenThirty = new Date();
// tenThirty.setUTCHours(10, 30);
// const elevenThirty = new Date();
// elevenThirty.setUTCHours(11, 30);
//
// // Timetable entries
// const thirtyMinuteEntry = createTimetableEntry({ startTime: ten.getTime(), endTime: tenThirty.getTime() });
// const oneHourEntry = createTimetableEntry({ startTime: tenThirty.getTime(), endTime: elevenThirty.getTime() });
//
// // Goals
// const sixtyMinuteGoal = createGoal({ isTimeTracked: true, duration: 3600 });
//
// describe('goalProgressPercent', () => {
//   const timetableEntries = createNormalizedEntityState([thirtyMinuteEntry, oneHourEntry]);
//
//   it('returns 0 for a goal that has not been tracked in a given date', () => {
//     sixtyMinuteGoal.timetableEntryIdsByDate = {};
//
//     const progress = goalPercentProgress(sixtyMinuteGoal, timetableEntries, today);
//
//     expect(progress).toEqual(0);
//   });
//
//   it('returns 50 for a goal that has been half completed in a given date', () => {
//     sixtyMinuteGoal.timetableEntryIdsByDate = {
//       [todayIndex]: [thirtyMinuteEntry.id],
//     };
//
//     const progress = goalPercentProgress(sixtyMinuteGoal, timetableEntries, today);
//
//     expect(progress).toEqual(50);
//   });
//
//   it('returns 150 for a goal that has been completed 150%', () => {
//     sixtyMinuteGoal.timetableEntryIdsByDate = {
//       [todayIndex]: [thirtyMinuteEntry.id, oneHourEntry.id],
//     };
//
//     const progress = goalPercentProgress(sixtyMinuteGoal, timetableEntries, today);
//
//     expect(progress).toEqual(150);
//   });
// });
//
// describe('isGoalCompleted', () => {
//   describe('given a non-time-tracked goal', () => {
//     const nonTrackedGoal = createGoal({ isTimeTracked: false });
//     const completionEntry = createTimetableEntry({});
//     const timetableEntries = createNormalizedEntityState([completionEntry]);
//
//     it('returns `false` when goal has no timetable entry', () => {
//       nonTrackedGoal.timetableEntryIdsByDate = {};
//
//       expect(isGoalCompleted(nonTrackedGoal, timetableEntries, today)).toEqual(false);
//     });
//
//     it('returns `true` when goal has a timetable entry', () => {
//       nonTrackedGoal.timetableEntryIdsByDate = {
//         [todayIndex]: [completionEntry.id],
//       };
//
//       expect(isGoalCompleted(nonTrackedGoal, timetableEntries, today)).toEqual(true);
//     });
//   });
//
//   describe('given a time-tracked goal', () => {
//     const timetableEntries = createNormalizedEntityState([thirtyMinuteEntry, oneHourEntry]);
//
//     it('returns `false` when goal has no timetable entries', () => {
//       sixtyMinuteGoal.timetableEntryIdsByDate = {};
//
//       expect(isGoalCompleted(sixtyMinuteGoal, timetableEntries, today)).toEqual(false);
//     });
//
//     it('returns `false` when timetable entries add up to less than goal duration', () => {
//       sixtyMinuteGoal.timetableEntryIdsByDate = {
//         [todayIndex]: [thirtyMinuteEntry.id],
//       };
//
//       expect(isGoalCompleted(sixtyMinuteGoal, timetableEntries, today)).toEqual(false);
//     });
//
//     it('returns `true` when timetable entries add up to equal to goal duration', () => {
//       sixtyMinuteGoal.timetableEntryIdsByDate = {
//         [todayIndex]: [oneHourEntry.id],
//       };
//
//       expect(isGoalCompleted(sixtyMinuteGoal, timetableEntries, today)).toEqual(true);
//     });
//
//     it('returns `true` when timetable entries add up to more than goal duration', () => {
//       sixtyMinuteGoal.timetableEntryIdsByDate = {
//         [todayIndex]: [thirtyMinuteEntry.id, oneHourEntry.id],
//       };
//
//       expect(isGoalCompleted(sixtyMinuteGoal, timetableEntries, today)).toEqual(true);
//     });
//   });
// });
//
// describe('getGoalsByDate', () => {
//   const dayOfWeek = today.getDay();
//   const nextDay = (today.getDay() + 1) % 6;
//
//   const incompleteTrackedGoal = createGoal({ isTimeTracked: true, duration: 3600 });
//   incompleteTrackedGoal.recurringDays = Array(7).fill(false);
//   incompleteTrackedGoal.recurringDays[dayOfWeek] = true;
//   const incompleteNonTrackedGoal = createGoal({ isTimeTracked: false });
//   incompleteNonTrackedGoal.recurringDays = Array(7).fill(false);
//   incompleteNonTrackedGoal.recurringDays[dayOfWeek] = true;
//   const completedGoal = createGoal({ isTimeTracked: false });
//   completedGoal.recurringDays = Array(7).fill(false);
//   completedGoal.recurringDays[dayOfWeek] = true;
//   const tomorrowsGoal = createGoal({});
//   tomorrowsGoal.recurringDays = Array(7).fill(false);
//   tomorrowsGoal.recurringDays[nextDay] = true;
//
//   const timetableEntry = createTimetableEntry({ startTime: today.getTime(), endTime: today.getTime() });
//   const timetableEntries = createNormalizedEntityState([timetableEntry]);
//
//   completedGoal.timetableEntryIdsByDate = {
//     [todayIndex]: [timetableEntry.id],
//   };
//
//   const goals = createNormalizedEntityState([incompleteNonTrackedGoal, incompleteTrackedGoal, completedGoal, tomorrowsGoal]);
//
//   describe('when asked for incomplete goals for today', () => {
//     let incompleteGoals: Goal[] = [];
//
//     beforeEach(() => {
//       incompleteGoals = getGoalsByDate(goals, timetableEntries, today, false);
//     });
//
//     it('returns incomplete goals for today', () => {
//       expect(incompleteGoals).toContain(incompleteTrackedGoal);
//       expect(incompleteGoals).toContain(incompleteNonTrackedGoal);
//     });
//
//     it('does not return incomplete goals for another day', () => {
//       expect(incompleteGoals).not.toContain(tomorrowsGoal);
//     });
//
//     it('does not return completed goals', () => {
//       expect(incompleteGoals).not.toContain(completedGoal);
//     });
//   });
//
//   describe('when asked for completed goals for today', () => {
//     it('returns completed goals for today', () => {
//       const completedGoals = getGoalsByDate(goals, timetableEntries, today, true);
//
//       expect(completedGoals).toContain(completedGoal);
//     });
//   });
// });
//
// describe('getGoalsByDateAsGoalListProps', () => {
//   it('returns the correct GoalsListProps', () => {
//     sixtyMinuteGoal.timetableEntryIdsByDate = {
//       [todayIndex]: [thirtyMinuteEntry.id],
//     };
//     const timetableEntries = createNormalizedEntityState([thirtyMinuteEntry]);
//     const goals: Goal[] = [sixtyMinuteGoal];
//
//     const goalsListProps: GoalsListProps = getGoalsByDateAsGoalListProps(goals, timetableEntries);
//
//     expect(goalsListProps).toEqual({
//       goals: [],
//     });
//   });
// });
