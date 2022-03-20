import { get, set } from 'min-dash';

import { useService } from '../../hooks';
import { iconsByType } from '../palette/icons';
import { CollapsibleEntry, Group, TextInput } from './components';
import { DescriptionEntry, KeyEntry, LabelEntry } from './entries';
import { CustomValuesGroup, GeneralGroup, ValidationGroup, ValuesGroup } from './groups';
import { INPUTS, textToLabel } from './Util';

const labelsByType = {
  button: 'BUTTON',
  checkbox: 'CHECKBOX',
  columns: 'COLUMNS',
  default: 'FORM',
  number: 'NUMBER',
  radio: 'RADIO',
  select: 'SELECT',
  text: 'TEXT',
  textfield: 'TEXT FIELD',
};

function getGroups(field, editField, formEditor) {
  const { type } = field;

  // get customPropertyPanelGroupsSchema groups from state
  const { customPropertyPanelGroups, customFields } = formEditor?._getState() || {};


  const isCustomType = !Object.keys(labelsByType).includes(type);


  // add groups for custom type in order of appearance in customFeild's propertyPanelGroups
  if (isCustomType) {
    return customFields.find((cf)=>cf.type===type).propertyPanelGroups?.map(group => {
      if (group === 'general') return GeneralGroup(field, editField);
      if (group === 'values') return ValuesGroup(field, editField);
      if (group === 'validation') return ValidationGroup(field, editField);
      if (group === 'custom') return CustomValuesGroup(field, editField);

      // check against customPropertyPanels
      return customPropertyPanelGroups
        .find(pg => pg.name === group)
        .groupRenderer(
          field,
          editField,
          { Group, TextInput, CollapsibleEntry, LabelEntry, DescriptionEntry, KeyEntry },
          { get, set }
        );

    });
  }

  // else if type is of a built-in type
  const groups = [
    GeneralGroup(field, editField)
  ];

  if (type === 'radio' || type === 'select') {
    groups.push(ValuesGroup(field, editField));
  }

  if (INPUTS.includes(type) && type !== 'checkbox') {
    groups.push(ValidationGroup(field, editField));
  }

  if (type !== 'default') {
    groups.push(CustomValuesGroup(field, editField));
  }

  // check to see if any customPropertyPanelGroupsSchema groups exist for this type. and add them

  return groups;
}

export default function PropertiesPanel(props) {
  const {
    editField,
    field
  } = props;

  const eventBus = useService('eventBus');
  const formEditor = useService('formEditor');

  // get customFields from state
  const customFields = formEditor?._getState().customFields;

  if (!field) {
    return <div class="fjs-properties-panel-placeholder">Select a form field to edit its properties.</div>;
  }

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const { type } = field;

  // get icon and label from customField if not internal type
  // else get icon and label from <icon|label>ByType[type]

  const Icon = iconsByType[ type ] || customFields.find(({ type: customType }) => customType === type)?.icon;

  const label = labelsByType[ type ] || customFields.find(({ type: customType }) => customType === type)?.label;

  return (
    <div
      class="fjs-properties-panel"
      data-field={ field.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <div class="fjs-properties-panel-header">
        <div class="fjs-properties-panel-header-icon">
          <Icon width="36" height="36" viewBox="0 0 54 54" />
        </div>
        <div>
          <span class="fjs-properties-panel-header-type">{ label }</span>
          {
            type === 'text'
              ? <div class="fjs-properties-panel-header-label">{ textToLabel(field.text) }</div>
              : type === 'default'
                ? <div class="fjs-properties-panel-header-label">{ field.id }</div>
                : <div class="fjs-properties-panel-header-label">{ field.label }</div>
          }
        </div>
      </div>
      {
        getGroups(field, editField, formEditor)
      }
    </div>
  );
}