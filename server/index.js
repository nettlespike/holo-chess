const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const { gql } = require('apollo-server-express')
const { readFile } = require('./utils/readFile')
const { resolvers } = require('./schema/resolvers')
require('dotenv').config({path: './schema/.env'})
const { Client } = require('pg')
const jwt = require('jsonwebtoken');
async function startApolloServer() {
  const app = express()
  const port = 3000

  const typeDefs = gql(readFile('./schema/typeDefs.graphql'))
  
  const client = new Client();
  await client.connect();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
      let user = false;
      if(req.headers) {
        try {
          const token = req.headers.authorization || ''
          user = jwt.verify(token, process.env.JWT_SECRET_KEY).userId
        } catch (e) {

        }
      }
      return {
        dbClient: client,
        userId: user,
        app: app
      }
    },
  });
  await server.start()

  server.applyMiddleware({ app });
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApolloServer()