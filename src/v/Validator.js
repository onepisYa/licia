/* Object values validation.
 *
 * ### constructor
 *
 * |Name   |Desc                    |
 * |-------|------------------------|
 * |options|Validation configuration|
 *
 * ### validate
 *
 * Validate object.
 *
 * |Name  |Desc                            |
 * |------|--------------------------------|
 * |obj   |Object to validate              |
 * |return|Validation result, true means ok|
 *
 * ### addPlugin
 *
 * [static] Add plugin.
 *
 * |Name  |Desc              |
 * |------|------------------|
 * |name  |Plugin name       |
 * |plugin|Validation handler|
 *
 * ### Default Plugins
 *
 * Required, number, boolean, string and regexp.
 */

/* example
 * Validator.addPlugin('custom', function (val, key, config) {
 *     if (typeof val === 'string' && val.length === 5) return true;
 *
 *     return key + ' should be a string with length 5';
 * });
 * const validator = new Validator({
 *     'test': {
 *         required: true,
 *         custom: true
 *     }
 * });
 * validator.validate({}); // -> 'test is required'
 * validator.validate({test: 1}); // -> 'test should be a string with length 5';
 * validator.validate({test: 'licia'}); // -> true
 */

/* module
 * env: all
 */

/* typescript
 * export declare class Validator {
 *     constructor(options: { [name: string]: any });
 *     validate(object: any): string | boolean;
 *     static plugins: any;
 *     static addPlugin(name: string, plugin: Function): void;
 * }
 */

_('Class keys safeGet isFn isUndef isNum isStr isBool');

exports = Class(
    {
        className: 'Validator',
        initialize(options) {
            this._options = options;
            this._optKeys = keys(options);
        },
        validate(obj) {
            obj = obj || {};

            const options = this._options;
            const objKeys = this._optKeys;

            for (let i = 0, len = objKeys.length; i < len; i++) {
                const key = objKeys[i];

                const result = this._validateVal(
                    safeGet(obj, key),
                    options[key],
                    key
                );

                if (result !== true) return result;
            }

            return true;
        },
        _validateVal(val, rules, objKey) {
            const plugins = exports.plugins;

            if (isFn(rules)) return rules(val);

            const ruleKeys = keys(rules);

            for (let i = 0, len = ruleKeys.length; i < len; i++) {
                const key = ruleKeys[i];
                const config = rules[key];
                let result = true;

                if (isFn(config)) result = config(val, objKey);

                const plugin = plugins[key];
                if (plugin) result = plugin(val, objKey, config);

                if (result !== true) return result;
            }

            return true;
        }
    },
    {
        plugins: {
            required(val, key, config) {
                if (config && isUndef(val)) return key + ' is required';

                return true;
            },
            number(val, key, config) {
                if (config && !isUndef(val) && !isNum(val))
                    return key + ' should be a number';

                return true;
            },
            boolean(val, key, config) {
                if (config && !isUndef(val) && !isBool(val))
                    return key + ' should be a boolean';

                return true;
            },
            string(val, key, config) {
                if (config && !isUndef(val) && !isStr(val))
                    return key + ' should be a string';

                return true;
            },
            regexp(val, key, config) {
                if (isStr(val) && !config.test(val))
                    return (
                        key + ' should match given regexp ' + config.toString()
                    );

                return true;
            }
        },
        addPlugin(name, plugin) {
            exports.plugins[name] = plugin;
        }
    }
);
