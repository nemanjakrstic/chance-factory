import { createFactory } from './createFactory';

test('should use default attributes', () => {
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        roles: [],
    }));

    const user = UserFactory.create();

    expect(user).toEqual({
        id: 1,
        name: 'John',
        roles: [],
    });
});

test('should provide chance instance to factory function', () => {
    const UserFactory = createFactory<User>((chance) => ({
        name: 'John',
        apiKey: chance.hash({ length: 24 }),
    }));

    const user = UserFactory.create();

    expect(user.apiKey.length).toEqual(24);
    expect(user.name).toEqual('John');
});

test('should override or add attributes', () => {
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
    }));

    const user = UserFactory.create({
        name: 'Jane',
        role: 'admin',
    });

    expect(user).toEqual({
        id: 1,
        name: 'Jane',
        role: 'admin',
    });
});

test('should override nested attributes using dot notation', () => {
    const RoleFactory = createFactory<Role>(() => ({
        name: 'admin',
    }));
    const UserFactory = createFactory<User>(() => ({
        name: 'John',
        role: RoleFactory.create(),
    }));

    const user = UserFactory.create({
        'role.name': 'editor',
    });

    expect(user).toEqual({
        name: 'John',
        role: { name: 'editor' },
    });
});

test('should evaluate attribute functions', () => {
    const now = Date.now();
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        createdAt: () => now,
    }));

    const user = UserFactory.create();

    expect(user).toEqual({
        id: 1,
        name: 'John',
        createdAt: now,
    });
});

test('should provide current attributes to attribute function', () => {
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        email: (user) => `${user.name.toLowerCase()}@email.com`, // Order matters. Needs to be after `name` attribute.
    }));

    const user = UserFactory.create();

    expect(user).toEqual({
        id: 1,
        name: 'John',
        email: 'john@email.com',
    });
});

test('should override with attribute functions', () => {
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        email: 'noreply@email.com',
    }));

    const user = UserFactory.create({
        email: (user) => `${user.name.toLowerCase()}@email.com`,
    });

    expect(user).toEqual({
        id: 1,
        name: 'John',
        email: 'john@email.com',
    });
});

test('should create nested factory objects', () => {
    const RoleFactory = createFactory<Role>(() => ({
        name: 'admin',
    }));
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        role: RoleFactory.create(),
    }));

    const user = UserFactory.create();

    expect(user).toEqual({
        id: 1,
        name: 'John',
        role: {
            name: 'admin',
        },
    });
});

test('should provide sequence when creating many', () => {
    const UserFactory = createFactory<User>(() => ({
        id: (user, sequence) => sequence, // Sequence will always be `1` when creating a single object.
        email: (user, sequence) => `email${sequence}@email.com`,
    }));

    const user = UserFactory.createMany(3);

    expect(user).toEqual([
        { id: 1, email: 'email1@email.com' },
        { id: 2, email: 'email2@email.com' },
        { id: 3, email: 'email3@email.com' },
    ]);
});

test('should override attributes when creating many', () => {
    const UserFactory = createFactory<User>(() => ({
        id: (user, sequence) => sequence, // Sequence will always be `1` when creating a single object.
        email: (user, sequence) => `email${sequence}@email.com`,
    }));

    const user = UserFactory.createMany(3, { name: 'Unknown' });

    expect(user).toEqual([
        { id: 1, email: 'email1@email.com', name: 'Unknown' },
        { id: 2, email: 'email2@email.com', name: 'Unknown' },
        { id: 3, email: 'email3@email.com', name: 'Unknown' },
    ]);
});

test('should create nested relationships', () => {
    const PermissionFactory = createFactory<Permission>(() => ({
        resource: (permission, sequence) => `order:${sequence}:create`,
    }));
    const RoleFactory = createFactory<Role>((chance) => ({
        name: 'admin',
        permissions: () => PermissionFactory.createMany(3, { allow: true }),
    }));
    const UserFactory = createFactory<User>(() => ({
        id: 1,
        name: 'John',
        role: RoleFactory.create(),
    }));

    const user = UserFactory.create();

    expect(user).toEqual({
        id: 1,
        name: 'John',
        role: {
            name: 'admin',
            permissions: [
                { allow: true, resource: 'order:1:create' },
                { allow: true, resource: 'order:2:create' },
                { allow: true, resource: 'order:3:create' },
            ],
        },
    });
});

interface Permission {
    allow: boolean;
    resource: string;
}

interface Role {
    name: string;
    permissions: Permission[];
}

interface User {
    id: number;
    name: string;
    email: string;
    apiKey: string;
    roles: Role[];
}
