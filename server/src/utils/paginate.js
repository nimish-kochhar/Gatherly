/**
 * Sequelize pagination helper.
 * @returns {{ rows, total, page, pageSize, totalPages }}
 */
export async function paginate(
  Model,
  { page = 1, pageSize = 20, where = {}, include = [], order = [['createdAt', 'DESC']] } = {}
) {
  const offset = (page - 1) * pageSize;
  const { count: total, rows } = await Model.findAndCountAll({
    where,
    include,
    order,
    limit: pageSize,
    offset,
  });

  return {
    rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
