import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Role = "PLAYER" | "AGENT" | "ACADEMY" | "ADMIN";

function resolveAuthUrl() {
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const trimmed = (base || "").replace(/\/$/, "");
  if (!trimmed) {
    return "/api/auth/login";
  }
  return `${trimmed}/api/auth/login`;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        try {
          const response = await fetch(resolveAuthUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok) {
            const message =
              payload?.error ||
              payload?.message ||
              `${response.status} ${response.statusText}`;
            throw new Error(message);
          }
          if (!payload || !payload.id) {
            throw new Error("Authentication failed");
          }
          return payload as any;
        } catch (error: any) {
          throw new Error(error?.message || "Authentication failed");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: Role }).role;
        token.id = (user as unknown as { id: string }).id;
        token.email = (user as unknown as { email: string }).email;
        token.name = (user as unknown as { name?: string | null }).name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        session.user.email = token.email as string | undefined;
        session.user.name = token.name as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/player/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
