from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config.database import db_instance
from models.user_schema import User
from models.history_schema import History
from routes.agent_routes import agent_bp
from routes.studio_routes import studio_bp
from routes.config_routes import config_bp
from routes.health_routes import health_bp
from routes.user_routes import user_bp
from routes.history_routes import history_bp

load_dotenv()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Disable strict slashes globally to prevent 308 redirects
    app.url_map.strict_slashes = False
    
    # Configure CORS properly for all routes
    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True
    )
    
    # Initialize database connection
    try:
        db_instance.get_db()
        # Create indexes for better performance
        User.create_indexes()
        History.create_indexes()
        print("✅ Database indexes created successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not connect to database: {e}")
    
    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(agent_bp, url_prefix='/api/ai/agents')
    app.register_blueprint(studio_bp, url_prefix='/api/studio')
    app.register_blueprint(config_bp, url_prefix='/api/config')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(history_bp, url_prefix='/api/history')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000, host='0.0.0.0')

app = create_app()