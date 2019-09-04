export interface NormalizedEntity<T> {
  byId: { [id: string]: T },
  allIds: string[],
}
