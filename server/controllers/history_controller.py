"""Controller for history operations"""

from models.history_schema import History

def get_user_history(user_id, page=1, per_page=20):
    """Get user's history with pagination"""
    skip = (page - 1) * per_page
    
    history_entries = History.find_by_user_id(user_id, skip=skip, limit=per_page)
    total_entries = History.count_by_user_id(user_id)
    
    return {
        "history": [entry.to_dict() for entry in history_entries],
        "total": total_entries,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_entries + per_page - 1) // per_page
    }, 200

def get_history_by_id(history_id, user_id):
    """Get a specific history entry"""
    history_entry = History.find_by_id(history_id)
    
    if not history_entry:
        return {"error": "History entry not found"}, 404
    
    # Verify the history belongs to the user
    if str(history_entry.user_id) != user_id:
        return {"error": "Unauthorized to view this history"}, 403
    
    return {
        "history": history_entry.to_dict()
    }, 200

def delete_history_entry(history_id, user_id):
    """Delete a specific history entry"""
    history_entry = History.find_by_id(history_id)
    
    if not history_entry:
        return {"error": "History entry not found"}, 404
    
    # Verify the history belongs to the user
    if str(history_entry.user_id) != user_id:
        return {"error": "Unauthorized to delete this history"}, 403
    
    success = History.delete_history(history_id)
    
    if not success:
        return {"error": "Failed to delete history"}, 500
    
    return {
        "message": "History entry deleted successfully"
    }, 200

def clear_user_history(user_id):
    """Clear all history for a user"""
    deleted_count = History.delete_user_history(user_id)
    
    return {
        "message": f"Deleted {deleted_count} history entries",
        "deleted_count": deleted_count
    }, 200