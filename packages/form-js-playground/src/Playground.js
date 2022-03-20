import './FileDrop.css';
import './Playground.css';

import { Form, FormEditor } from '@bpmn-io/form-js';
import download from 'downloadjs';
import fileDrop from 'file-drops';
import mitt from 'mitt';
import { render } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import JSONView from './JSONView';

const customFields = [{
  icon: () => {
    return (<svg id="file-icon" width="54px" height="54px" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(0.440697, 0, 0, 0.288703, -72.000198, -53.362686)" style="">
        <path d="M 261.968 260.403 C 260.414 260.403 258.876 260.629 257.367 261.077 C 256.679 232.991 241.391 210.461 222.697 210.461 C 205.507 210.461 190.961 229.743 188.41 255.089 C 174.55 255.604 163.378 272.853 163.378 293.989 C 163.378 315.446 174.892 332.898 189.045 332.898 L 210.518 332.898 C 212.142 332.898 213.458 330.902 213.458 328.441 C 213.458 325.98 212.142 323.984 210.518 323.984 L 189.045 323.984 C 178.134 323.984 169.258 310.527 169.258 293.989 C 169.258 277.446 178.134 263.993 189.045 263.993 C 189.581 263.993 190.148 264.033 190.777 264.116 L 193.756 264.508 L 193.963 259.984 C 195.006 237.212 207.628 219.375 222.697 219.375 C 238.585 219.375 251.512 238.969 251.512 263.053 C 251.512 264.162 251.477 265.345 251.405 266.673 L 251.02 273.783 L 255.405 271.19 C 257.504 269.948 259.713 269.317 261.969 269.317 C 271.929 269.317 280.032 281.601 280.032 296.698 C 280.032 311.796 271.929 324.08 261.969 324.08 C 261.707 324.08 253.891 324.057 246.107 324.034 C 238.38 324.007 230.684 323.984 230.428 323.984 C 228.598 323.984 227.642 322.649 227.585 320.016 L 227.585 271.907 L 230.775 277.652 C 231.821 279.539 233.675 279.778 234.917 278.194 C 236.159 276.606 236.318 273.793 235.273 271.914 L 228.203 259.181 C 227.312 257.577 226.032 256.657 224.691 256.657 C 223.35 256.657 222.07 257.577 221.18 259.181 L 214.11 271.914 C 213.064 273.793 213.223 276.606 214.466 278.194 C 215.017 278.894 215.689 279.24 216.357 279.24 C 217.195 279.24 218.026 278.702 218.608 277.652 L 221.705 272.073 L 221.705 320.059 C 221.705 325.22 224.028 332.898 230.428 332.898 C 230.683 332.898 238.373 332.921 246.094 332.944 C 253.884 332.971 261.707 332.994 261.968 332.994 C 275.171 332.994 285.911 316.711 285.911 296.698 C 285.911 276.683 275.17 260.403 261.968 260.403 Z" stroke="none" fill="#000002" fill-rule="nonzero" />
      </g>
    </svg>);
  },

  // used for the icon in the sidebar, must have viewport/box of "0,0,54,54"
  label: 'File', // used for the name of the field in the sidebar
  type: 'FileInput', // the type of the field, needs to be unique, or override internal type
  keyed: true, // whether the field is keyed or not
  emptyValue: '', // the value to use when the field is empty
  propertyPanelGroups: ['FileGeneral','FileProperties', 'validation'], // the groups the field will use in the properties panel
  create: (options = {}) => options, // function to create the field, modified options are passed back
  fieldRenderer: (props, FieldComponents, Form, Utils) => {
    const type = 'FileInput';

    const { formFieldClasses, prefixId } = Utils;
    const { Label, Description, Errors } = FieldComponents;

    const { disabled = false, field, value = '' } = props;

    const { description, id, label, validate = {} } = field;

    const { required } = validate;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [errors, setError] = useState([]);


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

      setError(_validate(base64Value));

    };


    const _validate = (value) => {
      const { allowedMimeTypes } = field;

      if (!allowedMimeTypes || allowedMimeTypes.length === 0) { return []; }
      const _allowed = allowedMimeTypes.split(',');
      const fileMime = value.split('data:')[1].split(';')[0];
      if (allowedMimeTypes) {
        return _allowed.includes(fileMime) ? [] : [`File type not allowed, must be one of: ${allowedMimeTypes}`];
      }
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

    const { formId } = Form._getState();

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
}];

/**
 * @type {Array<CustomPropertyPanelGroup>}
 */
const customPropertyPanelGroups = [
  {
    name: 'FileGeneral',
    groupRenderer: (field, editField, Components, MinDash) => {
      const { Group, LabelEntry, DescriptionEntry,KeyEntry } = Components;
      const entries = [];
      entries.push(<LabelEntry editField={ editField } field={ field } />);

      entries.push(<DescriptionEntry editField={ editField } field={ field } />);

      entries.push(<KeyEntry editField={ editField } field={ field } />);

      return (
        <Group label="General">
          {
            entries.length ? entries : null
          }
        </Group>
      );
    }

  },
  {
    name: 'FileProperties',
    groupRenderer: (field, editField, Components, MinDash) => {
      const { id } = field;
      const { get } = MinDash;
      const { Group,TextInput } = Components;
      const path =['allowedMimeTypes'];

      // custom logic

      const onInput = (value) => {
        if (editField && path) {
          editField(field, path, value);
        }
      };

      return (
        <Group label="File Validation">
          <div class="fjs-properties-panel-entry">
            <TextInput
              id={ `${id}-allowedMimeTypes` }
              label="Allowed Mime Types"
              onInput={ onInput }
              value={ get(field,path) }
            />
            <div class="fjs-properties-panel-description">Comma separated list of file types. e.g. 'image/png,application/pdf'</div>
          </div>

        </Group>
      );
    }
  },];

function Modal(props) {

  useEffect(() => {
    function handleKey(event) {

      if (event.key === 'Escape') {
        event.stopPropagation();

        props.onClose();
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  });

  return (
    <div class="fjs-pgl-modal">
      <div class="fjs-pgl-modal-backdrop" onClick={ props.onClose }></div>
      <div class="fjs-pgl-modal-content">
        <h1 class="fjs-pgl-modal-header">{ props.name }</h1>
        <div class="fjs-pgl-modal-body">
          { props.children }
        </div>
        <div class="fjs-pgl-modal-footer">
          <button class="fjs-pgl-button fjs-pgl-button-default" onClick={ props.onClose }>Close</button>
        </div>
      </div>
    </div>
  );
}

function Section(props) {

  const elements =
    Array.isArray(props.children)
      ? props.children :
      [ props.children ];

  const {
    headerItems,
    children
  } = elements.reduce((_, child) => {
    const bucket =
      child.type === Section.HeaderItem
        ? _.headerItems
        : _.children;

    bucket.push(child);

    return _;
  }, { headerItems: [], children: [] });

  return (
    <div class="fjs-pgl-section">
      <h1 class="header">{ props.name } { headerItems.length ? <span class="header-items">{ headerItems }</span> : null }</h1>
      <div class="body">
        { children }
      </div>
    </div>
  );
}

Section.HeaderItem = function(props) {
  return props.children;
};

function serializeValue(obj) {
  return JSON.stringify(JSON.stringify(obj)).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function EmbedModal(props) {

  const schema = serializeValue(props.schema);
  const data = serializeValue(props.data || {});
  const customFields = serializeValue(props.customFields || []);
  const fieldRef = useRef();

  const snippet = `<!-- styles needed for rendering -->
<link rel="stylesheet" href="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/assets/form-js.css">

<!-- container to render the form into -->
<div class="fjs-pgl-form-container"></div>

<!-- scripts needed for embedding -->
<script src="https://unpkg.com/@bpmn-io/form-js@0.2.4/dist/form-viewer.umd.js"></script>

<!-- actual script to instantiate the form and load form schema + data -->
<script>
  const data = JSON.parse(${data});
  const schema = JSON.parse(${schema});
  const customFields = JSON.parse(${customFields});

  const form = new FormViewer.Form({
    container: document.querySelector(".fjs-pgl-form-container")
  });

  form.on("submit", (event) => {
    console.log(event.data, event.errors);
  });

  form.importSchema(schema, data).catch(err => {
    console.error("Failed to render form", err);
  });
</script>
  `.trim();

  useEffect(() => {
    fieldRef.current.select();
  });

  return (
    <Modal name="Embed form" onClose={ props.onClose }>
      <p>Use the following HTML snippet to embed your form with <a href="https://github.com/bpmn-io/form-js">form-js</a>:</p>

      <textarea spellCheck="false" ref={ fieldRef }>{snippet}</textarea>
    </Modal>
  );
}

function PlaygroundRoot(props) {

  const editorContainerRef = useRef();
  const formContainerRef = useRef();
  const dataContainerRef = useRef();
  const resultContainerRef = useRef();

  const formEditorRef = useRef();
  const formRef = useRef();
  const dataEditorRef = useRef();
  const resultViewRef = useRef();

  const [ showEmbed, setShowEmbed ] = useState(false);

  const [ initialData ] = useState(props.data || {});
  const [ initialSchema, setInitialSchema ] = useState(props.schema);

  const [ data, setData ] = useState(props.data || {});
  const [ schema, setSchema ] = useState(props.schema);

  const [ resultData, setResultData ] = useState(props.data || {});

  useEffect(() => {
    props.onInit({
      setSchema: setInitialSchema
    });
  });

  useEffect(() => {
    setInitialSchema(props.schema || {});
  }, [ props.schema ]);

  useEffect(() => {
    const dataEditor = dataEditorRef.current = new JSONView({
      value: toJSON(data)
    });

    const resultView = resultViewRef.current = new JSONView({
      readonly: true,
      value: toJSON(resultData)
    });

    const form = formRef.current = new Form({ customFields });
    const formEditor = formEditorRef.current = new FormEditor({
      renderer: {
        compact: true
      },
      customFields,
      customPropertyPanelGroups
    });

    formEditor.on('changed', () => {
      setSchema(formEditor.getSchema());
    });

    form.on('changed', event => {
      setResultData(event.data);
    });

    dataEditor.on('changed', event => {
      try {
        setData(JSON.parse(event.value));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    });

    const formContainer = formContainerRef.current;
    const editorContainer = editorContainerRef.current;
    const dataContainer = dataContainerRef.current;
    const resultContainer = resultContainerRef.current;

    dataEditor.attachTo(dataContainer);
    resultView.attachTo(resultContainer);
    form.attachTo(formContainer);
    formEditor.attachTo(editorContainer);

    return () => {
      dataEditor.destroy();
      resultView.destroy();
      form.destroy();
      formEditor.destroy();
    };
  }, []);

  useEffect(() => {
    dataEditorRef.current.setValue(toJSON(initialData));
  }, [ initialData ]);

  useEffect(() => {
    formEditorRef.current.importSchema(initialSchema);
  }, [ initialSchema ]);

  useEffect(() => {
    formRef.current.importSchema(schema, data);
  }, [ schema, data ]);

  useEffect(() => {
    resultViewRef.current.setValue(toJSON(resultData));
  }, [ resultData ]);

  useEffect(() => {
    props.onStateChanged({
      schema,
      data
    });
  }, [ schema, data ]);

  const handleDownload = useCallback(() => {

    download(JSON.stringify(schema, null, '  '), 'form.json', 'text/json');
  }, [ schema ]);

  const hideEmbedModal = useCallback(() => {
    setShowEmbed(false);
  }, []);

  const showEmbedModal = useCallback(() => {
    setShowEmbed(true);
  }, []);

  return (
    <div class="fjs-pgl-root">
      <div class="fjs-pgl-modals">
        { showEmbed ? <EmbedModal schema={ schema } data={ data } onClose={ hideEmbedModal } /> : null }
      </div>
      <div class="fjs-pgl-main">

        <Section name="Form Definition">
          <Section.HeaderItem>
            <button
              class="fjs-pgl-button"
              title="Download form definition"
              onClick={ handleDownload }
            >Download</button>
          </Section.HeaderItem>
          <Section.HeaderItem>
            <button
              class="fjs-pgl-button"
              onClick={ showEmbedModal }
            >Embed</button>
          </Section.HeaderItem>
          <div ref={ editorContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Preview">
          <div ref={ formContainerRef } class="fjs-pgl-form-container"></div>
        </Section>
        <Section name="Form Data (Input)">
          <div ref={ dataContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
        <Section name="Form Data (Submit)">
          <div ref={ resultContainerRef } class="fjs-pgl-text-container"></div>
        </Section>
      </div>
    </div>
  );
}


export default function Playground(options) {

  const {
    container: parent,
    schema,
    data
  } = options;

  const emitter = mitt();

  let state = { data, schema };
  let ref;

  const container = document.createElement('div');

  container.classList.add('fjs-pgl-parent');

  parent.appendChild(container);

  const handleDrop = fileDrop('Drop a form file', function(files) {
    const file = files[0];

    if (file) {
      try {
        ref.setSchema(JSON.parse(file.contents));
      } catch (err) {

        // TODO(nikku): indicate JSON parse error
      }
    }
  });

  container.addEventListener('dragover', handleDrop);

  render(
    <PlaygroundRoot
      schema={ schema }
      data={ data }
      onStateChanged={ (_state) => state = _state }
      onInit={ _ref => ref = _ref }
    />,
    container
  );

  this.on = emitter.on;
  this.off = emitter.off;

  this.emit = emitter.emit;

  this.on('destroy', function() {
    render(null, container);
  });

  this.on('destroy', function() {
    parent.removeChild(container);
  });

  this.getState = function() {
    return state;
  };

  this.setSchema = function(schema) {
    return ref.setSchema(schema);
  };

  this.destroy = function() {
    this.emit('destroy');
  };
}


function toJSON(obj) {
  return JSON.stringify(obj, null, '  ');
}