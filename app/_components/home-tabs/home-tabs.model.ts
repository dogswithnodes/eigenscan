import { FetchParams } from '@/app/_models/table.model';

export type SearchTableProps = {
  searchTerm: string;
};

export type ServerSearchFetchParams<Row> = FetchParams<Row> & { idFilters: Array<string> | null };
