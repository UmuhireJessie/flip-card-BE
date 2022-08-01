import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { schema } from "./schema";
import { context } from "./context";
import dotenv from 'dotenv';

dotenv.config();

export const server = new ApolloServer({
    schema,
    context,
    introspection: true,                                      
    plugins: [ApolloServerPluginLandingPageLocalDefault()],  
});

const port = process.env.PORT || 4000;

server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});