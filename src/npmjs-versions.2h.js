#!/usr/bin/env /usr/local/bin/node

/*
 * <xbar.title>NPMJS Versions</xbar.title>
 * <xbar.version>v0.1.0</xbar.version>
 * <xbar.author>M. Nicholson</xbar.author>
 * <xbar.author.github>mn113</xbar.author.github>
 * <xbar.image>https://github.com/mn113/npmjs-versions-xbar/blob/master/npmjs-versions-xbar1.png</xbar.image>
 * <xbar.desc>List NPM packages latest versions</xbar.desc>
 * <xbar.dependencies>node npm date-fns</xbar.dependencies>
 * <xbar.abouturl>https://github.com/mn113/npmjs-versions-xbar</xbar.abouturl>
 */

const { preflight, header, output } = require('./main.js');
const { fetchAll } = require('./functions.js');
const config = require('../config.json');

// Main:
preflight()
    .then(() => header())
    .then(() => fetchAll(config))
    .then(results => output(results))
    .catch(console.log);
