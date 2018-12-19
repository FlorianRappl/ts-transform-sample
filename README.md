# TypeScript Transforms Example

A simple example illustrating the possibility of transforming source code during compile-time in TypeScript. The example tries to implement a very simple system for retrieving runtime-type information (RTTI).

## Status

The example is currently only consisting of a method to store trivial type information. The scope was limited to only interfaces, even though some other types (e.g., primitives such as `string`) would work as well. Recursive type references will not work in this implementation.

## Running

Clone the repository, `npm install` to resolve the dependencies. A sample file (*sample.ts*) can be found in the root directory. Running `npm start` will "build" this file. Viewing the generated file (see *dist/sample.js*) shows how the result of transformation looks like.
