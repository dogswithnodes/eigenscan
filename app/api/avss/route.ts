import { fetchAvss } from '@/app/_components/home-tabs/components/avss/avss.service';

export async function GET() {
  return Response.json(await fetchAvss());
}
