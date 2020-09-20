/* eslint-disable quotes */
module.exports = {
  friendlyName: "Index",

  description: "Index test.",

  inputs: {
    id: {
      description: "Testing data input",

      type: "number",
    },
  },

  exits: {
    success: {
      responseType: "view",
      viewTemplatePath: "pages/test",
    },
    notFound: {
      description: "No found",
      responseType: "notFound",
    },
  },

  fn: async function ({ id }) {
    // All done.
    sails.log("Action testing...");
    sails.log();
    // sails.log(`id = ${id}`);

    // if (!id) {
    // throw "notFound";
    // }

    var repos = {};

    let request = require("request");

    let option = {
      url: "https://api.github.com/users/YushchenkoAndrew/repos",
      headers: {
        "User-Agent": "YushchenkoAndrew",
      },
    };

    request.get(option).on("response", (res) => {
      var data = [];

      sails.log(`URL: ${res.url}\n`);
      sails.log(`Status: ${res.statusCode}\n`);
      // if (res.statusCode !== 200) throw "notFound";

      res.setEncoding("utf-8");
      res.on("data", (chunk) => data.push(chunk));

      res.on("end", () => {
        let obj = JSON.parse(data.join(""));

        console.log("Repositories:");
        for (let i in obj) {
          console.log(`    ${obj[i].name}`);
          repos[i] = {};

          option.url = `https://api.github.com/repos/YushchenkoAndrew/${obj[i].name}/languages`;

          request.get(option).on("response", (res) => {
            res.setEncoding("utf-8");
            res.on("data", (chunk) => {
              // repos[res.url.split("/").slice(-2)[0]] = { ...JSON.parse(chunk) };
              console.log(chunk);
            });
          });
        }
      });
    });
    // console.dir(result, { depth: null });

    // return "Test";
  },
};
