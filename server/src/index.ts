require('dotenv').config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { __prod__, COOKIE_NAME } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { Context } from './types/Context';

const main = async () => {
	await createConnection({
		type: 'postgres',
		database: 'reddit',
		username: process.env.DB_USERNAME_DEV,
		password: process.env.DB_PASSWORD_DEV,
		logging: true,
		synchronize: true,
		entities: [User, Post],
	});

	const app = express();

	// cors
	const corsOptions = {
		origin: 'http://localhost:4000', //Your Client, do not write '*'
		credentials: true,
	};
	app.use(cors(corsOptions));

	// session cookie store
	const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV}:${encodeURIComponent(
		process.env.SESSION_DB_PASSWORD_DEV!,
	)}@reddit.zhwmb.mongodb.net/?retryWrites=true&w=majority&appName=reddit`;
	await mongoose.connect(mongoUrl);
	// app.set('trust proxy', 1);
	app.use(
		session({
			name: COOKIE_NAME,
			store: MongoStore.create({ mongoUrl }),
			cookie: {
				maxAge: 1000 * 60 * 60,
				httpOnly: true, // front end can't access the value
				secure: __prod__, // only work https,
				sameSite: 'lax', // protection against CSFR attacks
			},
			secret: process.env.SESSION_SECRET!,
			saveUninitialized: false, // don't save empty session,
			resave: false,
		}),
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver, PostResolver],
			validate: false,
		}),
		context: ({ req, res }): Context => ({ req, res }),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, cors: false });

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () =>
		console.log(
			`Server started on post ${PORT}. GraphQl server started on localhost:${PORT}${apolloServer.graphqlPath}`,
		),
	);
};

main().catch((error) => console.log('Error: ' + error));
