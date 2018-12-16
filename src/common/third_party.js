// import specifc methods so we can reduce filesize and not import all of lodash
import get from 'lodash/get'
import has from 'lodash/has'
import set from 'lodash/set'
import uniq from 'lodash/uniq'
import pick from 'lodash/pick'
import forOwn from 'lodash/forOwn'
import reduce from 'lodash/reduce'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import merge from 'lodash/merge'
import identity from 'lodash/identity'
import isEmpty from 'lodash/isEmpty'
import difference from 'lodash/difference'
import includes from 'lodash/includes'
import intersection from 'lodash/intersection'
import isNil from 'lodash/isNil'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'

export const _ = {
    get,
    has,
    identity,
    set,
    uniq,
    pick,
    forOwn,
    reduce,
    omit,
    omitBy,
    pickBy,
    groupBy,
    sortBy,
    merge,
    isArray,
    isEmpty,
    includes,
    difference,
    intersection,
    filter,
    isNil,
    isObject,
    isFunction
}
