export interface IDocResponseOptions<T> {
  dataSchema?: any;
  description?: string;
  extraModels?: any[];
  httpStatus?: number;
  messageExample?: string;
  serialization?: any;
  isArray?: boolean;
}

export interface IDocOptions<T> {
  description?: string;
  response?: IDocResponseOptions<T>;
  request?: IDocRequestOptions;
  summary?: string;
}

interface IDocRequestOptions {
  params?: any[];
  queries?: any[];
  bodyType?: 'FORM_DATA' | 'JSON';
  getWorkspaceId?: boolean;
}
