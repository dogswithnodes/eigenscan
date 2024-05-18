import { fetchAvss } from '@/app/_components/home-tabs/components/avss/avss.service';
export const runtime = 'edge';
export async function GET() {
  return Response.json(await fetchAvss());
}
