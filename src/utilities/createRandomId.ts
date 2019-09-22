import { v4 as uuid } from 'uuid';

export function createRandomId() {
  return uuid();
}
