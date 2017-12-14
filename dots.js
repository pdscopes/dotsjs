var Dots = {
    /**
     * Covert HTML form notation to dot notation.
     * @function
     * @param {string} name HTML form notation
     * @return string Dot notation
     */
    convertTo: function (name) {
        return name.replace(/\[]/g, '.*').replace(/\[([^\]]+)]/g, '.$1');
    },
    /**
     * Convert dot notation to HTML form notation.
     * @function
     * @param {string} name Dot notation
     * @return string HTML form notation
     */
    convertFrom: function (name) {
        return name.replace(/\*/g, '').replace(/\.([^.]*)/g, '[$1]');
    },

    /**
     * Flatten a multi-dimensional object into a dots notation object.
     * @function
     * @param {Array|object} object  Object to be flattened
     * @param {object} results Object to insert elements
     * @param {string} prepend Prefix to be added
     * @returns {object}
     */
    implode: function (object, results, prepend) {
        prepend = typeof prepend === 'undefined' ? '' : prepend;
        results = typeof results === 'undefined' ? {} : results;

        for (var i in object) {
            if (!object.hasOwnProperty(i)) {
                continue;
            }

            if (typeof object[i] === 'object' && Object.keys(object[i]).length > 0) {
                results = Dots.implode(object[i], results, prepend+i+'.');
            } else {
                results[prepend+i] = object[i];
            }
        }

        return results;
    },
    /**
     * Expand a flat, dots notation object into a multi-dimensional object.
     * @function
     * @param {Array|object} object Object to be expanded
     * @returns {object}
     */
    explode: function (object) {
        var results = {};

        for (var i in object) {
            if (!object.hasOwnProperty(i)) {
                continue;
            }

            results = Dots.set(results, i, object[i]);
        }

        return results;
    },

    /**
     * Deep insert a dots notation key into an object.
     * @function
     * @param {object} object Object to add new key value pair
     * @param {string} key Dots notation key
     * @param {*} value Value
     * @returns {object}
     */
    set: function (object, key, value) {
        if (null === key) {
            return object = value;
        }

        var keys = key.split('.');
        var temp = object;

        for (var k=0; k<keys.length-1; k++) {
            key = keys[k];
            if (key === '*') {
                key = Object.keys(temp).length;
            }

            if (typeof temp[key] === 'undefined') {
                temp[key] = {};
            }

            temp = temp[key];
        }

        key = keys[k];
        if (key === '*') {
            key = Object.keys(temp).length;
        }
        temp[key] = value;

        return object;
    }
};