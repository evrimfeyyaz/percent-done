import { NormalizedEntityState } from '../store/types';
import { createRandomId } from '../utilities';

export const createNormalizedEntityState = <T extends { id?: string }>(entities: T[]): NormalizedEntityState<T> => {
  const result: NormalizedEntityState<T> = {
    byId: {},
    allIds: [],
  };

  entities.forEach(entry => {
    const id = entry.id ? entry.id : createRandomId();

    result.byId[id] = entry;
    result.allIds.push(id);
  });

  return result;
};
