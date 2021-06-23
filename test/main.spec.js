/**
 * @file main.spec.js
 * Unit/Integration tests for src/main.js
 */

const { output } = require('../src/main.js');

const test = require('ava');

// console.log collector
let logs = [];

test.before(() => {
    console._log = console.log;
    console.log = (...params) => { logs.push(params); };
});

test.beforeEach(() => {
    logs = [];
});

test.after.always(() => {
    console.log = console._log;
});

test('api', t => {
    t.is(typeof output, 'function');
});

test('output', t => {
    const input1 = {
        name: 'ava',
        data: {
            homepage: 'https://avajs.dev',
            latest: '3.0.5',
            modified: '1 month ago'
        },
        icon: undefined,
        private: undefined,
        url: undefined
    };
    const input2 = {
        name: '@myorg/foo',
        data: {
            latest: '0.6.9',
            modified: '1 week ago'
        },
        private: true,
        url: 'example.com'
    };
    const input3 = {
        name: '@myorg/bar',
        data: {
            latest: '1.2.3',
            modified: '17 minutes ago'
        },
        private: false,
        icon: ':o:',
        url: 'example.com'
    };
    const input4 = {
        name: '@myorg/bar',
        error: {
            code: 'E500',
            summary: 'Your mother was a hamster and your father smelled of elderberries!\nNi!'
        }
    };

    output([input1, input2, input3, input4]);

    t.is(logs.length, 18);
    t.snapshot(logs.slice(0, 16));
});
