import { generateRtti } from './src';

interface Bar {
  id: string;
}

interface Foo {
  id: string;
  foo: {
    bar: Bar;
    qxz: number;
  };
}

generateRtti<Foo>();
