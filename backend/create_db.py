from api.db.database import Base, engine
from models.problem import Problem
from models.room import Room

# This will create all tables in the database
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    create_tables() 