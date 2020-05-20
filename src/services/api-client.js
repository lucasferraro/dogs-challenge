const apiURL = "https://dog.ceo/api";

const axios = require("axios").create({baseURL: apiURL, timeout: 0, headers: {}});

/* HTTP METHODS */

export function httpGet(url, params = {}) {
  return axios.get(url, {params});
}

/* END HTTP METHODS */
