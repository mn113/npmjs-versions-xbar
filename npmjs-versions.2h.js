#!/usr/bin/env /usr/local/bin/node

/*
 * <xbar.title>NPMJS Versions</xbar.title>
 * <xbar.version>v0.0.1</xbar.version>
 * <xbar.author>M. Nicholson</xbar.author>
 * <xbar.author.github>mn113</xbar.author.github>
 * <xbar.image>https://github.com/mn113/npmjs-versions-xbar/blob/master/npmjs-versions-xbar1.png</xbar.image>
 * <xbar.desc>List NPMJS packages latest versions</xbar.desc>
 * <xbar.dependencies>node,octonode,dotenv</xbar.dependencies>
 * <xbar.abouturl>https://github.com/mn113/npmjs-versions-xbar</xbar.abouturl>
 */

const path = require('path');
const fs = require('fs');

const pkg = require('./package.json');
const config = require('./config.json');
const { fetchAll } = require('./functions.js');

// github icon codes
const MAIN_ICON = ':notebook:';
const ERROR_ICON = ':heavy_exclamation_mark:';
const PACKAGE_ICON = ':ballot_box_with_check:';
const PRIVATE_PACKAGE_ICON = ':lock:';

// Start menubar output (must come first):
// Set icon:
console.log(MAIN_ICON)
console.log("---");

// Preflight:
// Check if config.json already present, if not, duplicate config.json.dist:
function preflight() {
    return new Promise((resolve, reject) => {
        try {
            var configJsonPath = path.join(__dirname, 'config.json');
            fs.access(configJsonPath, fs.constants.F_OK, (err1) => {
                if (err1) {
                    fs.access(configJsonPath + '.dist', fs.constants.F_OK, (err2) => {
                        if (!err2) {
                            fs.copyFile(configJsonPath + '.dist', configJsonPath, () => {
                                resolve("Copied config.json.dist -> config.json");
                            });
                        }
                        else throw new Error("Please obtain config.json or config.json.dist from " + pkg.homepage);
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
 * Produce menubar output via console.log
 * @param {Object[]} packages
 */
function output(packages) {
    // Begin list:
    console.log(`${packages.length} npm packages defined:`);
    console.log("---");
    packages.forEach(package => {
        if (package && package.name) {
            let icon = '';
            let packageLine = '';

            // Begin line:
            if (package.data) {
                icon = package.icon || (package.private ? PRIVATE_PACKAGE_ICON : PACKAGE_ICON);
                packageLine += `${icon} ${package.name} : ${package.data.latest} : ${package.data.modified}`
                // Add link:
                if (package.data.homepage) {
                    packageLine += `|href=${package.data.homepage}`;
                } else if (package.github) {
                    packageLine += `|href=https://github.com/${package.github}`;
                }
            }
            else if (package.error) {
                icon = ERROR_ICON;
                packageLine += `${icon} ${package.error.code} : ${package.error.summary.split(/\n/)[0].slice(0,40)}|color=crimson`;
            }
            console.log(packageLine);
        }
        console.log("---");
    });
    // Menubar afters:
    console.log("Extra");
    console.log("--Reload plugin | refresh=true terminal=false");
    console.log("--Setup instructions");
    console.log("----1. npm needs to be installed globally");
    console.log("----2. To fetch private packages: set npm token in ~/.npmrc");
    console.log("----3. Configure your packages in config.json");
    console.log(`--Plugin v${pkg.version}`);
    console.log(`--Node ${process.version}`);
}

// Main:
preflight()
    .then(() => fetchAll(config))
    .then(results => output(results))
    .catch(console.log);
