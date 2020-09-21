/* eslint-disable quotes */
const github = module.require("../GithubController");

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

    // github.getUserInfo("YushchenkoAndrew");

    // while (!github.isFinished()) {}
    // console.log(github.repos);

    // console.dir(github.repos, { depth: null });

    // return "Test";
  },
};
