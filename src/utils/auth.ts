import { db } from '@/db';
import { users } from '@/db/schema';
import {
  createOrUpdateUser,
  createOrUpdateUserProfile,
  createUser,
  getUser,
  updateUser,
} from '@/services/user';
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
        const user = await createOrUpdateUser(
          profile.id!,
          {
            lastLogin: new Date(),
          },
          {
            name: profile.username as string,
            nick: profile.global_name as string,
            email: profile.email!,
          }
        );

        await createOrUpdateUserProfile(
          profile.id!,
          {
            picture: profile.image_url as string,
          },
          {
            bio: "I'm new here!",
          }
        );

        Object.assign(token, user, { id: user.id.toString() });
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as ExtendedJWT;

      return session;
    },
  },
});
