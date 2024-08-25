export const getPagination = (items, offset = 0, limit = 10) => {
  if (!items || items.length < 1) return items
  if (limit < 1)
    return {
      data: items,
      rowsNumber: items.length,
      totalPage: 1
    }
  const rowsNumber = items.length
  const totalPage = Math.ceil(rowsNumber / limit)
  const result = items.slice((offset - 1) * limit, offset * limit)
  return {
    data: result,
    rowsNumber: rowsNumber,
    totalPage: totalPage
  }
}
