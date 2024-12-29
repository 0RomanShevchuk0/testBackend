const calculateSkipValue = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize
}

const hasNextPrevPage = (
  pagesConfig: { pageNumber: number; pageSize: number },
  totalCount: number
) => {
  const { pageNumber, pageSize } = pagesConfig

  const hasNextPage = pageNumber * pageSize < totalCount
  const hasPreviousPage = pageNumber > 1

  return { hasNextPage, hasPreviousPage }
}

export { calculateSkipValue, hasNextPrevPage }
