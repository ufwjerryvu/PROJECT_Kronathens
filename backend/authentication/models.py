from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, username, first_name, last_name, email, password, **kwargs):
        if not username:
            raise ValueError('Username must be set')
    
        if not password:
            raise ValueError('Password must be set')
        
        if not first_name or not last_name:
            raise ValueError('Name fields must be provided')
        
        if not email:
            raise ValueError('Email must be provided')
        
        email = self.normalize_email(email)
        user = self.model(username=username, 
                          first_name=first_name,
                          last_name=last_name,
                          email=email,
                          **kwargs)

        user.set_password(password)
        user.save(using=self._db)

        return user

class User(AbstractUser):
    username = models.CharField(max_length=128, unique=True)
    first_name = models.CharField(max_length=128, null=False)
    last_name = models.CharField(max_length=128, null=False)
    email = models.EmailField(null=False, unique=True)
    password = models.CharField(max_length=128, null=False)

    objects = UserManager()

    def __str__(self):
        return self.username
