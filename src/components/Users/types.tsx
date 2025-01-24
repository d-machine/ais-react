export interface ActionConfig {
    label: string;
    actionType: string;
    formConfig?: string;
    query?: string;
    queryReturnType?: string;
    payload?: string[];
    contextParams?: string[];
    onSuccess: string;
    onFailure?: string;
  }
  
  export interface Column {
    name: string;
    label: string;
    width: number;
    sortable: boolean;
    filterType: string;
  }
  
  export interface TableConfig {
    queryReturnType: string;
    query: string;
    applyAccessLevelRestrictions: boolean;
    pagenation: boolean;
    filterable: boolean;
    sortable: boolean;
    onSuccess: string;
    onFailure: string;
    applicableActions: string[];
    actionConfig: {
      add: ActionConfig;
      edit: ActionConfig;
      delete: ActionConfig;
    };
    columns: Column[];
  }