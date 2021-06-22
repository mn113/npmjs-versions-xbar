/* eslint-env: node, es6 */

const path = require('path');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const parseDate = require('date-fns/parseJSON');
const timeAgo = require('date-fns/formatDistanceToNow');

// npm assumed to be globally installed at default OSX location - can be changed if needed
const npmPath = path.resolve('/usr/local/bin');

/**
 * @typedef {Object} PackageData
 * @property {String} name
 * @property {String} org
 * @property {Boolean} private
 * @property {String} icon
 * @property {String} url
 */

/**
 * Execute a generic shell command
 * @param {String} cmd
 * @returns {Promise<String>} output
 */
async function execCmd(cmd) {
    // default xbar shell won't have system PATH to find global npm
    const env = Object.assign({}, process.env);
    env.PATH = `${npmPath}:${env.PATH}`;

    // Since XBar wants text in all cases, return stdout regardless of pass or fail
    // But error must be caught to prevent early exit
    return await exec(cmd, { env })
        .then(result => result.stdout)
        .catch(error => error.stdout);
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
 * Format relative past time, e.g. 'about 3 hours ago'
 * @param {String} timestamp - ISO format
 * @returns {String}
 */
function relativeTime(timestamp) {
    return `${timeAgo(parseDate(timestamp))} ago`;
}

/**
 * Flatten a JSON structure to allow multiple orgs & repos to be processed as a flat array
 * @param {Object[]} json - typically direct from config file
 * @returns {PackageData[]} - individal package datas
 */
function flatten(json) {
    return [].concat(...json.map(obj => {
        return obj.packages.map(name => ({
            org: obj.org,
            private: obj.private,
            url: obj.url,
            icon: obj.icon,
            name
        }));
    }));
}

/**
 * Get the package name from the data
 * @param {PackageData} [packageData={}]
 * @returns {String} name of scoped or unscoped package
 */
function getPackageName(packageData = {}) {
    if (packageData.org && packageData.org.length) {
        return `${packageData.org}/${packageData.name}`;
    }
    return packageData.name;
}

/**
 * Start fetching data from registry
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
        flatten(config.enabled).map(async packageData => {
            const scopedPackageName = getPackageName(packageData);
            return await npmView(scopedPackageName, ['dist-tags.latest', 'time.modified', 'homepage', '--json'])
                .then(result => {
                    result = JSON.parse(result);
                    if (result.error) {
                        return {
                            name: scopedPackageName,
                            error: result.error
                        };
                    }
                    return {
                        name: scopedPackageName,
                        private: packageData.private,
                        icon: packageData.icon,
                        url: packageData.url,
                        data: {
                            latest: result['dist-tags.latest'],
                            modified: relativeTime(result['time.modified']),
                            homepage: result['homepage']
                        }
                    }
                });
        })
    );
};

module.exports = {
    execCmd,
    npmView,
    relativeTime,
    flatten,
    getPackageName,
    fetchAll
};
