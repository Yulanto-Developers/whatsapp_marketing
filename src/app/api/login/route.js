export const runtime = "nodejs";

import { createYoga, createSchema } from "graphql-yoga";
import { db } from "@/lib/config";

import bcrypt from "bcryptjs";

const schema = createSchema({
    typeDefs: `
    type User {
      id: ID!
      email: String!
    }

    type LoginResponse {
      success: Boolean!
      message: String!
      user: User
    }

    type Query {
      login(email: String!, password: String!): LoginResponse
    }
  `,
    resolvers: {
        Query: {
            login: async (_, { email, password }) => {

                const [rows] = await db.query(
                    "SELECT id, email, password FROM login_details WHERE email = ?",
                    [email]
                );

                if (rows.length === 0) {
                    return {
                        success: false,
                        message: "Email not found",
                        user: null,
                    };
                }

                const user = rows[0];


                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                    return {
                        success: false,
                        message: "Invalid password",
                        user: null,
                    };
                }


                return {
                    success: true,
                    message: "Login successful",
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                };
            },
        },
    },
});

const yoga = createYoga({
    schema,
    graphqlEndpoint: "/api/login",
});

export { yoga as GET, yoga as POST };
