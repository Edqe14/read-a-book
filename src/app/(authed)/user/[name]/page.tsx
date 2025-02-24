type ProfilePageProps = {
  params: Promise<{
    name: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { name } = await params;

  return <h1>{name}</h1>;
}
