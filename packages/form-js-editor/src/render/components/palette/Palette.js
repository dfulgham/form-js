import { useService } from '../../hooks';
import { iconsByType } from './icons';

/**
 * @typedef { import('../../../types').CustomField} CustomField
 */


const types = [
  {
    label: 'Text Field',
    type: 'textfield'
  },
  {
    label: 'Number',
    type: 'number'
  },
  {
    label: 'Checkbox',
    type: 'checkbox'
  },
  {
    label: 'Radio',
    type: 'radio'
  },
  {
    label: 'Select',
    type: 'select'
  },
  {
    label: 'Text',
    type: 'text'
  },
  {
    label: 'Button',
    type: 'button'
  }
];


export default function Palette(props) {

  const formEditor = useService('formEditor');


  /**
   * @type Array<CustomField>
   */
  const customFields = formEditor?._getState().customFields || [];
  let _types = types;
  if (customFields.length > 0) {
    customFields.forEach(({ label, type, icon }) => {

      // add if doesnt exist add it
      if (!types.map(t => t.type).includes(type)) { _types.push({ label, type, icon }); }
    });
  }

  return <div class="fjs-palette">
    <div class="fjs-palette-header" title="Form elements library">
      <span class="fjs-hide-compact">FORM ELEMENTS </span>LIBRARY
    </div>
    <div class="fjs-palette-fields fjs-drag-container fjs-no-drop">
      {
        _types.map(({ label, type, icon }) => {
          const Icon = icon || iconsByType[type];

          return (
            <div
              class="fjs-palette-field fjs-drag-copy fjs-no-drop"
              data-field-type={ type }
              title={ `Create a ${ label } element` }
            >
              {
                Icon ? <Icon class="fjs-palette-field-icon" width="36" height="36" viewBox="0 0 54 54" /> : null
              }
              <span class="fjs-palette-field-text fjs-hide-compact">{ label }</span>
            </div>
          );
        })
      }
    </div>
  </div>;
}