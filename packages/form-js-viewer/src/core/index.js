import importModule from '../import';
import renderModule, { CustomFormFields } from '../render';
import EventBus from './EventBus';
import FormFieldRegistry from './FormFieldRegistry';
import Validator from './Validator';

export { FormFieldRegistry };

export default {
  __depends__: [ importModule, renderModule ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: ['type', FormFieldRegistry],
  customFormFields: ['type', CustomFormFields],
  validator: ['type', Validator],

};