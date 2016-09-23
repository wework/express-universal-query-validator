/**
 * @module express-universal-query-validator
 * @description Express middleware to provide consistently parseable query parameters to universal applications
 */

import url from 'url';
import { difference } from 'lodash';
import * as helpers from './util/index.js';

const QUERY_DELIMITER = '&';

/**
 * Default callback behavior for the middleware
 * Can be replaced by passing a function argument in the
 * first position to `queryValidator`. It will receive the
 * same arguments.
 *
 * @param   {Object}          req
 * @param   {Object}          res
 * @param   {Function}        next
 * @param   {Object}          context
 * @param   {string}          context.delimiter
 * @param   {Error}           context.error
 * @param   {Array}           context.oldQuery
 * @param   {Array}           context.nextQuery
 * @param   {Array}           context.droppedParams
 * @returns {undefined}
 */
const defaultRedirect = (req, res, next, context = {}) => {
  const nextPath = `${req.path}?${context.nextQuery.join(context.delimiter)}`;
  console.error(`
Invalid query detected. Dropping unparseable params:
${'\t'}${context.droppedParams.join('\n\t')}
and redirecting to:
${'\t'}${nextPath}
`);

  res.redirect(nextPath);
  return;
};

/**
 * Create a middleware to validate queries are parseable by both the browser and node.
 * This should be mounted early.
 *
 * @param  {Function?} cb - called to handle invalid params. passed
 *                         `req`, `res`, `next` and a `context` object
 *                         containing useful data. The default behavior
 *                         is to `console.error` and `res.redirect`
 * @param  {Object?}  options
 * @param  {string?}  options.delimiter - query string delimiter
 * @returns {Function} middleware - the middleware function to use
 */
export default function queryValidator(cb = defaultRedirect, options = {}) {
  const delimiter = options.delimiter || QUERY_DELIMITER;

  /**
   * @param  {Object}   req
   * @param  {Response} res
   * @param  {Function} next
   * @returns {undefined}
   */
  return function middleware(req, res, next) {
    // In express, `req.query` has already been parsed by the `querystring` module,
    // parsing the raw query here is necessary to stay constent with a browser runtime
    const raw = url.parse(req.url, false).query || '';
    const oldQuery = raw.split(delimiter);

    // Skip valid queries
    if (!raw || helpers.validateQueryParams(oldQuery)) {
      next();
      return;
    }

    const nextQuery = helpers.dropInvalidQueryParams(oldQuery);
    const droppedParams = difference(oldQuery, nextQuery);
    const error = new Error('Invalid query param(s) detected');

    // This is passed into callback in 4th position
    // so users can customize behavior.
    const context = {
      delimiter,
      error,
      oldQuery,
      nextQuery,
      droppedParams
    };

    cb(req, res, next, context);
    return;
  };
}
