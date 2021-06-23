/**
 * @file functions.spec.js
 * Unit/Integration tests for src/functions.js
 */

const {
    execCmd,
    npmView,
    relativeTime,
    flatten,
    getPackageName,
    fetchAll
} = require('../src/functions.js');

const test = require('ava');

test('execCmd echo pass', async t => {
    const res = await execCmd('echo "hello"');
    t.is(res.trim(), 'hello');
});

test('execCmd echo fail', async t => {
    const res = await execCmd('echo "bye" && exit 1');
    t.is(res.trim(), 'bye');
});

test('npmView', async t => {
    const res = await npmView('jest', ['dist-tags.latest', 'time.modified', 'homepage', '--json']);

    t.is(typeof res, 'string');
    const json = JSON.parse(res);

    t.is(typeof json, 'object');
    t.true('dist-tags.latest' in json);
    t.true('time.modified' in json);
    t.true('homepage' in json);
    t.regex(json['dist-tags.latest'], /^\d+\.\d+\.\d+$/);
});

test('relativeTime', t => {
    // mock Date
    Date._now = Date.now;
    const june18 = new Date('2021-06-18T12:00:00.000Z');
    Date.now = () => june18;

    t.is(relativeTime(june18 - 1000), 'less than a minute ago');
    t.is(relativeTime(june18 - 5 * 60 * 1000), '5 minutes ago');
    t.is(relativeTime(june18 - 4 * 60 * 60 * 1000), 'about 4 hours ago');
    t.is(relativeTime(june18 - 3 * 24 * 60 * 60 * 1000), '3 days ago');
    t.is(relativeTime(june18 - 60 * 24 * 60 * 60 * 1000), '2 months ago');
    t.is(relativeTime(june18 - 365 * 24 * 60 * 60 * 1000), 'about 1 year ago');

    Date.now = Date._now;
});

const input1 = {
    org: '',
    packages: [
        'ava'
    ]
};
const input2 = {
    org: '@myorg',
    packages: [
        'foo',
        'bar'
    ],
    private: true,
    icon: ':o:',
    url: 'example.com'
};
const input3 = {
    org: '@notarealorgnoway',
    packages: [
        'thisbetternotbereal'
    ]
};
const output1 = {
    icon: undefined,
    name: 'ava',
    org: '',
    private: undefined,
    url: undefined,
};
const output2 = {
    icon: ':o:',
    name: 'foo',
    org: '@myorg',
    private: true,
    url: 'example.com',
};
const output3 = {
    icon: ':o:',
    name: 'bar',
    org: '@myorg',
    private: true,
    url: 'example.com',
};

test('flatten', t => {
    const before = [input1, input2];
    const after = [output1, output2, output3];
    t.deepEqual(flatten(before), after);
});

test('getPackageName - undefined', t => {
    t.is(getPackageName(), undefined);
});

test('getPackageName - scoped', t => {
    const data = {
        org: '@myorg',
        name: 'foo'
    };
    t.is(getPackageName(data), '@myorg/foo');
});

test('getPackageName - unscoped 1', t => {
    const data = {
        org: '',
        name: 'foo'
    };
    t.is(getPackageName(data), 'foo');
});

test('getPackageName - unscoped 2', t => {
    const data = {
        name: 'foo'
    };
    t.is(getPackageName(data), 'foo');
});

for (const [title, input] of [
    ['undefined', undefined],
    ['no enabled', { disabled: [] }],
    ['empty enabled', { enabled: [] }]
]) {
    test(`fetchAll - ${title}`, async t => {
        const res1 = await fetchAll(input);
        t.true(Array.isArray(res1));
        t.is(res1.length, 1);
        t.true(res1[0] instanceof Error);
        t.is(res1[0].message, 'Invalid or empty config.enabled');
    });
}

test('fetchAll', async t => {
    const res = await fetchAll({ enabled: [input1, input3] });
    t.true(Array.isArray(res));
    t.is(res.length, 2);
    // Loosely compare res with objects (res values can vary):
    t.like(res[0], {
        data: {
            homepage: 'https://avajs.dev'
        },
        icon: undefined,
        name: 'ava',
        private: undefined,
        url: undefined
    });
    t.like(res[1], {
        error: {
            code: 'E404'
        },
        name: '@notarealorgnoway/thisbetternotbereal',
    });
});
