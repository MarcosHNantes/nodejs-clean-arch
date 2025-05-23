import { InvalidArgumentException } from "@/shared/domain"
import { injectable } from "tsyringe"
import { PaginationData, PaginationInterface } from "../contracts"

@injectable()
export class Pagination implements PaginationInterface {
    private totalRecords: number
    private currentPage: number
    private resultsPerPage: number

    public getDataToPagination(
        currentPage: number,
        totalRecords: number,
        resultsPerPage = 20,
    ): PaginationData {
        if (resultsPerPage >= 500) {
            throw new InvalidArgumentException(
                "Maximum results per page reached!",
            )
        }

        this.currentPage = currentPage
        this.totalRecords = totalRecords
        this.resultsPerPage = resultsPerPage

        const startPagination = this.getStartLimit()
        const endPagination = this.getEndLimit(startPagination)
        const totalPages = this.getTotalPages()

        return {
            currentPage: Number(this.currentPage),
            start: Number(startPagination),
            end: Number(endPagination),
            totalPages: Number(totalPages),
            totalRecords: Number(this.totalRecords),
        }
    }

    private getTotalPages() {
        return Math.ceil(this.totalRecords / this.resultsPerPage)
    }

    private getStartLimit(): number {
        if (this.totalRecords <= this.resultsPerPage) {
            return 0
        }

        return (
            Number(this.currentPage * this.resultsPerPage) -
            Number(this.resultsPerPage)
        )
    }

    private getEndLimit(startLimit: number) {
        return Number(startLimit) + Number(this.resultsPerPage)
    }
}
