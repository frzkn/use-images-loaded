/**
 * toCamel
 * @description Convert a snake string to camel case
 * @via https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
 */

export function toCamel(str) {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}