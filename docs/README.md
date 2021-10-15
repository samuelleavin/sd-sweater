# Project S.W.E.A.T.E.R.

## Directions

SD Weather Evaluation And Thermal Excellence Recommendations

Everyday SD sends thousands of notifications to couriers about their assigned deliveries.
We’d like to start including recommendations of what they should bring with them based on their current weather forecast.
Eg. “bring a sweater” if it’s going to be chilly, or “bring a raincoat” if it’s going to rain.

Before we hook this up to our automated notification system, we want to build a small prototype of the API integration and quickly experiment with our recommendation rules.
We’ve decided that the lowest overhead way to try this out will be to build a small CLI tool.

We’d like you to build a small CLI application in the language of your choice to:

- Collect the city name and state from the user.
- Use the OpenWeather API to fetch the forecast for a given city. Documentation: https://openweathermap.org/forecast5
- Read a configuration file containing the possible recommendations.
- Output zero, one, or many recommendations based on the city’s forecast.

## API Usage

[OpenWeather API docs](https://openweathermap.org/current)

Example usage by city and state: `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`

## Dependencies

Less is more.

### Production:

- [yargs](https://github.com/yargs/yargs) - production grade cli builder

  > Yargs helps you build interactive command line tools

- [got](https://github.com/sindresorhus/got) - handle network (http/s) requests and responses

  > Human-friendly and powerful HTTP request library for Node.js

### Development:

- [Jest Website](https://jestjs.io/) and [Jest Github Repo](https://github.com/facebook/jest) - for testing

  > Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

## Development Strategy

### CLI

Read docs, install and configure basic `yargs` app to:

- define initial command, e.g.

    ```shell
    $ sweater ...
    ```

- capture `--city={city}` and `--state={state}` from the user

- optional: validate city and state

### Config

- read JSON config

- define categories

- create index by category AND waterproof: rain vs no rain will be a common situation we'll need to compare.

- optional: cache indexes in a file (using an md5 hash to compare versions)

### OpenWeather API

- Refresh on got docs, instal and configure API calls

- Read API key from ENV

- call api

- check success/error

### Generate Recommendations

- combine weather and recommendations to create personalized output

    - for every category we can make a recommendation in,

        - gather rules, e.g. `sunglasses` are not worn in the rain, do not recommend two pairs of `shoes`, etc..

            - what will these 'rules' look like, and how will be implement and parse them?

        - given current weather, rules, and recommendation indexes, determine our recommendations, if any

- log to terminal

- optional: write to file?

## Notes

- OpenWeather API supports language and measurement system parameters.
