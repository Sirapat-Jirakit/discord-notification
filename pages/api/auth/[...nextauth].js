import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  async jwt({ token, account }) {
    if (account) {
      console.log("Google account received:", account);
      token.accessToken = account.access_token;
      token.expires_at = Date.now() + account.expires_in * 1000; // Optional: store expiry if needed
    }
    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    return session;
  },
  async signIn({ user, account, profile }) {
    return true;
  },
},
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have a strong NEXTAUTH_SECRET set.
  // Uncomment next line for additional debugging logs from NextAuth
  // debug: true,
};

export default NextAuth(authOptions);
