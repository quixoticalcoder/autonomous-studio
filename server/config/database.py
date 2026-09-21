"""MongoDB database configuration and connection"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()

class Database:
    """MongoDB database connection manager"""
    
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        """Singleton pattern to ensure single database connection"""
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize database connection"""
        if self._client is None:
            self._connect()
    
    def _connect(self):
        """Establish connection to MongoDB"""
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            database_name = os.getenv("DATABASE_NAME", "autonomous_studio")
            
            self._client = MongoClient(
                mongodb_uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                maxPoolSize=50
            )
            
            # Test connection
            self._client.admin.command('ping')
            
            self._db = self._client[database_name]
            print(f"✅ Successfully connected to MongoDB: {database_name}")
            
        except ConnectionFailure:
            print("❌ Failed to connect to MongoDB - Connection refused")
            raise
        except ServerSelectionTimeoutError:
            print("❌ Failed to connect to MongoDB - Server selection timeout")
            raise
        except Exception as e:
            print(f"❌ MongoDB connection error: {str(e)}")
            raise
    
    def get_db(self):
        """Get database instance"""
        if self._db is None:
            self._connect()
        return self._db
    
    def get_collection(self, collection_name):
        """Get specific collection"""
        return self.get_db()[collection_name]
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()
            print("✅ MongoDB connection closed")

# Create singleton instance
db_instance = Database()

def get_database():
    """Helper function to get database instance"""
    return db_instance.get_db()

def get_collection(collection_name):
    """Helper function to get collection"""
    return db_instance.get_collection(collection_name)