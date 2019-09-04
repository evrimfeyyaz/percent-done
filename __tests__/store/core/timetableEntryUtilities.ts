// import { timetableEntryDurationInSeconds } from '../../../src/utilities/timetableEntryUtilities';
// import { TimetableEntry } from '../../../src/store/core/types';
//
// describe('timetableEntryDurationInSeconds', () => {
//   it('returns 1800 for a 30 minute entry', () => {
//     const ten = new Date();
//     ten.setUTCHours(10, 0);
//     const tenThirty = new Date();
//     tenThirty.setUTCHours(10, 30);
//
//     const thirtyMinuteEntry: TimetableEntry = {
//       id: 'thirty-minute-entry',
//       goalId: 'not-important',
//       startTime: ten.getTime(),
//       endTime: tenThirty.getTime(),
//     };
//
//     const duration = timetableEntryDurationInSeconds(thirtyMinuteEntry);
//     expect(duration).toEqual(1800);
//   });
// });
