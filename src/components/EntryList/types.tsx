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

  export enum ESortOrder {
    ASC = "asc",
    DESC = "desc",
  }
  
  export enum EFilterOperator {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    IN = "IN",
    NOT_IN = "NOT_IN",
    BETWEEN = "BETWEEN",
    NOT_BETWEEN = "NOT_BETWEEN",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    NOT_STARTS_WITH = "NOT_STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    NOT_ENDS_WITH = "NOT_ENDS_WITH",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL",
  }