import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    profile: any;
    user: {
      id: number;
      firstName: string;
      secondName: string;
      lastName: string;
      secondLastName: string;
      email: string;
    };
  }

  interface User {
    id: number;
    accessToken?: string;
    refreshToken?: string;
    firstName: string;
    lastName: string;
  }

  interface JWT extends DefaultJWT {
    id: number;
    accessToken?: string;
    refreshToken?: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}
