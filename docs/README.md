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

## Core code
https://github.com/samuelleavin/sd-sweater/blob/main/src/index.js

### API Usage

[OpenWeather API docs](https://openweathermap.org/current)

Example usage by city and state: `api.openweathermap.org/data/2.5/forecast?q={city name},{state code}&appid={API key}`

## Dependencies

Less is more.

### Production:

- [yargs](https://github.com/yargs/yargs) - production grade cli builder

  > Yargs helps you build interactive command line tools

- [got](https://github.com/sindresorhus/got) - handle network (http/s) requests and responses

  > Human-friendly and powerful HTTP request library for Node.js

- [OpenWeather API](https://openweathermap.org/forecast5) - Get weather data
  > - 5 day forecast for any location or city
  > - 5 day forecast with a 3-hour step
  > - JSON and XML formats

## Setup

- Clone from github
- Install dependencies with `npm i`
- create and add your open weather api key in a `./secrets/api-key.txt` file.

## Running the app

Change into the `./src` directory, e.g.

```shell
sd-sweater$ cd src
```

Run for your city and state, e.g.:

```shell
sd-sweater/src$ ./index.js -city "New York" -state NY
```

## Rules

Currently, we recommend all items that satisfy the following conditions:
- Wear sunglasses IFF Cloud coverage is less than 75%, and it is daytime
- For jackets and shoes, wear IFF it is suitable for the current temperature.
- For jackets, shoes and sunglasses, IFF it is raining or snowing, prefer waterproof gear, but recommend absorbent ones if none are available.

## Notes

- OpenWeather API supports language and measurement system parameters, for future functionality.

## Thoughts

Fun little challenge. I enjoyed using yargs for the first time, despite having seen it in the wild.

I made numerous assumptions - added a category to the recommendations, the rules were all best effort solutions that would normally be clarified with product, etc.

The rules and recommendations are an interesting problem to think about. I have worked with filters and complex searches that were somewhat similar, but recommendation engines are a beast unto themselves. This is also where the concept of a [Domain Specific Language](https://en.wikipedia.org/wiki/Domain-specific_language) comes into play, though I haven't studied the topic extensively.

Interesting aside from the above article:

> Erlang OTP
The Erlang Open Telecom Platform was originally designed for use inside Ericsson as a domain-specific language. The language itself offers a platform of libraries to create finite state machines, generic servers and event managers that quickly allow an engineer to deploy applications, or support libraries, that have been shown in industry benchmarks to outperform other languages intended for a mixed set of domains, such as C and C++. The language is now officially open source and can be downloaded from their website.

Went over time even without tests. Testing and TDD is a great idea, but I have not fully switched to using it, so I skipped writing tests as I was over time.

There are many other remaining optimizations and issues to improve upon.

- Adding human readable version of the recommendations
- Extracting and abstracting the rules. I did include a document with some thoughts about the abstraction to make.
- Adding tests; tests are critical, but working code and speed is often the priority.
- Modularization: extraction and separation of enums, and other objects inside the `index.js` to improve organization.
- roll up or some other tool to package the tool (no `cd src` required)
