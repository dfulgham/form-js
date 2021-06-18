export function arrayAdd(array, index, item) {
  array.splice(index, 0, item);

  return array;
}

export { mutate as arrayMove } from 'array-move';

export function arrayRemove(array, index) {
  array.splice(index, 1);

  return array;
}

export function updatePath(formFieldRegistry, formField, index) {
  const parent = formFieldRegistry.get(formField.parent);

  formField.path = [ ...parent.path, 'components', index ];

  return formField;
}