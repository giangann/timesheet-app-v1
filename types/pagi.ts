export type TPageable = {
  previousPage: number;
  currentPage: number;
  nextPage: number;
  elementsPerPage: number;
  totalPages: number;
  totalElements: number;
};

export type TPagiParams = {
  page: number;
  size: number;
};
