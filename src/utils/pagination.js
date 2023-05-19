const { getMyHost } = require('./localhost');

const pagination = (
	req,
	dataFilter,
	data = [],
	offset = 0,
	limit = 12,
	route,
	orderString = ''
) => {
	const myHost = getMyHost(req);

	const count = data.length;
	const maxPage = Math.ceil(count / limit);
	const currentPage = offset / limit + 1;
	const nextOffset = offset + limit;
	const prevOffset = offset - limit;

	const dataList = dataFilter(data, +offset, +limit);

	const next =
		currentPage === maxPage
			? null
			: `${myHost.origin}/${route}/?offset=${nextOffset}&limit=${limit}${orderString}`;

	const prev =
		currentPage === 1
			? null
			: `${myHost.origin}/${route}/?offset=${prevOffset}&limit=${limit}${orderString}`;

	return { count, next, prev, dataList, maxPage, currentPage };
};

module.exports = { pagination };
