import {NextFunction, Request, Response} from "express";

function paginationProvider(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const {page, limit}: { page: number, limit: number } = req.query;
    if (!page || !limit) {
        res.status(400).json({
            message: 'Bad request: page and limit are required'
        });
        next('route');
        return;
    }

    // @ts-ignore
    req.pagination = {
        page,
        limit
    };

    next();
}

export default paginationProvider;