export class DataModel {
    data: any[];
    pagination: Pagination;

    constructor(data: any[], pagination: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}

export class Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;

    constructor(
        currentPage: number,
        totalPages: number,
        totalItems: number,
        itemsPerPage: number,
        isFirstPage: boolean,
        isLastPage: boolean
    ) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.itemsPerPage = itemsPerPage;
        this.isFirstPage = isFirstPage;
        this.isLastPage = isLastPage;
    }
}
