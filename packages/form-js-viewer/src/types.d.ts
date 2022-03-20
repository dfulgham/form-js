import { Injector } from 'didi';

export type Module = any;
export type Schema = any;

export interface Data {
  [x: string]: any;
}

export interface Errors {
  [x: string]: string[];
}

export type FormProperty = ('readOnly' | string);
export type FormEvent = ('submit' | 'changed' | string);

export interface FormProperties {
  [x: string]: any;
}

export interface FormOptions {
  additionalModules?: Module[];
  container?: Element | null | string;
  injector?: Injector;
  modules?: Module[];
  properties?: FormProperties;
  customFields?: Array<CustomField>;
}

export interface CreateFormOptions extends FormOptions {
  data?: Data;
  schema: Schema;
}

export interface CustomField {
  icon: any;
  label: string;
  type: string;
  keyed: boolean;
  emptyValue: any;
  propertiesPanelGroups: Array<string>;
  create: (options: any) => any;
  fieldRender: (props:any,FieldComponents:any,PreactHooks:any,Context:any, Utils:any)=>any
}

export {
  Injector
};