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
          console.log("DATA: ", data);
          return {
            accessToken: data.access,
            refreshToken: data.refresh,
            perfil: data.profile,
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
        //@ts-ignore
        token.perfil = user.perfil;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.refreshToken = token.refreshToken as string;
      // console.log(token);
      // const perfil = await new AuthService({ token: session.accessToken }).perfil();
      //@ts-ignore
      session.user = token.perfil;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Un mes
    updateAge: 24 * 60 * 60, // Cada 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
};
