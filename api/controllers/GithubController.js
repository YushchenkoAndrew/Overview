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
      if (res.statusCode === 200) {
        sails.log(`Status getUserInfo: ${" ".repeat(30)}${res.statusCode}`);

        let data = [];
        res.setEncoding("utf-8");
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          let repos = JSON.parse(data.join(""));
          reposSize = repos.length;

          for (let i in repos)
            if (!repos[i].fork) {
              let { name } = repos[i];
              if (!(name in this.repos)) this.repos[name] = {};
              this.repos[name]["updated_at"] = repos[i].updated_at.split(
                "T"
              )[0];

              this.getRepoInfo(user, name, "/languages", (obj, lang, name) => {
                // obj[name].languages = lang;
                for (let key in lang)
                  obj.languages[key] =
                    (key in obj.languages ? obj.languages[key] : 0) +
                    Number(lang[key]);
              });

              this.getFileContext(user, name);
            } else reposSize--;
        });
      } else sails.log(`Status: ${res.statusCode}`);
    });
  },

  getRepoInfo: function (user, repos, param = "", func) {
    let option = {
      url: `https://api.github.com/repos/${user}/${repos}${param}`,
      headers: {
        "User-Agent": `${user}`,
      },
    };

    request.get(option).on("response", (res) => {
      if (res.statusCode === 200) {
        var repoName = res.request.uri.path.split("/").slice(-2)[0];
        sails.log(
          `Status getRepoInfo(${repoName}): ${" ".repeat(
            28 - repoName.length
          )}${res.statusCode}`
        );

        let data = [];
        res.setEncoding("utf-8");
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          // this.repos[repoName] = JSON.parse(data.join(""));
          if (!this.repos[repoName]) this.repos[repoName] = {};
          func(this.repos, JSON.parse(data.join("")), repoName);

          --reposSize;

          if (this.isFinished()) {
            console.log(this.repos);
          }
        });
      } else sails.log(`Status: ${res.statusCode}`);
    });
  },

  getFileContext(user, repos, path = "README.md") {
    let option = {
      url: `https://raw.githubusercontent.com/${user}/${repos}/master/${path}`,
      headers: {
        "User-Agent": `${user}`,
      },
    };

    request.get(option).on("response", (res) => {
      if (res.statusCode === 200) {
        var repoName = res.request.uri.path.split("/").slice(-3)[0];
        sails.log(
          `Status getFileContext(${repoName}): ${" ".repeat(
            28 - repoName.length
          )}${res.statusCode}`
        );

        var data = [];
        res.setEncoding("utf-8");
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          if (!this.repos[repoName]) this.repos[repoName] = {};
          this.repos[repoName][path] = data.join("");

          // --reposSize;

          if (this.isFinished()) {
            console.log(this.repos);
          }
        });
      } else sails.log(`Status: ${res.statusCode}`);
    });
  },

  isFinished: () => reposSize === 0,
};
