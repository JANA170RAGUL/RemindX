from app.core.database import SessionLocal
from app.models.users import User

db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"Total Users in DB: {len(users)}")
    for u in users:
        print(f"\nID: {u.id}")
        print(f"Name: {u.full_name}")
        print(f"Email: {u.email}")
        print(f"Timezone: {u.timezone}")
finally:
    db.close()
