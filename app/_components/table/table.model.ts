export type DownloadButtonProps = {
  onDownload: () => void;
  isLoading?: boolean;
};

export type PerPageOptions = Array<{ value: number; checked: boolean }>;

export type PaginationProps = {
  total: number;
  currentPage: number;
  perPage: number;
  perPageOptions: PerPageOptions;
  setCurrentPage: (currentPage: number) => void;
  setPerPage: (perPage: number) => void;
};
