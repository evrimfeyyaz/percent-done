import { TimetableEntry } from '../../src/store/core/types';
import { NormalizedEntity } from '../../src/store/types';

export const createNormalizedEntityState = <T extends { id: string }>(entities: T[]): NormalizedEntity<T> => {
  const result: NormalizedEntity<T> = {
    byId: {},
    allIds: [],
  };

  entities.forEach(entry => {
    result.byId[entry.id] = entry;
    result.allIds.push(entry.id);
  });

  return result;
};
