"""
Anything related to resetting the database for the accounts application. This 
is for testing purposes. 
"""

from .models import User

def set_all_passwords():
    """
    Sets all passwords to "password" when initializing the database. This func-
    tion must be called through the Django shell.
    """
    users = User.objects.all()
    
    for user in users:
        user.set_password("password")
        user.save()
