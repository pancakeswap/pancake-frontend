import merge from 'merge'
import mpService from '@binance/mp-service'

const MODULE_NAME = '[Redux-LocalStorage-Simple]'
const NAMESPACE_DEFAULT = 'redux_localstorage_simple'
const NAMESPACE_SEPARATOR_DEFAULT = '_'
const STATES_DEFAULT = []
const IGNORE_STATES_DEFAULT = []
const DEBOUNCE_DEFAULT = 0
const IMMUTABLEJS_DEFAULT = false
const DISABLE_WARNINGS_DEFAULT = false
let debounceTimeout = null

// ---------------------------------------------------
/* warn
  DESCRIPTION
  ----------
  Write a warning to the console if warnings are enabled
  PARAMETERS
  ----------
  @disableWarnings (Boolean) - If set to true then the warning is not written to the console
  @warningMessage (String) - The message to write to the console
*/

function warnConsole(warningMessage) {
  console.warn(MODULE_NAME, warningMessage)
}

function warnSilent(_warningMessage) {
  // Empty
}

const warn = (disableWarnings) => (disableWarnings ? warnSilent : warnConsole)

// ---------------------------------------------------
/* lensPath
  DESCRIPTION
  ----------
  Gets inner data from an object based on a specified path
  PARAMETERS
  ----------
  @path (Array of Strings) - Path used to get an object's inner data
                              e.g. ['prop', 'innerProp']
  @obj (Object) - Object to get inner data from
  USAGE EXAMPLE
  -------------
  lensPath(
    ['prop', 'innerProp'],
    { prop: { innerProp: 123 } }
  )
    returns
  123
*/

function lensPath(path, obj) {
  if (obj === undefined) {
    return null
  } else if (path.length === 1) {
    return obj[path[0]]
  } else {
    return lensPath(path.slice(1), obj[path[0]])
  }
}

// ---------------------------------------------------
/* realiseObject
  DESCRIPTION
  ----------
  Create an object from a specified path, with
  the innermost property set with an initial value
  PARAMETERS
  ----------
  @objectPath (String) - Object path e.g. 'myObj.prop1.prop2'
  @objectInitialValue (Any, optional) - Value of the innermost property once object is created
  USAGE EXAMPLE
  -------------
  realiseObject('myObj.prop1.prop2', 123)
    returns
  {
    myObj: {
      prop1: {
          prop2: 123
        }
      }
  }
*/

function realiseObject(objectPath, objectInitialValue = {}) {
  function realiseObject_(objectPathArr, objectInProgress) {
    if (objectPathArr.length === 0) {
      return objectInProgress
    } else {
      return realiseObject_(objectPathArr.slice(1), { [objectPathArr[0]]: objectInProgress })
    }
  }
  return realiseObject_(objectPath.split('.').reverse(), objectInitialValue)
}

// ---------------------------------------------------
// SafeLocalStorage wrapper to handle the minefield of exceptions
// that localStorage can throw. JSON.parse() is handled here as well.

function SafeLocalStorage(warnFn) {
  this.warnFn = warnFn || warnConsole
}

Object.defineProperty(SafeLocalStorage.prototype, 'length', {
  get: function length() {
    try {
      return mpService.getStorageInfoSync().keys.length
    } catch (err) {
      this.warnFn(err)
    }
    return 0
  },
  configurable: true,
  enumerable: true,
})

SafeLocalStorage.prototype.key = function key(ind) {
  try {
    return mpService.getStorageInfoSync().keys[ind]
  } catch (err) {
    this.warnFn(err)
  }
  return null
}

SafeLocalStorage.prototype.setItem = function setItem(key, val) {
  try {
    mpService.setStorageSync(key, JSON.stringify(val))
  } catch (err) {
    this.warnFn(err)
  }
}

SafeLocalStorage.prototype.getItem = function getItem(key) {
  try {
    return JSON.parse(mpService.getStorageSync(key))
  } catch (err) {
    this.warnFn(err)
  }
  return null
}

SafeLocalStorage.prototype.removeItem = function removeItem(key) {
  try {
    mpService.removeStorageSync(key)
  } catch (err) {
    this.warnFn(err)
  }
}

// ---------------------------------------------------

/**
  Saves specified parts of the Redux state tree into localstorage
  Note: this is Redux middleware. Read this for an explanation:
  http://redux.js.org/docs/advanced/Middleware.html
  PARAMETERS
  ----------
  @config (Object) - Contains configuration options (leave blank to save entire state tree to localstorage)
            Properties:
              states (Array of Strings, optional) - States to save e.g. ['user', 'products']
              namespace (String, optional) - Namespace to add before your LocalStorage items
              debounce (Number, optional) - Debouncing period (in milliseconds) to wait before saving to LocalStorage
                                            Use this as a performance optimization if you feel you are saving
                                            to LocalStorage too often. Recommended value: 500 - 1000 milliseconds
  USAGE EXAMPLES
  -------------
    // save entire state tree - EASIEST OPTION
    save()
    // save specific parts of the state tree
    save({
      states: ['user', 'products']
    })
    // save the entire state tree under the namespace 'my_cool_app'. The key 'my_cool_app' will appear in LocalStorage
    save({
      namespace: 'my_cool_app'
    })
    // save the entire state tree only after a debouncing period of 500 milliseconds has elapsed
    save({
      debounce: 500
    })
    // save specific parts of the state tree with the namespace 'my_cool_app'. The keys 'my_cool_app_user' and 'my_cool_app_products' will appear in LocalStorage
    save({
        states: ['user', 'products'],
        namespace: 'my_cool_app',
        debounce: 500
    })
*/

export function save({
  states = STATES_DEFAULT,
  ignoreStates = IGNORE_STATES_DEFAULT,
  namespace = NAMESPACE_DEFAULT,
  namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT,
  debounce = DEBOUNCE_DEFAULT,
  disableWarnings = DISABLE_WARNINGS_DEFAULT,
} = {}) {
  return (store) => (next) => (action) => {
    // Bake disableWarnings into the warn function
    const warn_ = warn(disableWarnings)

    const returnValue = next(action)
    let state_

    // Validate 'states' parameter
    if (!isArray(states)) {
      console.error(
        MODULE_NAME,
        "'states' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method.",
      )
      states = STATES_DEFAULT
    }

    // Validate 'ignoreStates' parameter
    if (!isArray(ignoreStates)) {
      console.error(
        MODULE_NAME,
        "'ignoreStates' parameter in 'save()' method was passed a non-array value. Setting default value instead. Check your 'save()' method.",
      )
      ignoreStates = IGNORE_STATES_DEFAULT
    }

    // Validate individual entries in'ignoreStates' parameter
    if (ignoreStates.length > 0) {
      ignoreStates = ignoreStates.filter(function (ignoreState) {
        if (!isString(ignoreState)) {
          console.error(
            MODULE_NAME,
            "'ignoreStates' array contains a non-string value. Ignoring this value. Check your 'ignoreStates' array.",
          )
        } else {
          return ignoreState
        }
      })
    }

    // Validate 'namespace' parameter
    if (!isString(namespace)) {
      console.error(
        MODULE_NAME,
        "'namespace' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method.",
      )
      namespace = NAMESPACE_DEFAULT
    }

    // Validate 'namespaceSeparator' parameter
    if (!isString(namespaceSeparator)) {
      console.error(
        MODULE_NAME,
        "'namespaceSeparator' parameter in 'save()' method was passed a non-string value. Setting default value instead. Check your 'save()' method.",
      )
      namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT
    }

    // Validate 'debounce' parameter
    if (!isInteger(debounce)) {
      console.error(
        MODULE_NAME,
        "'debounce' parameter in 'save()' method was passed a non-integer value. Setting default value instead. Check your 'save()' method.",
      )
      debounce = DEBOUNCE_DEFAULT
    }

    // Check if there are states to ignore
    if (ignoreStates.length > 0) {
      state_ = handleIgnoreStates(ignoreStates, store.getState())
    } else {
      state_ = store.getState()
    }

    const storage = new SafeLocalStorage(warn_)

    // Check to see whether to debounce LocalStorage saving
    if (debounce) {
      // Clear the debounce timeout if it was previously set
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      // Save to LocalStorage after the debounce period has elapsed
      debounceTimeout = setTimeout(function () {
        _save(states, namespace)
      }, debounce)
      // No debouncing necessary so save to LocalStorage right now
    } else {
      _save(states, namespace)
    }

    // Digs into rootState for the data to put in LocalStorage
    function getStateForLocalStorage(state, rootState) {
      const delimiter = '.'

      if (state.split(delimiter).length > 1) {
        return lensPath(state.split(delimiter), rootState)
      } else {
        return lensPath([state], rootState)
      }
    }

    // Local function to avoid duplication of code above
    function _save() {
      if (states.length === 0) {
        storage.setItem(namespace, state_)
      } else {
        states.forEach((state) => {
          const key = namespace + namespaceSeparator + state
          const stateForLocalStorage = getStateForLocalStorage(state, state_)
          if (stateForLocalStorage) {
            storage.setItem(key, stateForLocalStorage)
          } else {
            // Make sure nothing is ever saved for this incorrect state
            storage.removeItem(key)
          }
        })
      }
    }

    return returnValue
  }
}

/**
  Loads specified states from localstorage into the Redux state tree.
  PARAMETERS
  ----------
  @config (Object) - Contains configuration options (leave blank to load entire state tree, if it was saved previously that is)
            Properties:
              states (Array of Strings, optional) - Parts of state tree to load e.g. ['user', 'products']
              namespace (String, optional) - Namespace required to retrieve your LocalStorage items, if any
  Usage examples:
    // load entire state tree - EASIEST OPTION
    load()
    // load specific parts of the state tree
    load({
      states: ['user', 'products']
    })
    // load the entire state tree which was previously saved with the namespace "my_cool_app"
    load({
      namespace: 'my_cool_app'
    })
    // load specific parts of the state tree which was previously saved with the namespace "my_cool_app"
    load({
        states: ['user', 'products'],
        namespace: 'my_cool_app'
    })
*/

export function load({
  states = STATES_DEFAULT,
  immutablejs = IMMUTABLEJS_DEFAULT,
  namespace = NAMESPACE_DEFAULT,
  namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT,
  preloadedState = {},
  disableWarnings = DISABLE_WARNINGS_DEFAULT,
} = {}) {
  // Bake disableWarnings into the warn function
  const warn_ = warn(disableWarnings)

  // Validate 'states' parameter
  if (!isArray(states)) {
    console.error(
      MODULE_NAME,
      "'states' parameter in 'load()' method was passed a non-array value. Setting default value instead. Check your 'load()' method.",
    )
    states = STATES_DEFAULT
  }

  // Validate 'namespace' parameter
  if (!isString(namespace)) {
    console.error(
      MODULE_NAME,
      "'namespace' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method.",
    )
    namespace = NAMESPACE_DEFAULT
  }

  // Validate 'namespaceSeparator' parameter
  if (!isString(namespaceSeparator)) {
    console.error(
      MODULE_NAME,
      "'namespaceSeparator' parameter in 'load()' method was passed a non-string value. Setting default value instead. Check your 'load()' method.",
    )
    namespaceSeparator = NAMESPACE_SEPARATOR_DEFAULT
  }

  // Display immmutablejs deprecation notice if developer tries to utilise it
  if (immutablejs === true) {
    warn_(
      'Support for Immutable.js data structures has been deprecated as of version 2.0.0. Please use version 1.4.0 if you require this functionality.',
    )
  }

  const storage = new SafeLocalStorage(warn_)

  let loadedState = preloadedState

  // Load all of the namespaced Redux data from LocalStorage into local Redux state tree
  if (states.length === 0) {
    const val = storage.getItem(namespace)
    if (val) {
      loadedState = val
    }
  } else {
    // Load only specified states into the local Redux state tree
    states.forEach(function (state) {
      const key = namespace + namespaceSeparator + state
      const val = storage.getItem(key)
      if (val) {
        loadedState = merge.recursive(loadedState, realiseObject(state, val))
      } else {
        warn_(
          "Invalid load '" +
            key +
            "' provided. Check your 'states' in 'load()'. If this is your first time running this app you may see this message. To disable it in future use the 'disableWarnings' flag, see documentation.",
        )
      }
    })
  }

  return loadedState
}

/**
  Combines multiple 'load' method calls to return a single state for use in Redux's createStore method.
  Use this when parts of the loading process need to be handled differently e.g. some parts of your state tree use different namespaces
  PARAMETERS
  ----------
  @loads - 'load' method calls passed into this method as normal arguments
  Usage example:
    // Load parts of the state tree saved with different namespaces
    combineLoads(
        load({ states: ['user'], namespace: 'account_stuff' }),
        load({ states: ['products', 'categories'], namespace: 'site_stuff' )
    )
*/

export function combineLoads(...loads) {
  let combinedLoad = {}

  loads.forEach((load) => {
    // Make sure current 'load' is an object
    if (!isObject(load)) {
      console.error(
        MODULE_NAME,
        "One or more loads provided to 'combineLoads()' is not a valid object. Ignoring the invalid load/s. Check your 'combineLoads()' method.",
      )
      load = {}
    }

    for (let state in load) {
      combinedLoad[state] = load[state]
    }
  })

  return combinedLoad
}

/**
  Clears all Redux state tree data from LocalStorage
  Remember to provide a namespace if you used one during the save process
  PARAMETERS
  ----------
  @config (Object) -Contains configuration options (leave blank to clear entire state tree from LocalStorage, if it was saved without a namespace)
            Properties:
              namespace (String, optional) - Namespace that you used during the save process
  Usage example:
    // clear all Redux state tree data saved without a namespace
    clear()
    // clear Redux state tree data saved with a namespace
    clear({
      namespace: 'my_cool_app'
    })
*/

export function clear({ namespace = NAMESPACE_DEFAULT, disableWarnings = DISABLE_WARNINGS_DEFAULT } = {}) {
  // Bake disableWarnings into the warn function
  const warn_ = warn(disableWarnings)

  // Validate 'namespace' parameter
  if (!isString(namespace)) {
    console.error(
      MODULE_NAME,
      "'namespace' parameter in 'clear()' method was passed a non-string value. Setting default value instead. Check your 'clear()' method.",
    )
    namespace = NAMESPACE_DEFAULT
  }

  const storage = new SafeLocalStorage(warn_)

  const len = storage.length
  for (let ind = 0; ind < len; ind++) {
    const key = storage.key(ind)

    // key starts with namespace
    if (key && key.slice(0, namespace.length) === namespace) {
      storage.removeItem(key)
    }
  }
}

// ---------------------------------------------------
// Utility functions

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

function isString(value) {
  return typeof value === 'string'
}

function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
}

function isObject(value) {
  return value !== null && typeof value === 'object'
}

// Removes ignored states from the main state object
function handleIgnoreStates(ignoreStates, stateFull) {
  let stateFullMinusIgnoreStates = Object.entries(stateFull).reduce(function (acc, [key, value]) {
    if (ignoreStates.indexOf(key) === -1) {
      acc[key] = stateFull[key]
    }
    return acc
  }, {})
  return stateFullMinusIgnoreStates
}
