import { NormalizedEntityState } from '../store/types';

export const createNormalizedEntityState = <T extends { id: string }>(entities: T[]): NormalizedEntityState<T> => {
  const result: NormalizedEntityState<T> = {
    byId: {},
    allIds: [],
  };

  entities.forEach(entry => {
    result.byId[entry.id] = entry;
    result.allIds.push(entry.id);
  });

  return result;
};
