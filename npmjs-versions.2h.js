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

// Begin plugin output:
// Set icon:
console.log(':notebook:')
console.log("---");

// Preflight:
// Check if config.json already present, if not, duplicate config.json.dist:
function preflight() {
    return new Promise((resolve,reject) => {
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
        } catch(err) {
            reject(err.message);
        }
    });
}

// Principal output:
function output([displayRepos]) {
    console.log(`${displayRepos.length} npm packages defined:`);
    console.log("---");
    displayRepos.forEach(repo => {
        if (repo && repo.package && repo.data) {
            let repoLine = `- ${repo.package} : ${repo.data.latest} : ${repo.data.modified}`;
            if (repo.data.ghlink) {
                repoLine += `|href=${repo.data.ghlink}`;
            }
            console.log(repoLine);
        }
        else if (repo instanceof Error) {
            console.log(`Error: ${repo.message}|color=crimson`);
        }
        console.log("---");
    });
    // Menubar afters:
    console.log("Extra");
    console.log("--Reload plugin | refresh=true terminal=false");
    console.log("--Setup instructions");
    console.log("----1. npm needs to be installed globally");
    console.log("----2. To fetch private packages: npm login or set npm token in ~/.npmrc");
    console.log("----3. Set your packages in config.json");
    console.log(`--Plugin v${pkg.version}`);
    console.log(`--Node ${process.version}`);
}

// Main:
preflight()
    .then(() => {
        return Promise.all([
            fetchAll(config)
        ]);
    })
    .then(output)
    .catch(console.log);
