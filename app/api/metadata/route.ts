export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uri = searchParams.get('uri');

  if (!uri) throw 'Metadata URI is not defined';

  const res = await fetch(uri);

  if (!res.ok) {
    return Response.json({
      name: '',
      logo: '',
      website: '',
      description: '',
      twitter: '',
    });
  }

  const metadata = await res.json();

  return Response.json(metadata);
}
