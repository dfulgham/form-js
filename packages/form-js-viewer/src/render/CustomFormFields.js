export default class CustomFormFields {
  constructor(formFields, form) {
    this._formFields = formFields;
    this._form = form;
  }

  register() {
    const customFields = this._form._getState().customFields;
    this._formFields.registerCustomFields(customFields, this._form);
  }
}
CustomFormFields.$inject = ['formFields','form'];