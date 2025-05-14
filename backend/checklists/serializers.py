from rest_framework import serializers

from .models import Workspace, Item, Subitem

class CreateWorkspaceSerializer(serializers.ModelSerializer):
    """
    Serializer to create a workspace. 
    """
    class Meta:
        model = Workspace
        fields = ["id", "group", "name", "description"]
        read_only_fields = ["id"]

class WorkspaceSerializer(serializers.ModelSerializer):
    """
    Serializer for workspace. It serializes and gives freedom to the modification
    methods. However, it doesn't allow the modification of group because once the
    group is created. 
    """
    class Meta:
        model = Workspace
        fields = ["id", "group", "name", "description"]
        read_only_fields = ["id", "group"]

class CreateItemSerializer(serializers.ModelSerializer):
    """
    Serializer for creating items. Everything is modifiable except the group it 
    belongs to and its ID.
    """
    class Meta:
        model = Item
        fields = ["id", "workspace", "heading"]
        read_only_fields = ["id"]

class ItemSerializer(serializers.ModelSerializer):
    """
    Serializer for items. Only for modification of the content and not the work-
    space that it belongs to. 
    """
    class Meta:
        model = Item
        fields = ["id", "workspace", "heading"]
        read_only_fields = ["id", "workspace"]

class CreateSubitemSerializer(serializers.ModelSerializer):
    """
    A create serializer for subitems. Only for the creation of the content.
    """
    class Meta:
        model = Subitem
        fields = ["id", "item", "content", "weight", "completion_status"]
        read_only_fields = ["id"]
    
class SubitemSerializer(serializers.ModelSerializer):
    """
    A serializer for subitems and only modifiable for the creation of the conte-
    nt except ID and the ID of the item the subitem belongs to.
    """
    class Meta:
        model = Subitem
        fields = ["id", "item", "content", "weight", "completion_status"]
        read_only_fields = ["id", "item"]