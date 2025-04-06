from rest_framework import serializers

from .models import *

class GroupGeneralSerializer(serializers.ModelSerializer):
    """
    Serializer for group. Converts back and forth to and from native Python/Dja-
    ngo models/datatypes and JSON formats.
    """

    class Meta:
        model = Group
        fields = ["id", "creator", "name", "description"]
        read_only_fields = ["id", "creator"]

class GroupCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a group (only for creating a group). This is because
    we want the creator to be writeable when creating.
    """
    class Meta:
        model = Group
        fields = ["id", "creator", "name", "description"]
        read_only_fields = ["id"]
    
class ContributorSerializer(serializers.ModelSerializer):
    """
    Serializer for a contributor within a group.
    """
    
    class Meta:
        model = Contributor
        fields = ["id", "user", "group"]
        read_only_fields = ["id"]