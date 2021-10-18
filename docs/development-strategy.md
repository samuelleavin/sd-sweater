
# Development Strategy

## CLI

Read docs, install and configure basic `yargs` app to:

- define initial command, e.g.

  ```shell
  $ sweater ...
  ```

- capture `--city={city}` and `--state={state}` from the user

- optional: validate city and state

## Config

- read JSON config

- define categories

- create index by category AND waterproof: rain vs no rain will be a common situation we'll need to compare.

- optional: cache indexes in a file (using an md5 hash to compare versions)

## OpenWeather API

- Refresh on got docs, instal and configure API calls

- Read API key from ENV

- call api

- check success/error

## Generate Recommendations

- combine weather and recommendations to create personalized output

  - for every category we can make a recommendation in,

    - gather rules, e.g. `sunglasses` are not worn in the rain, do not recommend two pairs of `shoes`, etc..

      - what will these 'rules' look like, and how will be implement and parse them?

    - given current weather, rules, and recommendation indexes, determine our recommendations, if any

- log to terminal

- optional: write to file?
