import Chance from 'chance';
import _ from 'lodash';

export type Factory = (name: string, attributes: Attributes) => any;
export type ArrayFactory = (name: string, attributes: Attributes, count: number) => any[];
export type ObjectFactory = (chance: Chance.Chance, factory: Factory | ArrayFactory) => Object;
export type Attributes = Object | ObjectFactory;

interface FactoriesMap {
    [name: string]: ObjectFactory;
}

/**
 * Create a factory function for generating dummy objects.
 */
const createFactory = (factories: FactoriesMap) => {
    /**
     * Call a registered factory by name.
     * Specify attributes to override generated values.
     */
    const factory = (name: string, attributes: Attributes = {}, count?: number): any => {
        if (factories.hasOwnProperty(name)) {
            const chance = new Chance();

            const create = (): Object => {
                const attrs = typeof attributes === 'function' ? attributes(chance, factory) : attributes;
                return _.assign(factories[name](chance, factory), attrs);
            };

            if (count) {
                return _.range(0, count).map(create);
            }

            return create();
        }

        throw new Error(`Factory for "${name}" does not exist! Did you forget to register your factory?`);
    };

    return factory;
};

export default createFactory;
