export interface Section {
  sectionType: string;
  sectionName: string;
  queryReturnType: string;
  query: string;
  payload: string[];
  applicableActions: string[];
  actionConfig: ActionConfig;
  fields?: Field[];
  columns?: Column[];
}
interface ActionConfig {
  [key: string]: Action;
}

 interface Action {
  label: string;
  actionType: string;
  query?: string;
  queryReturnType?: string;
  payload?: string[];
  contextParams?: string[];
  functionName?: string;
  onSuccess?: string;
  onFailure?: string;
}

 interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  query?: string;
  disabled?: boolean;
}

 export interface Column {
  name: string;
  label: string;
  type: string;
  multi?: boolean;
  selectConfig?: SelectConfig;
}

 interface SelectConfig {
  selectHandler: string;
  currentSelection: Selection[];
  selectParser: string;
  columns: { id: string; name: string };
  options: Option[];
  fields_to_extract: Selection[];
}

 interface Selection {
  key: string;
  as: string;
}

 interface Option {
  id: string;
  name: string;
}