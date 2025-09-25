export const enum ESortOrder {
  ASC = "asc",
  DESC = "desc",
}

export const enum EFilterOperator {
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

export interface ISortInfo {
  field: string;
  order: ESortOrder;
}

export interface IPaginationInfo {
  offset: number;
  limit: number;
}

export interface IFilterInfo {
  field: string;
  value: string | number | boolean;
  operator?: EFilterOperator;
}

export interface IFetchQuery {
  sortData?: ISortInfo[];
  paginationData?: IPaginationInfo;
  filtersData?: IFilterInfo[];
}

export const enum EQueryReturnType {
  SINGLE_ROW = "SINGLE_ROW",
  MULTIPLE_ROWS = "MULTIPLE_ROWS",
  SCALAR = "SCALAR",
  SCALAR_ARRAY = "SCALAR_ARRAY"
}

export enum EActionType {
  DISPLAY_FORM = "DISPLAY_FORM",
  EXECUTE_QUERY = "EXECUTE_QUERY",
  FUNCTION_CALL = "FUNCTION_CALL"
}

export enum EFilterType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  DATE = "DATE",
  BOOLEAN = "BOOLEAN",
  SELECT = "SELECT",
}

export enum EInputType {
  TEXT = "TEXT",
  DATE = "DATE",
  SELECT = "SELECT",
  BUTTON = "BUTTON",
  TEXTAREA = "TEXTAREA",
}

export enum ESectionType {
  FIELDS = "FIELDS",
  TABLE = "TABLE",
}

export interface IBaseActionConfig {
  label: string;
  payload?: Array<string>;
  onSuccess?: string;
  onFailure?: string;
  accessTypeRequired?: string;
}

export interface IDisplayFormConfig extends IBaseActionConfig {
  type: EActionType.DISPLAY_FORM;
  formConfig: string;
}

export interface IExecuteQueryConfig extends IBaseActionConfig {
  type: EActionType.EXECUTE_QUERY;
  queryInfo: IQueryInfo;
}

export interface IActionConfig {
  [key: string]: IDisplayFormConfig | IExecuteQueryConfig;
}

export interface IFieldTrasformMap {
  as: string;
  key: string;
}

export interface IDependency {
  dependency: string;
  fields: IFieldTrasformMap[];
}

export interface IInputBase {
  name: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  width: number;
  input_width: number;
  dependencies?: IDependency[];
}

export interface IInputText extends IInputBase {
  type: EInputType.TEXT;
  selectQuery?: string;
  regularExpression?: string;
  minLength?: number;
  maxLength?: number;
}

export interface IQueryInfo {
  returnType: EQueryReturnType;
  query: string;
  payload?: Array<string | number>;
  contextParams?: Array<string>;
  options?: {
    applyAccessLevelRestrictions?: boolean;
    applyPagenation?: boolean;
    applySorting?: boolean;
    applyFiltering?: boolean;
    defaultFilter?: IFilterInfo;
    defaultSort?: Array<ISortInfo>;
    pageSize?: number;
  };
}

export interface IInputSelectBase extends IInputBase {
  type: EInputType.SELECT;
  multi?: boolean;
  selectHandler: string;
  currentSelection: Array<IFieldTrasformMap>;
  selectParser: string;
  fields_to_extract: Array<IFieldTrasformMap>;
}

export interface IInputSelectWithQuery extends IInputSelectBase {
  queryInfo: IQueryInfo;
}

export interface IInputSelectWithOptions extends IInputSelectBase {
  options: Array<{id: string | number; label: string | number}>;
}

export type TInputSelect = IInputSelectWithQuery | IInputSelectWithOptions;

export interface IInputDate extends IInputBase {
  type: EInputType.DATE;
  minDate?: string;
  maxDate?: string;
}

export interface IInputButton extends IInputBase {
  type: EInputType.BUTTON;
  value: string;
  triggerQuery?: string;
}

export interface IInputTextArea extends IInputBase {
  type: EInputType.TEXTAREA;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  regularExpression?: string;
}

export type TInput =
  | IInputText
  | TInputSelect
  | IInputDate
  | IInputButton
  | IInputTextArea;

export interface IListColumn {
  name: string;
  label: string;
  width: number;
  sortable: boolean;
  filterType?: EFilterType;
}

export interface IListConfig{
  queryInfo: IQueryInfo;
  applicableActions?: Array<string>;
  actionConfig?: IActionConfig;
  columns?: Array<IListColumn>;
}

export interface IBaseSectionConfig {
  sectionName: string;
  applicableActions?: Array<string>;
  actionConfig?: IActionConfig;
}

export interface IFieldsSection extends IBaseSectionConfig {
  sectionType: ESectionType.FIELDS;
  fields: Array<TInput>;
}

export interface ITableSection extends IBaseSectionConfig {
  sectionType: ESectionType.TABLE;
  listConfig: IListConfig;
}

export interface IFormConfig {
  formTitle?: string;
  sections: Array<IFieldsSection | ITableSection>;
}

export enum EFieldType {
  PASSWORD = 'PASSWORD',
  TEXT = 'TEXT',
  SELECT = 'SELECT',
  TEXTAREA = 'TEXTAREA',
}

export enum EGridTye {
  TEXT = 'text',
  NUMBER = 'number'
}


export enum EButtonType {
  ADD = 'add',
  EDIT = 'edit',
  SAVE = 'save',
  DELETE = 'delete',
  CANCEL = 'cancel'
}

export enum ESelectHandler {
  CONVERTER = 'converter',
  CONCATINATOR = 'concatinator',
}

export enum ESelectParser {
  CONVERTER = 'converter',
  SPLITTER = 'splitter',
}

export interface IFeildBase {
  name: string;
  label: string;
  type: EFieldType;
  required?: boolean;
  readOnly?: boolean;
  grid_column?: number;
  dependencies?: IDependency[];
  width?: number;
  disabled?: boolean;
}

export interface ISelectConfigBase {
  multi?: boolean;
  selectHandler: ESelectHandler;
  currentSelection: Array<{ key: string; as: string }>;
  selectParser: ESelectParser;
  fields_to_extract: Array<{ key: string; as: string }>;
}

export type ISelectConfig = ISelectConfigBase & ({
  options: Array<{ id: string | number; name: string }>;
  columnConfig?: IListColumn;
} | {
  queryInfo: IQueryInfo;
  columnConfig?: IListColumn;
} | {
  resource: string;
});

export interface ISelectField extends IFeildBase {
  type: EFieldType.SELECT;
  selectConfig: ISelectConfig;
}

export type IField = IFeildBase | ISelectField;
