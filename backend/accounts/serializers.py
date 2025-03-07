from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    User serializer extending the model serializer to convert models to and
    from the standard JSON format. 
    """

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name",
                    "date_joined"]
        # The ID and the join date cannot be modified when updating the user.
        read_only_fields = ["id", "date_joined"]

class UserCreateSerializer(serializers.ModelSerializer):
    """
    The serializer that manages
    """
    password = serializers.CharField(write_only=True, required=True, 
                            validators=[]) # Could add 'validate_password'
    confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Tells which model where converting to and fro using this serializer
        model = User
        fields = ["username", "email", "password", "confirmation", "first_name",
                  "last_name"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmation"]:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
                })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop("confirmation")
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Class to let the user update their information. 
    """
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
        extra_kwargs = {
            "email": {"required": False}
        }