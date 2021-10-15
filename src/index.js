#!/usr/bin/env node
const yargs = require("yargs/yargs");

/**
 * Note: hideBin is a shorthand for process.argv.slice(2).
 * It has the benefit that it takes into account variations in some environments, e.g., Electron.
 */
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
  .command(`get`, `get recommendations for your city/state combo`, (yargs, _) =>
    yargs
      .option(`city`, {
        alias: `c`,
        describe: `city to check`,
        demandOption: true,
      })
      .option(`state`, {
        alias: `s`,
        describe: `state to check`,
        demandOption: true,
      })
  )
  .help()
  .parse();
