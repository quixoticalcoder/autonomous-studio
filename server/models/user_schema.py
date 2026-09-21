"""User schema and database operations"""

from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from config.database import get_collection

class User:
    """User model for MongoDB operations"""
    
    COLLECTION_NAME = "users"
    
    def __init__(self, data=None):
        """Initialize user with data"""
        if data:
            self._id = data.get('_id')
            self.username = data.get('username')
            self.email = data.get('email')
            self.password_hash = data.get('password_hash')
            self.full_name = data.get('full_name')
            self.role = data.get('role', 'user')
            self.is_active = data.get('is_active', True)
            self.preferences = data.get('preferences', {})
            self.created_at = data.get('created_at')
            self.updated_at = data.get('updated_at')
            self.last_login = data.get('last_login')
    
    @staticmethod
    def get_collection():
        """Get users collection"""
        return get_collection(User.COLLECTION_NAME)
    
    @staticmethod
    def create_user(username, email, password, full_name=None, role='user'):
        """Create a new user"""
        collection = User.get_collection()
        
        # Check if user already exists
        if collection.find_one({"$or": [{"username": username}, {"email": email}]}):
            return None, "User with this username or email already exists"
        
        user_data = {
            "username": username,
            "email": email,
            "password_hash": generate_password_hash(password),
            "full_name": full_name,
            "role": role,
            "is_active": True,
            "preferences": {
                "default_agent": "gemini",
                "default_prompt_style": "standard",
                "theme": "light"
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": None
        }
        
        result = collection.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        
        return User(user_data), None
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        try:
            collection = User.get_collection()
            user_data = collection.find_one({"_id": ObjectId(user_id)})
            return User(user_data) if user_data else None
        except Exception as e:
            print(f"Error finding user by ID: {e}")
            return None
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        collection = User.get_collection()
        user_data = collection.find_one({"username": username})
        return User(user_data) if user_data else None
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        collection = User.get_collection()
        user_data = collection.find_one({"email": email})
        return User(user_data) if user_data else None
    
    @staticmethod
    def authenticate(username_or_email, password):
        """Authenticate user with username/email and password"""
        collection = User.get_collection()
        user_data = collection.find_one({
            "$or": [
                {"username": username_or_email},
                {"email": username_or_email}
            ]
        })
        
        if not user_data:
            return None, "User not found"
        
        if not user_data.get('is_active'):
            return None, "Account is deactivated"
        
        if not check_password_hash(user_data['password_hash'], password):
            return None, "Invalid password"
        
        # Update last login
        collection.update_one(
            {"_id": user_data['_id']},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        return User(user_data), None
    
    def update(self, update_data):
        """Update user information"""
        collection = User.get_collection()
        
        # Don't allow updating sensitive fields directly
        sensitive_fields = ['_id', 'password_hash', 'created_at']
        for field in sensitive_fields:
            update_data.pop(field, None)
        
        update_data['updated_at'] = datetime.utcnow()
        
        result = collection.update_one(
            {"_id": self._id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    def update_password(self, new_password):
        """Update user password"""
        collection = User.get_collection()
        
        result = collection.update_one(
            {"_id": self._id},
            {"$set": {
                "password_hash": generate_password_hash(new_password),
                "updated_at": datetime.utcnow()
            }}
        )
        
        return result.modified_count > 0
    
    def update_preferences(self, preferences):
        """Update user preferences"""
        collection = User.get_collection()
        
        result = collection.update_one(
            {"_id": self._id},
            {"$set": {
                "preferences": preferences,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return result.modified_count > 0
    
    def deactivate(self):
        """Deactivate user account"""
        collection = User.get_collection()
        
        result = collection.update_one(
            {"_id": self._id},
            {"$set": {
                "is_active": False,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return result.modified_count > 0
    
    def activate(self):
        """Activate user account"""
        collection = User.get_collection()
        
        result = collection.update_one(
            {"_id": self._id},
            {"$set": {
                "is_active": True,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    def delete_user(user_id):
        """Delete user by ID"""
        try:
            collection = User.get_collection()
            result = collection.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting user: {e}")
            return False
    
    @staticmethod
    def get_all_users(skip=0, limit=50, active_only=True):
        """Get all users with pagination"""
        collection = User.get_collection()
        
        query = {"is_active": True} if active_only else {}
        
        users_data = collection.find(query).skip(skip).limit(limit).sort("created_at", -1)
        return [User(user_data) for user_data in users_data]
    
    @staticmethod
    def count_users(active_only=True):
        """Count total users"""
        collection = User.get_collection()
        query = {"is_active": True} if active_only else {}
        return collection.count_documents(query)
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        user_dict = {
            "id": str(self._id),
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "preferences": self.preferences,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }
        
        if include_sensitive:
            user_dict['password_hash'] = self.password_hash
        
        return user_dict
    
    @staticmethod
    def create_indexes():
        """Create database indexes for better performance"""
        collection = User.get_collection()
        
        # Create unique indexes
        collection.create_index("username", unique=True)
        collection.create_index("email", unique=True)
        
        # Create regular indexes
        collection.create_index("role")
        collection.create_index("is_active")
        collection.create_index("created_at")
        
        print("✅ User indexes created successfully")