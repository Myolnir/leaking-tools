/**
 * Created by Myolnir on 17/2/17.
 */

'use strict';

const flat = require('flat');
const unflat = require('flat').unflatten;
let FILTERING_CHARACTER = '*****'

exports.init = init;
exports.filter = filter;

function init(config) {
    FILTERING_CHARACTER = config.characterToRepladeData;
}

function filter(dataToFilter, filteringFields) {
    let filterData = {};
    if (dataToFilter instanceof Array) {
        filterData = _filterArrayData(dataToFilter, filteringFields);
    } else {
        filterData = _filterNonArrayData(dataToFilter, filteringFields);
    }
    return filterData;
}


function _filterArrayData(dataToFilter, filteringFields) {
    let filterData = [];
    dataToFilter.forEach((arrayElement) => {
        let flattenElement = flat(arrayElement);
        flattenElement = _filterData(flattenElement, filteringFields);
        filterData.push(unflat(flattenElement));
    });
    return filterData;
}

function _filterNonArrayData(dataToFilter, filteringFields) {
    let flattenElement = flat(dataToFilter);
    flattenElement = _filterData(flattenElement, filteringFields);
    return unflat(flattenElement);
}

/**
 * Hide not allowed fields.
 * @param databaseData
 * @param filterData the blacklist of the fields that user cannot see.
 * @returns filtered data according with user role.
 * @private
 */
function _filterData(flattenElement, filteringFields) {
    for (let key in flattenElement) {
        let keyScaped = key.replace(/[0-9]/g, '').replace(/[.]{2,}/g, '.');
        keyScaped.endsWith(".") ?
            keyScaped = keyScaped.substring(0, keyScaped.length - 1)
            :
            keyScaped;
        if (filteringFields.length > 0 && !filteringFields.includes(keyScaped)) {
            flattenElement[key] = FILTERING_CHARACTER;
        }
    }
    return flattenElement;
}