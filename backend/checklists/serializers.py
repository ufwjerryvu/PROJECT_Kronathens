from rest_framework import serializers

from .models import *

class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer for group. Converts back and forth to and from native Python/Dja-
    ngo models/datatypes and JSON formats.
    """

    class Meta:
        model = Group
        fields = ["id", "creator_id", "name", "description"]
        read_only_fields = ["id"]

    