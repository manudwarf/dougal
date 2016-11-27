# Dougal Validations

## Validations overview

```javascript
var Employee = Dougal.Model.extends(function () {
  this.attribute('name');
  this.validates('name', {presence: true, message: 'Name is required'});
});

new Employee().isValid(); // false
new Employee({name: 'John Doe'}).isValid(); // true
```

Validations are automatically triggered when any property on the model changes.

### Errors

```javascript
var errors = new Employee().errors;
errors.any(); // true
errors.name; // ['Name is required']
```

### Saving

Saving require a valid model, otherwise a rejected promise will be returned:

```javascript
employee.save().catch(function (errors) {
  errors.name; // ['Name is required']
});
```

You can skip validations if you need to: `employee.save({validate: false})`

## Built in validations

### Length

```javascript
this.validates('name', {
  length: {minimum: 3},
  message: 'Name requires 3 characters'
});
this.name = 'hi';
this.errors.name; // ['Name requires 3 characters']
```

Available options:

* `is` matches exact length
* `maximum`
* `minimum`

### Presence

```javascript
this.validates('name', {presence: true, message: 'Name is required'});
this.name = '';
this.errors.name; // ['Name is required']
```

### Combine multiple validations

```javascript
this.validates('name', {
  presence: true,
  length: {minimum: 3},
  message: 'Name is required'
});
this.validates('name', {
  length: {maximum: 255},
  message: 'Name is too long'
});
```

## Custom validations

### Reusable validators

```javascript
var CustomValidator = Dougal.Validator.extends(function () {
  this.validate = function (record, attribute, value) {
    if (conditionNotMet) {
      this.errors.add('name', this.options.message);
    }
  };
});
this.validates('name', new CustomValidator({message: 'some message'}));
```

### Validation method

```javascript
this.validateName = function () {
  if (conditionNotMet) {
    this.errors.add('name', 'Condition not met');
  }
};
this.validates('name', 'validateName');
```