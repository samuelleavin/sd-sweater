## Overview:

We’d like to get a small glimpse of how you think, how you solve problems, and what it will be like to work with you. We would like a small sample code to serve as a foundation of an interesting conversation as we move forward. In the next step of your interview we're going to pair on this code with you and attempt to add features to it.

## Expectation Setting:

We're trying to figure out what it'd look like to work with you day to day based on your submission. We'd like you to write code as though this was heading to production. Use your judgement to decide what level of abstraction, documentation, testing, and overall thoroughness & polish is representative of the work you typically do. You’ll be coming back to this code soon, not throwing it away.

This isn't a puzzle. We're not trying to see if you know off the top of your head the best way to sort a linked list, parse BASIC, or arrive at a single Correct Answer™. Our goal is to give you room to show us your strengths, not confound you.

Pick a language you're comfortable with so that you can show us your best. We’ve got a team of polyglots that can spot good code in a variety of languages. You’ll primarily be using Elixir here at ScriptDrop, but if you don’t already know it well, we recommend against trying to pick it up this week.

While you can spend an unlimited amount of time polishing code, we ask you to try and limit your total working time to around 4 hours. Naturally, you can split that over multiple days as your schedule dictates, but that should give enough depth to your solution without going overboard.

When you are happy with your solution, please take a few moments to write up a few thoughts on how it went as part of your README. This can be assumptions you made, parts you are particularly proud of, stumbling blocks you ran into, future enhancements you’d like to make, or anything else that comes to mind. We’ll talk more about these things during our pairing session, but it is an opportunity to give more context than the code alone can.

## Project S.W.E.A.T.E.R.

ScriptDrop Weather Evaluation And Thermal Excellence Recommendations

Everyday ScriptDrop sends thousands of notifications to couriers about their assigned deliveries. We’d like to start including recommendations of what they should bring with them based on their current weather forecast. Eg. “bring a sweater” if it’s going to be chilly, or “bring a raincoat” if it’s going to rain.

Before we hook this up to our automated notification system, we want to build a small prototype of the API integration and quickly experiment with our recommendation rules. We’ve decided that the lowest overhead way to try this out will be to build a small CLI tool.

We’d like you to build a small CLI application in the language of your choice to:

Collect the city name and state from the user.
Use the OpenWeather API to fetch the forecast for a given city.
Documentation: https://openweathermap.org/forecast5
Register for API Key: https://home.openweathermap.org/users/sign_up - Do this ahead of time. It takes ~2 hours for them to activate the API Key.
Read a configuration file containing the possible recommendations.
We suspect that rules for recommending particular items are subject to rapid changes. To support that, we’ll try to make this subsystem fairly data driven.
See attached JSON file for a sample configuration file.
Output zero, one, or many recommendations based on the city’s forecast.

The exact mechanisms for interacting with the user are left to your best judgement, as are the exact parameters of the recommendations. If you still have questions, don’t hesitate to reach out for clarification.

Please send us a link to your code sample’s GitHub/GitLab repository. If you’d like to keep the repository private, let us know and we’ll send you our usernames to add as collaborators. Both services allow free accounts to add unlimited collaborators to private repositories.

Recommendations Config File

---

available_recommendations:

- name: Sunglasses

  waterproof: false

  min_temp: 75

  max_temp: 100

- name: Rain Jacket

  waterproof: true

  min_temp: 62

  max_temp: 80

- name: Sweater

  waterproof: false

  min_temp: 50

  max_temp: 68

- name: Light Coat

  waterproof: true

  min_temp: 35

  max_temp: 55

- name: Comfortable Shoes

  waterproof: false

  min_temp: 25

  max_temp: 90

- name: Heavy Coat

  waterproof: true

  min_temp: 0

  max_temp: 40

- name: Snow Boots

  waterproof: true

  min_temp: 0

  max_temp: 35
