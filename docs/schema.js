/* eslint-disable react-hooks/rules-of-hooks */

const customFieldschema = {
  icon: 'an SVG string', // used for the icon in the sidebar, must have viewport/box of "0,0,54,54"
  label: 'FILE INPUT', // used for the name of the field in the sidebar
  type: 'custom', // the type of the field, needs to be unique, or override internal type
  keyed: true, // whether the field is keyed or not
  emptyValue: '', // the value to use when the field is empty
  propertyPanelGroups: ['default', 'fileValidate'], // the groups the field will use in the properties panel
  create: (options = {}) => options, // function to create the field, modified options are passed back
  fieldRenderer: (props,FieldComponents, PreactHooks, Context, Utils) => {
    const type = 'FileInput';

    const { useContext } = PreactHooks;
    const { FormContext } = Context;
    const { formFieldClasses,prefixId } = Utils;
    const { Label, Description, Errors } = FieldComponents;

    const { disabled = false, errors = [], field, value = '' } = props;

    const { description, id, label, validate = {} } = field;

    const { required } = validate;

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const onChange = async ({ target }) => {
      const base64Value = await convertBase64(target.files[0]);

      props.onChange({
        field,
        value: base64Value
      });

    };

    const onReset = () => {
      props.onChange({
        field,
        value: ''
      });
    };

    const onClick = () => {
      let newWindow = window.open('');
      newWindow.document.write(
        "<iframe width='100%' height='100%' src='" +
    value + "'></iframe>"
      );
    };

    const { formId } = useContext(FormContext);

    if (disabled === true && value)
      return <div class={ formFieldClasses(type, errors) }>
        <Label id={ prefixId(id, formId) } label={ label } required={ required } />
        <a onClick={ onClick }><button type="secondary" class="fjs-button">View/Download</button></a>
        <Description description={ description } />
      </div>;



    return (
      <div class={ formFieldClasses(type, errors) }>
        <Label id={ prefixId(id, formId) } label={ label } required={ required } />

        <input
          class="fjs-input"
          disabled={ disabled }
          id={ prefixId(id, formId) }
          onInput={ onChange }
          onReset={ onReset }
          type="file"
          value={ value }
        />
        <Description description={ description } />
        <Errors errors={ errors } />
      </div>

    );
  }


};


const customPropertyPanelGroupsSchema = [{
  name: 'fileValidate',
  groupRenderer: (field, editField, Components, Entries, MinDash) => {
    const { index, id, key } = field;
    const { get, set } = MinDash;
    const { Group,TextInput } = Components;
    const { CollapsibleEntry } = Entries;
    const path =['validate','allowedMimeTypes'];

    // custom logic


    const onChange = (key) => {
      return (value) => {
        const validate = get(field, [ 'validate' ], {});
        editField(field, [ 'validate' ], set(validate, [ key ], value));
      };
    };
    const onInput = (value) => {
      if (editField && path) {
        editField(field, path, value);
      } else {
        onChange(value);
      }
    };

    return (
      <Group label="File Validation">
        <CollapsibleEntry key={ `${id}-${index}` } label={ key }>
          <div class="fjs-properties-panel-entry">
            <TextInput
              id={ `${id}-allowedMimeTypes` }
              label="Allowed Mime Types"
              onInput={ onInput }
              value={ get(field, path) }
            />
            <div class="fjs-properties-panel-description">Comma separated list of file types. e.g. 'image/png,application/pdf'</div>
          </div>

        </CollapsibleEntry>
      </Group>
    );
  }
},];
