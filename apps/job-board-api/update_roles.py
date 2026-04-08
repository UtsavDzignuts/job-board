from app.models.models import User
from app.db.session import engine
from sqlmodel import Session, select

with Session(engine) as session:
    users = session.exec(select(User)).all()
    count = 0
    for u in users:
        if u.role == 'job_seeker':
            u.role = 'candidate'
            session.add(u)
            count += 1
    session.commit()
    print(f'Updated {count} users to candidate role')
