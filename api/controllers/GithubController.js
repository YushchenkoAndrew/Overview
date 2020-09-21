/**
 * ApiGithubController
 *
 * @description :: Simple request handler for github api
 *
 */

/* eslint-disable quotes */
const request = require("request");
var reposSize = 0;

module.exports = {
  repos: {},

  getUserInfo: function (user = "YushchenkoAndrew") {
    let option = {
      url: `https://api.github.com/users/${user}/repos`,
      headers: {
        "User-Agent": `${user}`,
      },
    };
    // Set some value for handle aysnc function
    reposSize = 1;

    request.get(option).on("response", (res) => {
      // if (res.statusCode === 200) {
      sails.log(`Status getUserInfo: ${" ".repeat(30)}${res.statusCode}`);

      let data = [];
      res.setEncoding("utf-8");
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        let repos = JSON.parse(data.join(""));
        reposSize = repos.length;

        for (let i in repos)
          if (!repos[i].fork)
            this.getRepoInfo(user, repos[i].name, "/languages");
          else reposSize--;
      });
      // } else sails.log(`Status: ${res.statusCode}`);
    });
  },

  getRepoInfo: function (user = "YushchenkoAndrew", repos, param = "") {
    let option = {
      url: `https://api.github.com/repos/${user}/${repos}${param}`,
      headers: {
        "User-Agent": `${user}`,
      },
    };

    request.get(option).on("response", (res) => {
      // if (res.statusCode === 200) {
      var repoName = res.request.uri.path.split("/").slice(-2)[0];
      sails.log(
        `Status getRepoInfo(${repoName}): ${" ".repeat(28 - repoName.length)}${
          res.statusCode
        }`
      );

      let data = [];
      res.setEncoding("utf-8");
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        this.repos[repoName] = JSON.parse(data.join(""));
        --reposSize;

        if (this.isFinished()) console.log(this.repos);
      });
      // } else sails.log(`Status: ${res.statusCode}`);
    });
  },

  isFinished: () => reposSize === 0,
};
