import Chance from 'chance';
import set from 'lodash/set';

type GetAttributeValue<T> = (attributes: T, sequence: number) => AttributeValue<T>;

type AttributeValue<T> = number | string | null | object | boolean | GetAttributeValue<T>;

type Attributes<T> = { [key: string]: AttributeValue<T> };

type Factory<T> = (chance: Chance.Chance) => Attributes<T>;

export const createFactory = <T>(factory: Factory<T>) => {
    const build = (chance: Chance.Chance, overrides?: Attributes<T>, sequence: number = 1): T => {
        const combinedAttributes = Object.assign(factory(chance), overrides);
        const output: any = {};

        for (const key in combinedAttributes) {
            const value = combinedAttributes[key];
            set(output, key, typeof value === 'function' ? value(output, sequence) : value);
        }

        return output as T;
    };

    const create = (overrides?: Attributes<T>): T => {
        const chance = new Chance();
        return build(chance, overrides);
    };

    const createMany = (count: number, attributes?: Attributes<T>): T[] => {
        const chance = new Chance();
        return Array.from({ length: count }, (value, index) => build(chance, attributes, index + 1));
    };

    return { create, createMany };
};
