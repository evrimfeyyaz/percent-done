import { ValidationError } from './types';

export abstract class AbstractValidator {
  readonly errors: ValidationError[] = [];

  abstract validate(): boolean;
}
