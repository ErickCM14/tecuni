class PaginationHelper {
    static applyPagination(query) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const sort = query.sort || '';
        const order = query.order || '';

        let filters = {};
        if (query.filters) {
            try {
                // filters = JSON.parse(query.filters);
                const parsedFilters = JSON.parse(query.filters);
                filters = Object.entries(parsedFilters).reduce((acc, [key, value]) => {
                    if (typeof value === 'string') {
                        acc[key] = { $regex: value, $options: 'i' };
                    } else {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
            } catch (error) {
                throw new Error("Invalid filters format.");
            }
        }

        return {
            filters,
            pagination: { limit, page, skip },
            order,
            sort
        };
    }

    static async paginate(model, filters, pagination, sort = '', order = '') {
        const { skip, limit } = pagination;
        let query = model.find(filters).skip(skip).limit(limit);

        if (sort) {
            const direction = order === 'desc' ? -1 : 1;
            query = query.sort({ [sort]: direction });
        }

        const data = await query.exec();
        const total = await model.countDocuments(filters);

        return {
            data,
            pagination: {
                limit: pagination.limit,
                page: pagination.page,
                pages: Math.ceil(total / pagination.limit),
                total: data.length,
                totalItems: total,
            }
        };
    }
}

module.exports = PaginationHelper;
