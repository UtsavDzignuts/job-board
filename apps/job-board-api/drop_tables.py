import sys
import os
sys.path.append(os.getcwd())
from sqlmodel import create_engine, text
from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS jobtaglink CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS job CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS tag CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS company CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
    conn.commit()
print("Tables dropped.")
