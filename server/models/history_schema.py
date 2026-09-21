"""History schema and database operations"""

from datetime import datetime
from bson import ObjectId
from config.database import get_collection

class History:
    """History model for MongoDB operations"""
    
    COLLECTION_NAME = "history"
    
    def __init__(self, data=None):
        """Initialize history with data"""
        if data:
            self._id = data.get('_id')
            self.user_id = data.get('user_id')
            self.topic = data.get('topic')
            self.concepts = data.get('concepts', [])
            self.critiques = data.get('critiques', [])
            self.refined = data.get('refined', [])
            self.presentation = data.get('presentation', {})
            self.agent_model = data.get('agent_model')
            self.prompt_style = data.get('prompt_style')
            self.execution_time = data.get('execution_time')
            self.created_at = data.get('created_at')
    
    @staticmethod
    def get_collection():
        """Get history collection"""
        return get_collection(History.COLLECTION_NAME)
    
    @staticmethod
    def create_history(user_id, topic, concepts, critiques, refined, presentation, 
                      agent_model, prompt_style, execution_time):
        """Create a new history entry"""
        collection = History.get_collection()
        
        history_data = {
            "user_id": ObjectId(user_id),
            "topic": topic,
            "concepts": concepts,
            "critiques": critiques,
            "refined": refined,
            "presentation": presentation,
            "agent_model": agent_model,
            "prompt_style": prompt_style,
            "execution_time": execution_time,
            "created_at": datetime.utcnow()
        }
        
        result = collection.insert_one(history_data)
        history_data['_id'] = result.inserted_id
        
        return History(history_data)
    
    @staticmethod
    def find_by_id(history_id):
        """Find history by ID"""
        try:
            collection = History.get_collection()
            history_data = collection.find_one({"_id": ObjectId(history_id)})
            return History(history_data) if history_data else None
        except Exception as e:
            print(f"Error finding history by ID: {e}")
            return None
    
    @staticmethod
    def find_by_user_id(user_id, skip=0, limit=50):
        """Find all history entries for a user"""
        try:
            collection = History.get_collection()
            history_data = collection.find(
                {"user_id": ObjectId(user_id)}
            ).skip(skip).limit(limit).sort("created_at", -1)
            return [History(data) for data in history_data]
        except Exception as e:
            print(f"Error finding history by user ID: {e}")
            return []
    
    @staticmethod
    def count_by_user_id(user_id):
        """Count total history entries for a user"""
        try:
            collection = History.get_collection()
            return collection.count_documents({"user_id": ObjectId(user_id)})
        except Exception as e:
            print(f"Error counting history: {e}")
            return 0
    
    @staticmethod
    def delete_history(history_id):
        """Delete history by ID"""
        try:
            collection = History.get_collection()
            result = collection.delete_one({"_id": ObjectId(history_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting history: {e}")
            return False
    
    @staticmethod
    def delete_user_history(user_id):
        """Delete all history for a user"""
        try:
            collection = History.get_collection()
            result = collection.delete_many({"user_id": ObjectId(user_id)})
            return result.deleted_count
        except Exception as e:
            print(f"Error deleting user history: {e}")
            return 0
    
    def to_dict(self):
        """Convert history to dictionary"""
        return {
            "id": str(self._id),
            "user_id": str(self.user_id),
            "topic": self.topic,
            "concepts": self.concepts,
            "critiques": self.critiques,
            "refined": self.refined,
            "presentation": self.presentation,
            "agent_model": self.agent_model,
            "prompt_style": self.prompt_style,
            "execution_time": self.execution_time,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    
    @staticmethod
    def create_indexes():
        """Create database indexes for better performance"""
        collection = History.get_collection()
        
        # Create indexes
        collection.create_index("user_id")
        collection.create_index("created_at")
        collection.create_index([("user_id", 1), ("created_at", -1)])
        
        print("✅ History indexes created successfully")