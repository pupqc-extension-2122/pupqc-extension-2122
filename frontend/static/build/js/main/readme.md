# Custom Functions

## `uuid()`

Returns a short unique universal id

## `setHTMLContent(param1, param2)`

Set the inner HTML content of one or more selector.

```javascript
// Example 1
setHTMLContent('#user_name', 'John Doe');

// Example 2
setHTMLContent('#status', `
  <div class="badge badge-success">
    <i class="fas fa-check mr-1"></i>
    <span>Approved</span>
  </div>
`);

// Example 3
setHTMLContent('#dynamic_content', () => {
  // Some code here ...
  return /* The content you want to return */;
})
```

```javascript
// Example 1
setHTMLContent({
  '#first_name': 'John',
  '#middle_name': () => {
    if(middle_name) {
      return middle_name.charAt(0);
    } else {
      return '';
    }
  },
  '#last_name': `<span>${ last_name }</span>`
})
```

## `formatToPeso(value)`

Formats the value into peso, e.g. ₱xxx,xxx.xx

```javascript
console.log(formatToPeso(50)) // ₱50.00 
console.log(formatToPeso(12590.02)) // ₱12,590.02 
console.log(formatToPeso(1234567.89)) // ₱1,234,567.89 
```