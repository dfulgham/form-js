import CustomFormFields from './CustomFormFields';
import FormFields from './FormFields';
import Renderer from './Renderer';


export { FormFields, CustomFormFields };

export * from './components';
export * from './context';

export default {
  __init__: [ 'formFields', 'renderer' ],
  formFields: [ 'type', FormFields ],
  renderer: [ 'type', Renderer ]
};