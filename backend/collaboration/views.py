from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from accounts.models import User

from .models import *
from .serializers import *


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_groups(request):
    """
    Getting the current user and listing out their group items. Must be authen-
    ticated to view. 
    """
    user = request.user.id

    groups = Group.objects.filter(creator=user)
    serializer = GroupSerializer(groups, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_group_from_id(request, group_id):
    """
    Getting the group/collection information based on the ID of the group. 
    """
    user = request.user.id

    group = Group.objects.get(creator=user, id=group_id)
    serializer = GroupSerializer(group)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group(request):
    """
    Method to let the user create a group. This insert the user's ID taken from
    the request. 
    """
    # Set the creator's ID to the currently authenticated user. 
    copy = request.data
    copy["creator"] = request.user.id

    serializer = CreateGroupSerializer(data=copy)

    if serializer.is_valid():
        group = serializer.save()
        
        # Add the creator as a contributor as we create a group
        Contributor.objects.create(user_id=request.user.id, group_id=group.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def modify_group_details(request, group_id):
    """
    The user can modify or change one of the group details, provided that they
    have the ID of the group.  
    """

    user = request.user.id
    group = Group.objects.get(creator=user, id=group_id)

    serializer = GroupSerializer(group, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    """
    The user can delete their group given the ID.
    """
    user = request.user.id
    
    try:
        group = Group.objects.get(creator=user, id=group_id)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except:
        return Response({"error": "Group not found or you don't have permission."},
                        status=status.HTTP_404_NOT_FOUND)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_join_group(request, group_id):
    """
    If the currently authenticated user is already a part of the group, then 
    unjoin upon function call. If not already a part of a group then join.
    """
    user = request.user.id

    try:
        group = Group.objects.get(id=group_id)
        
        try:
            # Delete if found
            contributor = Contributor.objects.get(group_id=group_id, user_id=user)
            contributor.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Contributor.DoesNotExist:
            # Create if not found
            request.data["user"] = user
            request.data["group"] = group_id

            serializer = ContributorSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Group.DoesNotExist:
        return Response({"error": "Group not found or you don't have permission."},
                        status=status.HTTP_404_NOT_FOUND)
    
