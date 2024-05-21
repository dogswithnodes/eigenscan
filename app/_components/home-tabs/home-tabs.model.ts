import { FetchParams } from '@/app/_models/table.model';

export type HomeTabTableCommonProps = {
  searchTerm: string;
};

export type HomeTabTableFetchParams<Row> = FetchParams<Row> & { idFilters: Array<string> | null };
