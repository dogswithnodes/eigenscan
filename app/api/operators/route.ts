import {
  fetchOperators,
  fetchAllOperators,
} from '@/app/_components/home-tabs/components/operators/operators.service';

export async function POST(request: Request) {
  const params = await request.json();

  return Response.json(await fetchOperators(params));
}

export async function GET() {
  return Response.json(await fetchAllOperators());
}
