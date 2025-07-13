# Pebbles Project Summary

This document provides a summary of the Pebbles project, a utility library for both frontend and backend development.

## Project Overview

Pebbles is a TypeScript-based project that offers a collection of utility modules to streamline common development tasks. The project is well-structured, with each utility module residing in its own directory, complete with its own tests.

## Key Technologies

- **Language:** TypeScript
- **Testing:** Jest
- **Linting:** ESLint
- **Formatting:** Prettier

## Core Modules

The project is composed of the following utility modules:

- **array-util:** Provides functions for array manipulation, such as `innerJoin` and `leftJoin`.
- **boolean-util:** Includes functions for boolean parsing, such as `parseBoolean`.
- **crypto-util:** Offers cryptographic functions like `sha256`, `createAesKey`, and base64 encoding/decoding.
- **date-util:** A comprehensive module for date and time manipulation, including formatting, parsing, and calculations.
- **exception:** A set of custom exception classes for handling various error scenarios, categorized into client and server exceptions.
- **http-client:** A wrapper around an HTTP client (likely `axios`) to simplify making HTTP requests.
- **logger:** A logging framework that provides a `LoggerFactory` for creating logger instances.
- **map-util:** Includes functions for grouping and keying data, such as `groupBy` and `groupByKey`.
- **misc-util:** A collection of miscellaneous utility functions, such as `getPagination`, `getRandomInt`, and `sleep`.
- **money-util:** Provides functions for currency formatting, such as `convertLocalCurrencyFormat`.
- **number-util:** Offers functions for number manipulation, including decimal rounding and checking for numeric values.
- **object-util:** A rich module for object operations, such as `deepClone`, `isEmpty`, `isEqualObject`, `merge`, `omit`, and `pick`.
- **search-util:** Includes a `binarySearch` function for efficient searching in sorted arrays.
- **string-util:** Provides a wide range of string manipulation functions, including `compactTextMessage`, `isValidEmail`, `maskPrivacy`, and `renderTemplate`.
- **time-range:** A `TimeRange` class for working with time intervals.
- **type-util:** Contains utility types and functions for working with TypeScript types.
- **unit-util:** Offers unit conversion utilities, such as `byteUnitConverter` and `moneyUnitConverter`.

## Scripts

The `package.json` file defines the following scripts:

- `build`: Compiles the TypeScript code.
- `clean`: Removes the `coverage`, `lib`, and `node_modules` directories.
- `lint`: Lints the source code using ESLint.
- `test`: Runs the tests using Jest.

## Dependencies

The project has the following key dependencies:

- **axios:** A promise-based HTTP client for the browser and Node.js.
- **mustache:** A logic-less template engine.
- **pino:** A fast, low-overhead logger.
