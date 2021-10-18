#!/usr/bin/env node
const fs = require(`fs`);
const yargs = require(`yargs/yargs`);

/**
 * Note: hideBin is a shorthand for process.argv.slice(2).
 * It has the benefit that it takes into account variations in some environments, e.g., Electron.
 */
const { hideBin } = require(`yargs/helpers`);
const got = require('got');

const constants = {
  absorbent: `absorbent`,
  waterproof: `waterproof`,
};

main();

/** 
 * Can't use await in the top level (in this version of node?),
 * so wrap our app in an async function.
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage(`Usage: ./$0 -c [city] -s [state]`)
    .usage(`For a city with spaces: ./$0 -c "[city]" -s [state]`)
    .option(`city`, {
      alias: `c`,
      describe: `city to check`,
      default: `new york`,
      demandOption: true,
    })
    .option(`state`, {
      alias: `s`,
      describe: `two letter state code to check, e.g. NY`,
      default: `NY`,
      demandOption: true,
    })
    .coerce(`state`, (arg) => (arg || ``).toUpperCase())
    .check((argv, _options) => {
      // This only runs once, so we don't need to cache the regex
      if (!argv.state.match(/^[A-Z]{2}$/g)) {
        throw new Error(`Invalid state provided; please provide a two letter code.`)
      }

      return true;
    })
    .help(`h`)
    .alias(`h`, `help`)
    .parse();

  let index;

  try {
    // could check for existence of file
    const recommendationData = await fs.promises.readFile(`./recommendations.json`, `utf8`);
    const recommendations = JSON.parse(recommendationData);
    index = buildIndex(recommendations);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return;
  }
  
  // call for weather
    // read api key
    // compose url
    // parse response
  let apiKey;
  
  try {
    apiKey = (await fs.promises.readFile(`../secrets/api-key.txt`, `utf8`)).trim();
  } catch (error) {
    console.log(`Error: ${error.message}`)
    return;
  }
  
  /**
   * We're assuming US, so set "units" to imperial
   * We also only need one record for now, so set "cnt" to 1
   */
  const searchParams = new URLSearchParams({
    q: `${argv.city},${argv.state},US`,
    appid: apiKey,
    units: 'imperial',
    cnt: 1,
  });
  
  // taking advantage of fact template string will call `toString` method if available
  const url = `http://api.openweathermap.org/data/2.5/forecast?${searchParams}`;
  console.log(`url: ${url}`)
  
  let weather;
  
  try {
    console.log('calling open weather api...')
    const data = await got(url).json();
    weather = data.list[0];
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return;
  }
  
  console.log('weather')
  console.log(weather);
}

/** sort recommendations into category groups, as well as waterproof/absorbent groups */
function buildIndex(recommendations) {
  return recommendations.reduce((accumulator, recommendation) => {
    const { category, waterproof } = recommendation;

    if (!accumulator.has(category)) {
      accumulator.set(category, new Map([
        [constants.waterproof, new Set()],
        [constants.absorbent, new Set()],
      ]));
    }

    const categoryMap = accumulator.get(category);
    const set = waterproof ? categoryMap.get(constants.waterproof) : categoryMap.get(constants.absorbent)
    set.add(recommendation);

    return accumulator;
  }, new Map())
}
