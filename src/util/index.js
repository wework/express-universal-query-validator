/**
 * @module express-universal-query-validator/util
 * @description Utility functions needed for this module
 */

import url from 'url';
import { attempt, some, reject, isError } from 'lodash';

/**
 * Checks if a key=value param can not be
 * parsed by global `decodeURIComponent`
 * @param  {string} query
 * @returns {boolean} - did parsing throw?
 */
export function isUnparseableQuery(query = 'key=value') {
  return isError(attempt(decodeURIComponent, query));
}

/**
 * Are all queries parseable?
 * @param  {Array}  queries
 * @returns {boolean}
 */
export function validateQueryParams(queries = []) {
  return !some(queries, isUnparseableQuery);
}

/**
 * Returns input minus unparseable queries
 * @param  {Array}  queries
 * @returns {Array}
 */
export function dropInvalidQueryParams(queries = []) {
  return reject(queries, isUnparseableQuery);
}
