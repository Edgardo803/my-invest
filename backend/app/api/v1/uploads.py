from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.deps import get_current_user
from app.models.user import User
import uuid
import os
from pathlib import Path

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Validar extensión
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Formato no permitido. Usa JPG, PNG, WEBP o GIF"
        )

    # Generar nombre único
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / filename

    # Guardar archivo
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Devolver la URL para acceder a la imagen
    return {
        "url": f"/uploads/{filename}",
        "filename": filename
    }