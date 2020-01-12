export type WithOptionalId<T> = Omit<T, 'id'> & { id?: string };
