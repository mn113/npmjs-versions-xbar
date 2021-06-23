/**
 * @file main.js
 * Main functions which provide the high-level plugin operations
 */

const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');

// github icon codes
const MAIN_ICON = ':notebook:';
const ERROR_ICON = ':heavy_exclamation_mark:';
const PACKAGE_ICON = ':ballot_box_with_check:';
const PRIVATE_PACKAGE_ICON = ':lock:';

/**
 * Plugin preflight:
 * Check if config.json already present, if not, duplicate config.json.dist
 * @returns {Promise}
 */
function preflight() {
    return new Promise((resolve, reject) => {
        try {
            const configJsonPath = path.join(__dirname, '..', 'config.json');
            const configJsonDistPath = `${configJsonPath}.dist`;
            fs.access(configJsonPath, fs.constants.F_OK, (err1) => {
                if (err1) {
                    fs.access(configJsonDistPath, fs.constants.F_OK, (err2) => {
                        if (!err2) {
                            fs.copyFile(configJsonDistPath, configJsonPath, () => {
                                resolve('Copied config.json.dist -> config.json');
                            });
                        }
                        else throw new Error(`Please obtain config.json or config.json.dist from ${pkg.homepage}`);
                    });
                }
                else resolve('ok');
            });
        } catch (err) {
            reject(err.message);
        }
    });
}

/**
 * Start menubar output (must come first):
 */
function header() {
    // Set icon:
    console.log(MAIN_ICON);
    console.log('---');
}

/**
 * Produce menubar output via console.log
 * @param {Object[]} packages
 */
function output(packages = []) {
    // Begin list:
    console.log(`${packages.length} npm packages defined:`);
    console.log('---');
    packages.forEach(package => {
        if (package && package.name) {
            let icon = '';
            let packageLine = '';

            // Begin line:
            if (package.data) {
                icon = package.icon || (package.private ? PRIVATE_PACKAGE_ICON : PACKAGE_ICON);
                packageLine += `${icon} ${package.name} : ${package.data.latest} : ${package.data.modified}`;
                // Add link:
                if (package.data.homepage) {
                    packageLine += `|href=${package.data.homepage}`;
                } else if (package.url) {
                    packageLine += `|href=${package.url}`;
                }
            }
            else if (package.error) {
                icon = ERROR_ICON;
                packageLine += `${icon} ${package.error.code} : ${package.error.summary.split(/\n/)[0].slice(0,40)}|color=crimson`;
            }
            console.log(packageLine);
        }
        console.log('---');
    });
    // Menubar afters:
    console.log('Extra');
    console.log('--Reload plugin | refresh=true terminal=false');
    console.log('--Setup instructions');
    console.log('----1. npm needs to be installed globally');
    console.log('----2. To fetch private packages: set npm token in ~/.npmrc');
    console.log('----3. Configure your packages in config.json');
    console.log(`--Plugin v${pkg.version}`);
    console.log(`--Node ${process.version}`);
}

module.exports = {
    preflight,
    header,
    output
};
