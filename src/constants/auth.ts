import { AuthService } from "@/services/auth/auth.service";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const data = await new AuthService().login(credentials.email, credentials.password);
          return {
            accessToken: data.access,
            refreshToken: data.refresh,
            ...data.profile,
          };
        } catch (error) {
          console.error("Error al autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.refreshToken = token.refreshToken as string;

      const perfil = await new AuthService({ token: session.accessToken }).perfil();

      session.user = perfil;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
