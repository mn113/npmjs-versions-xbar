/* eslint-env: node, es6 */

const path = require('path');

const parseDate = require('date-fns/parseJSON');
const timeAgo = require('date-fns/formatDistanceToNow');

const { execSync } = require("child_process");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// npm assumed to be globally installed at default OSX location - can be changed if needed
const npmPath = path.resolve('/usr/local/bin');

/**
 * Execute a generic shell command
 * @param {String} cmd
 * @returns {Promise<String>} output
 */
async function execCmd(cmd) {
    // default xbar shell won't have system PATH to find global npm
    const env = Object.assign({}, process.env);
    env.PATH = `${npmPath}:${env.PATH}`;

    const { stdout, stderr } = await exec(cmd, { env });

    return stdout || stderr;
}

/**
 * Run 'npm view' command on a package from the registry
 * @param {String} scopedPackage
 * @param {String} params
 * @returns {Promise<String>}
 */
async function npmView(scopedPackage, params) {
    return await execCmd(`npm view ${scopedPackage} ${params.join(' ')}`);
}

/**
 * Formats relative past time, e.g. 'about 3 hours ago'
 * @param {String} timestamp - ISO format
 * @returns {String}
 */
function relativeTime(timestamp) {
    return `${timeAgo(parseDate(timestamp))} ago`;
}

/**
 * Flatten a JSON structure to allow multiple orgs & repos to be processed as a flat array
 * @param {Object} json - typically direct from config file
 * @returns {String[]} - scoped package names
 * TODO: return object to preserve github and private properties
 */
function flatten(json) {
    return [].concat(...json.map(obj => {
        return obj.packages.map(packageName => `${obj.org}/${packageName}`);
    }));
}

/**
 * Start fetching repos data!
 * @param {Object} config - JSON, must match config structure
 * @returns {Promise<Object[]>}
 */
function fetchAll(config = {}) {
    if (!config.enabled || !config.enabled.length) {
        return Promise.resolve([
            new Error('Invalid or empty config.enabled')
        ]);
    }
    return Promise.all(
        flatten(config.enabled).map(async scopedPackage => {
            return await npmView(scopedPackage, ['dist-tags.latest', 'time.modified', 'homepage', '--json'])
                .then(result => {
                    result = JSON.parse(result);
                    return {
                        package: scopedPackage,
                        data: {
                            latest: result['dist-tags.latest'],
                            modified: relativeTime(result['time.modified']),
                            ghlink: result['homepage']
                        }
                    }
                });
        })
    );
};

module.exports = {
    fetchAll
};
