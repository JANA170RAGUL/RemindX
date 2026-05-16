from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.exceptions.custom import AppException
from app.utils.response import error_response
import traceback

def add_exception_handlers(app: FastAPI):
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
    }
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(message=exc.message),
            headers=cors_headers
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        print("REQUEST VALIDATION ERROR:")
        print(exc.errors())
        print("BODY:", exc.body)
        return JSONResponse(
            status_code=422,
            content=error_response(message="Validation Error", data=exc.errors()),
            headers=cors_headers
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content=error_response(message=f"Database error occurred: {str(exc)}"),
            headers=cors_headers
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content=error_response(message=f"An unexpected error occurred: {str(exc)}"),
            headers=cors_headers
        )
