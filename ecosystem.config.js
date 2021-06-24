module.exports = {
  apps: [
    {
      name: "opinion-kings-gql",
      script: "./app.js",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "ec2-3-108-82-42.ap-south-1.compute.amazonaws.com",
      key: "~/Desktop/ec2-mumbai-opinion-kings-hypermona.pem",
      ref: "origin/main",
      repo: "git@github.com:Hypermona/opinionKings-gql.git",
      path: "/home/ec2-user/opinionKings-gql",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js",
    },
  },
};
