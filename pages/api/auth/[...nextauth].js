import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import axios from "axios";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await axios.post("http://localhost:3000/api/users", {
        username: session.user.name,
      });

      if (user.status === 200) {
        session.user = user.data.exists;
        return session;
      } else if (user.status === 201) {
        session.user = user.data;
        return session;
      } else {
        return session;
      }
    },
  },
};

export default NextAuth(authOptions);
