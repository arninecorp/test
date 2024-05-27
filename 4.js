const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database',
  multipleStatements: true,
  ssl  : {
    rejectUnauthorized: false
  }
});

connection.connect((err) => { ... });

const BrandType = new GraphQLObjectType({
  name: 'Brand',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    cars: {
      type: new GraphQLList(CarType),
      resolve: (brand) => {
        const query = `SELECT * FROM cars WHERE brandId = '${brand.id}'`;
        return new Promise((resolve, reject) => {
          connection.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      },
    },
  }),
});

const CarType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    model: { type: GraphQLNonNull(GraphQLString) },
    brandId: { type: GraphQLNonNull(GraphQLString) },
    brand: {
      type: BrandType,
      resolve: (car) => {
        const query = `SELECT * FROM brands WHERE id = '${car.brandId}'`;
        return new Promise((resolve, reject) => {
          connection.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    car: {
      type: CarType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const query = `SELECT * FROM cars WHERE id = '${args.id}'`;
        return new Promise((resolve, reject) => {
          connection.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
    },
    cars: {
      type: new GraphQLList(CarType),
      resolve: async () => {
        const query = 'SELECT * FROM cars';
        return new Promise((resolve, reject) => {
          connection.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});