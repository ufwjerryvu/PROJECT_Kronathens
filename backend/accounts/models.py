from django.db import models
from django.utils import timezone

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier for authentication
    instead of usernames.
    """
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set.")
        if not username:
            raise ValueError("Username must be set")
        
        # Normalize email into standard format (lowercase, no trailing spaces, etc.)
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        
        # Handles the hashing, it should.
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        # Passing extra fields that have been set to the class function
        return self.create_user(username, email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    """
    Our user model is defined here.
    """

    class Meta:
        db_table = "User"
        verbose_name = "User"
        verbose_name_plural = "Users"

    # Fields are not nullable by default
    username = models.CharField(max_length=128, unique=True)
    email = models.CharField(max_length=128, unique=True)
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    email = models.CharField(max_length=128, unique=True)
    
    # These are extra fields that were recommended by docs for superuser
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # This is to manage all the database operations related to the user.
    objects = UserManager()
    
    # Overriding attributes from the base user class
    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["email", "first_name", "last_name"]

    def __str__(self):
        return self.username