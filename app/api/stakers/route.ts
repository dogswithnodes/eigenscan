import {
  fetchStakers,
  fetchAllStakers,
} from '@/app/_components/home-tabs/components/stakers/stakers.service';
export const runtime = 'edge';
export async function POST(request: Request) {
  const params = await request.json();

  return Response.json(await fetchStakers(params));
}

export async function GET() {
  return Response.json(await fetchAllStakers());
}
