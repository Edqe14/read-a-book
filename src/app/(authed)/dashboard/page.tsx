import { auth } from '@/utils/auth';

export default async function Dashboard() {
  const session = await auth();

  return <h1>Hi {session?.user.name}</h1>;
}
