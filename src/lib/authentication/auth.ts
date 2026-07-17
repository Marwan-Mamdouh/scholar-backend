import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { db_client } from "../../db/db_config.js";
import { openAPI } from "better-auth/plugins"


export const auth = betterAuth({
    database: prismaAdapter(db_client, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    plugins: [openAPI()],
    advanced: {
        disableStateCheck: process.env.NODE_ENV === "development"
    }
});
