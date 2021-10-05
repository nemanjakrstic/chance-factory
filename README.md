# Chance Factory

## Installation

```bash
$ npm install -D chance-factory
```

## Usage

### Simple Factory

```js
const User = createFactory(() => ({
    id: 1,
    name: 'John',
}));

const user = User.create();

expect(user).toEqual({
    id: 1,
    name: 'John',
});
```

### Generate Random Data with Chance

```js
const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
    email: chance.email(),
}));

const user = User.create();

expect(user).toEqual({
    id: 123,
    name: 'Random Name',
    email: 'random@email.com',
});
```

### Override Attributes

```js
const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
    email: chance.email(),
}));

const user = User.create({ email: 'primary@email.com' });

expect(user).toEqual({
    id: 123,
    name: 'Random Name',
    email: 'primary@email.com',
});
```

### Access Current Attributes

Order matters. Attribute `email` needs to be after the `name` attribute.

```js
const User = createFactory((chance) => ({
    id: chance.integer(),
    name: 'John',
    email: (user) => `${user.name.toLowerCase()}@email.com`,
}));

const users = User.create();

expect(users).toEqual({
    id: 123,
    name: 'John',
    email: 'john@email.com',
});
```

### Nested Factories

```js
const Role = createFactory((chance) => ({
    name: chance.word(),
}));

const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
    role: Role.create(),
}));

const user = User.create();

expect(user).toEqual({
    id: 123,
    name: 'Random Name',
    role: { name: 'random-word' },
});
```

### Override Nested Attributes using Dot Notation

```js
const Role = createFactory((chance) => ({
    name: chance.name(),
}));

const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
    role: Role.create(),
}));

const user = User.create({ 'role.name': 'Admin' });

expect(user).toEqual({
    id: 123,
    name: 'Random Name',
    role: { name: 'Admin' },
});
```

### Create Multiple Objects

```js
const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
}));

const users = User.createMany(3);

expect(users).toEqual([
    { id: 123, name: 'Random Name 1' },
    { id: 456, name: 'Random Name 2' },
    { id: 789, name: 'Random Name 3' },
]);
```

### Override Attributes on Multiple Objects

```js
const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
}));

const users = User.createMany(3, { name: 'John Doe' });

expect(users).toEqual([
    { id: 123, name: 'John Doe' },
    { id: 456, name: 'John Doe' },
    { id: 789, name: 'John Doe' },
]);
```

### Create Multiple of Nested Objects

```js
const Role = createFactory((chance) => ({
    name: chance.word(),
}));

const User = createFactory((chance) => ({
    id: chance.integer(),
    name: chance.name(),
    roles: Role.createMany(3),
}));

const user = User.create();

expect(user).toEqual({
    id: 123,
    name: 'Random Name',
    roles: [{ name: 'random-word-1' }, { name: 'random-word-2' }, { name: 'random-word-3' }],
});
```

### Generate Sequenced Data

```js
const User = createFactory((chance) => ({
    id: (user, sequence) => sequence,
    email: (user, sequence) => `email${sequence}@email.com`,
}));

const users = User.createMany(3);

expect(users).toEqual([
    { id: 1, email: 'email1@email.com' },
    { id: 2, email: 'email2@email.com' },
    { id: 3, email: 'email3@email.com' },
]);
```

## Chance Factory is Using Chance

Chance is a minimalist generator of random strings, numbers, etc. to help reduce some monotony particularly while writing automated tests or anywhere else you need anything random.

Homepage: [https://chancejs.com](https://chancejs.com).
