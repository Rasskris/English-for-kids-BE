import { NotFoundException } from '@nestjs/common';
import { ENTITY_NAME, QUERY_NAME } from 'src/constants';

export class EntityNotFoudException extends NotFoundException {
  constructor(
    entityName: ENTITY_NAME,
    queryName: QUERY_NAME,
    entityQuery: string | number,
  ) {
    super(`${entityName} with this ${queryName} ${entityQuery} not found`);
  }
}
