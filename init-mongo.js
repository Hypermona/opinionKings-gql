db.getSiblingDB("admin").auth(process.env.DB_USER, process.env.DB_PWD);
db.createUser({
  user: process.env.DB_USER,
  pwd: process.env.DB_PWD,
  roles: [
    {
      role: "readWrite",
      db: process.env.DB_NAME,
    },
  ],
});
