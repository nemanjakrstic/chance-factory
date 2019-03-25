# Chance Factory

## Usage

### 1. Create a Model Factory

`UserFactory.js`

```js
const UserFactory = chance => ({
    id: chance.integer(),
    name: chance.name(),
    email: chance.email(),
});

export default UserFactory;
```

### 2. Create the Factory and Register Your Model Factories

`factory.js`

```js
import createFactory from 'chance-factory';
import UserFactory from './UserFactory';
import RoleFactory from './RoleFactory';

const factory = createFactory({
    User: UserFactory,
    Role: RoleFactory,
});

export default factory;
```

### 3. Use the Factory to Generate Models

```js
import factory from './factory';

const user = factory('User');

console.log(user); // { id: 123, name: 'Random Name', email: 'random@email.com' }
```

#### Override Attributes

```js
import factory from './factory';

const user = factory('User', { name: 'John Doe' });

console.log(user); // { id: 123, name: 'John Doe', email: 'random@email.com' }
```

#### Create Multiple Models

```js
import factory from './factory';

const users = factory('User' 2);

console.log(users); // [{ id: 123, name: 'Random Name', email: 'random@email.com' }, { id: 456, name: 'John Doe', email: 'random@email.com' }]
```

## Chance Factory is Using Chance

Chance is a minimalist generator of random strings, numbers, etc. to help reduce some monotony particularly while writing automated tests or anywhere else you need anything random.

Homepage: [https://chancejs.com](https://chancejs.com).
