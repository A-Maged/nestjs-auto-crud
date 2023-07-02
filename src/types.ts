export type ClassType = { new (): any };

export type CrudMethodName =
  | 'findAll'
  | 'findById'
  | 'create'
  | 'update'
  | 'delete';
