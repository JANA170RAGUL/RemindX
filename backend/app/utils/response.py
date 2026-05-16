from typing import Any, Dict

def success_response(data: Any = None, message: str = "Operation successful") -> Dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data or {}
    }

def error_response(message: str = "Operation failed", data: Any = None) -> Dict[str, Any]:
    return {
        "success": False,
        "message": message,
        "data": data or {}
    }
