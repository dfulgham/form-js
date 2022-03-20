import importModule from '../import';
import renderModule from '../render';
import CustomFormFields from './CustomFormFields';
import DebounceFactory from './Debounce';
import EventBus from './EventBus';
import FieldFactory from './FieldFactory';
import FormFieldRegistry from './FormFieldRegistry';

export default {
  __depends__: [
    importModule,
    renderModule
  ],
  eventBus: [ 'type', EventBus ],
  formFieldRegistry: [ 'type', FormFieldRegistry ],
  fieldFactory: ['type', FieldFactory],
  customFormFields: ['type', CustomFormFields],
  debounce: ['factory', DebounceFactory],
};