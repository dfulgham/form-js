export default class CustomFormFields {
  constructor(formFields, formEditor) {
    this._formFields = formFields;
    this._formEditor = formEditor;
  }

  register() {
    const customFields = this._formEditor._getState().customFields;
    this._formFields.registerCustomFields(customFields, this._formEditor);
  }
}
CustomFormFields.$inject = ['formFields','formEditor'];