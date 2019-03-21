import Chance from 'chance';
import _ from 'lodash';

/**
 * Create a factory function for generating dummy objects.
 *
 * @param {object} factories
 */
const createFactory = factories => {
    /**
     * Call a registered factory by name.
     * Specify attributes to override generated values.
     * If the second argument is a number, then create an array of objects.
     *
     * @param {string} name
     * @param {object|number} attributes
     */
    const factory = (name, attributes) => {
        if (factories.hasOwnProperty(name)) {
            const chance = new Chance();

            if (_.isNumber(attributes)) {
                return _.range(0, attributes).map(() => factories[name](chance));
            }

            return _.assign(factories[name](chance), attributes);
        }

        throw new Error(`Factory for "${name}" does not exist! Did you forget to register your factory?`);
    };

    return factory;
};

export default createFactory;
