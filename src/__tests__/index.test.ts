import createFactory, { ObjectFactory } from '../index';

it('creates a factory', () => {
    const UserFactory: ObjectFactory = (chance) => ({
        id: chance.hash({ length: 24 }),
        name: chance.name(),
    });

    const factory = createFactory({
        User: UserFactory,
    });

    const user = factory('User', { name: 'Nemanja' });
    expect(user.id.length).toEqual(24);
    expect(user.name).toEqual('Nemanja');
});
