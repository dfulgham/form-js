import { Injector } from 'didi';
import { JSX } from 'preact';

export type Module = any;
export type Schema = any;

export interface FormEditorProperties {
  [x: string]: any
}

export interface FormEditorOptions {
  additionalModules?: Module[];
  container?: Element | null | string;
  exporter?: {
    name: string,
    version: string
  };
  injector?: Injector;
  modules?: Module[];
  properties?: FormEditorProperties;
  customFields?: Array<CustomField>;
  customPropertyPanelGroups?: Array<CustomPropertyPanelGroup>;
  [x:string]: any;
}

export interface CreateFormEditorOptions extends FormEditorOptions {
  schema?: Schema
}

export interface CustomField {
  icon: ()=>JSX.Element;
  label: string;
  type: string;
  keyed: boolean;
  emptyValue: any;
  propertiesPanelGroups: Array<string>;
  create: (options: any) => any;
  fieldRender: (props:any,FieldComponents:any,PreactHooks:any,Context:any, Utils:any)=>JSX.Element;
}

export interface CustomPropertyPanelGroup {
  name: string;
  groupRenderer: (field:any,editField:any,Components:any,Entries:any,MinDash:any,Utils:any)=>JSX.Element;
}

export {
  Injector
};