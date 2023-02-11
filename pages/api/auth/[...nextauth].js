import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import {
  userExists,
  giveNewUserWallet,
  createUser,
} from "../../../src/flows/onboarding";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user.name) {
        return session;
      }

      // remove any spaces in the username
      session.user.name = session.user.name.replace(/\s/g, "");

      const exists = await userExists(session.user.name);

      if (exists) {
        session.user = exists;
        return session;
      }
      // If the user doesnt exist, create a wallet for them
      const wallet = await giveNewUserWallet(session.user.name);

      // With our wallet data we can now create a user in our database
      const user = {
        username: session.user.name,
        wallet_id: wallet.id,
        wallet_admin: wallet.admin,
        admin_key: wallet.adminkey,
        in_key: wallet.inkey,
      };

      const userCreated = await createUser(user);

      if (userCreated) {
        console.log("user created", userCreated);
        session.user = userCreated;
        return session;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
