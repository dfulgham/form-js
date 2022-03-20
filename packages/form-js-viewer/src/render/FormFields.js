/* eslint-disable react-hooks/rules-of-hooks */
import { Description, Errors, formFields, Label } from './components';
import { formFieldClasses, markdownToHTML, prefixId, safeMarkdown } from './components/Util';

export default class FormFields {

  constructor() {

    this._formFields = {};

    formFields.forEach((formField) => {
      const { type } = formField;

      this.register(type, formField);
    });

  }

  register(type, formField) {
    this._formFields[type] = formField;
  }

  get(type) {
    return this._formFields[type];
  }

  registerCustomFields(customFields, FormContext) {

    customFields.forEach((customField) => {
      this.register(customField.type, this.processCustomFieldSchema(customField, { Description, Label, Errors }, FormContext , { prefixId, formFieldClasses, markdownToHTML, safeMarkdown }));
    });

  }

  processCustomFieldSchema = function({ type, label, keyed, create, fieldRenderer }, FieldComponents, FormContext, Utils) {

    // TODO: should add typechecking here

    let formField = function(props) {
      return fieldRenderer(props, FieldComponents, FormContext, Utils);
    };
    formField.type = type;
    formField.label = label;
    formField.keyed = keyed;
    formField.create = create;

    return formField;
  }
}
