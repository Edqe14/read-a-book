import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

export type ExtendedJWT = Omit<typeof users.$inferSelect, 'id'> & {
  id: string;
  picture: string;
  emailVerified: null;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedJWT;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        let dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, BigInt(profile.id!)),
        });

        if (!dbUser) {
          [dbUser] = await db
            .insert(users)
            .values({
              id: BigInt(profile.id!),
              name: profile!.username as string,
              nick: profile!.global_name as string,
              email: profile!.email!,
              lastLogin: new Date(),
            })
            .returning()
            .execute();
        } else {
          [dbUser] = await db
            .update(users)
            .set({
              lastLogin: new Date(),
            })
            .where(eq(users.id, BigInt(profile.id!)))
            .returning()
            .execute();
        }

        // assign to token
        Object.assign(token, dbUser, { id: dbUser.id.toString() });
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as ExtendedJWT;

      return session;
    },
  },
});
