#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs/yargs');

/**
 * Note: hideBin is a shorthand for process.argv.slice(2).
 * It has the benefit that it takes into account variations in some environments, e.g., Electron.
 */
const { hideBin } = require('yargs/helpers');
const got = require('got');

/**
 * If we have to hard code, use an enum
 */
const itemProps = {
  absorbent: 'absorbent',
  waterproof: 'waterproof',
};

/** 
 * Categories of items we can recommend
 */
const categories = {
  jacket: 'jacket',
  sunglasses: 'sunglasses',
  shoes: 'shoes',
};

/**
 * We are using a subset of 'Main' conditions mapped from OpenWeather
 * All of our conditions here can be quantified, and so relatively easily encoded. 
 * n.b. We match the api condition string exactly, i.e. with Capitalization.
 * n.b. see the following for more info: https://openweathermap.org/weather-conditions
 */
const mainConditions = {
  rain: 'Rain',
  snow: 'Snow',
};

main();

/** 
 * Can't use await in the top level (in this version of node?),
 * so wrap our app in an async function.
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: ./$0 -c [city] -s [state]')
    .usage('For a city with spaces: ./$0 -c "[city]" -s [state]')
    .option('city', {
      alias: 'c',
      describe: `city to check, e.g. "New York"`,
      default: 'new york',
      demandOption: true,
    })
    .option('state', {
      alias: 's',
      describe: 'two letter state code to check, e.g. NY',
      default: 'NY',
      demandOption: true,
    })
    .coerce('state', (arg) => (arg || '').toUpperCase())
    .check((argv, _options) => {
      // This only runs once, so we don't need to cache the regex
      if (!argv.state.match(/^[A-Z]{2}$/g)) {
        throw new Error('Invalid state provided; please provide a two letter code.')
      }

      return true;
    })
    .help('h')
    .alias('h', 'help')
    .parse();

  let recommendationIndex;

  try {
    // could check for existence of file before trying a read
    const recommendationData = await fs.promises.readFile('./recommendations.json', 'utf8');
    const recommendations = JSON.parse(recommendationData);
    recommendationIndex = buildIndex(recommendations);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return;
  }

  // call for weather, read api key, compose url, parse response
  let apiKey;

  try {
    apiKey = (await fs.promises.readFile('../secrets/api-key.txt', 'utf8')).trim();
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

  // taking advantage of fact template string will call 'toString' method if available
  const url = `http://api.openweathermap.org/data/2.5/forecast?${searchParams}`;

  let parsedBody;
  let weatherRecord;

  try {
    console.log(`calling open weather api at: ${url}`);
    parsedBody = await got(url).json();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return;
  }
  
  try {
    weatherRecord = parsedBody.list[0];
    if (!weatherRecord) throw new Error('failed to get weather record from response');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return;
  }

  // calculate state
  const temperature = weatherRecord.main.temp;
  const cloudCoveragePercent = weatherRecord.clouds.all;
  const haveRainOrSnow = (weatherRecord.weather || []).filter(({ main }) =>
    (main === mainConditions.rain || main == mainConditions.snow)
  ).length > 0;

  // Time is in Unix seconds, but it doesn't matter for this comparison
  const time = weatherRecord.dt;
  const sunset = parsedBody.city.sunset;
  const sunrise = parsedBody.city.sunrise;
  const sunIsOut = time >= sunrise && time <= sunset;

  // prep final list of recommendations
  const finalRecommendations = [];

  // sunglasses
  if (cloudCoveragePercent < 75 && sunIsOut) {
    const sunglassesMap = recommendationIndex.get(categories.sunglasses);

    const waterproof = sunglassesMap.get(itemProps.waterproof);
    if (waterproof.size > 0) finalRecommendations.push(...waterproof);

    const absorbent = sunglassesMap.get(itemProps.absorbent);
    if (absorbent.size > 0) finalRecommendations.push(...absorbent);
  }

  // jacket
  const jacketMap = recommendationIndex.get(categories.jacket);
  const jacketRecommendations = getGearRecommendations({
    temperature,
    map: jacketMap,
    preferWaterproof: haveRainOrSnow,
  });

  finalRecommendations.push(...jacketRecommendations);

  // shoes
  const shoeMap = recommendationIndex.get(categories.shoes);
  const shoeRecommendations = getGearRecommendations({
    temperature,
    map: shoeMap,
    preferWaterproof: haveRainOrSnow,
  });

  finalRecommendations.push(...shoeRecommendations);

  console.log('Final Recommendations:', finalRecommendations.map(recommendation => recommendation.name));
}

function getGearRecommendations({ map, temperature, preferWaterproof }) {
  const recommendations = [];

  if (preferWaterproof) {
    const gearSet = map.get(itemProps.waterproof);
    addGearByTemperature({ gearSet, temperature, recommendations })
  }

  // if it is not raining, OR it IS raining but we have no gear recommended so far.
  // better some gear than none.
  if (recommendations.length === 0) {
    const gearSet = map.get(itemProps.absorbent);
    addGearByTemperature({ gearSet, temperature, recommendations })
  }

  return recommendations;
}

/** In-place gear add based on temperature */
function addGearByTemperature({ gearSet, temperature, recommendations }) {
  for (const gear of gearSet) {
    const { min_temp, max_temp } = gear;

    if (temperature >= min_temp && temperature <= max_temp) {
      recommendations.push(gear);
    }
  }
}

/** sort recommendations into category groups, as well as waterproof/absorbent groups */
function buildIndex(recommendations) {
  return recommendations.reduce((accumulator, recommendation) => {
    const { category, waterproof } = recommendation;

    if (!accumulator.has(category)) {
      accumulator.set(category, new Map([
        [itemProps.waterproof, new Set()],
        [itemProps.absorbent, new Set()],
      ]));
    }

    const categoryMap = accumulator.get(category);
    const set = waterproof
      ? categoryMap.get(itemProps.waterproof)
      : categoryMap.get(itemProps.absorbent);

    set.add(recommendation);

    return accumulator;
  }, new Map())
}
