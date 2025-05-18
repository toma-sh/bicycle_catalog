# backend/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database.database import get_db
from ..database import crud
from ..schemas import user as user_schemas
from ..utils.auth import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[user_schemas.User])
async def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: user_schemas.User = Depends(get_current_admin_user)
):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=user_schemas.User)
async def read_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: user_schemas.User = Depends(get_current_admin_user)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")
    return db_user

@router.put("/me", response_model=user_schemas.User)
async def update_user_me(
    user_data: user_schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: user_schemas.User = Depends(get_current_active_user)
):
    return crud.update_user(db=db, user_id=current_user.id, user_data=user_data)

@router.put("/{user_id}", response_model=user_schemas.User)
async def update_user(
    user_id: int,
    user_data: user_schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: user_schemas.User = Depends(get_current_admin_user)
):
    return crud.update_user(db=db, user_id=user_id, user_data=user_data)

@router.delete("/{user_id}", response_model=user_schemas.User)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: user_schemas.User = Depends(get_current_admin_user)
):
    return crud.delete_user(db=db, user_id=user_id)