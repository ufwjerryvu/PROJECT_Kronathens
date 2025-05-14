from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from accounts.models import User
from collaboration.models import Group, Contributor

from .models import *
from .serializers import *

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_workspaces(request, group_id):
    """
    Getting all the workspaces that are present in the group. Must be authenti-
    cated and group must belong to view. 
    """
    # User is usually automatically the user ID but group is the `Group`` object.
    user = request.user.id

    # Making sure the user has valid permissions to perform the action. 
    try:
        contributor = Contributor.objects.get(user_id=user, group_id=group_id)
    except Contributor.DoesNotExist:
        return Response({"error": "Group not found or you are not a contributor "
                        "and do not have permission to edit this workspace"},
                        status=status.HTTP_404_NOT_FOUND)
    
    # Getting the workspaces and validation.
    try:
        workspaces = Workspace.objects.filter(group_id=group_id)
        serializer = WorkspaceSerializer(workspaces, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Workspace.DoesNotExist:
        return Response({"error": "Workspace not found"}, 
                        status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_workspace(request, group_id):
    """
    Creates a workspace based on the information. must be authenticated to create
    a workspace. 
    """
    copy = request.data
    copy["group"] = group_id

    serializer = CreateWorkspaceSerializer(data=copy)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def modify_workspace_details(request, workspace_id):
    """
    Allows the user to update the information of the workspace, given it's an
    authorized user
    """
    user = request.user.id

    # Get the workspace to see where the workspace belongs to
    try:
        workspace = Workspace.objects.get(id=workspace_id)

        # Then validate the user to make sure user is authorized
        group_id = workspace.group
        try:
            Contributor.objects.get(group=group_id, 
                                    user=user)
        except Contributor.DoesNotExist:
            return Response({"error": "You do not have permission to edit this "
                            "workspace"}, status=status.HTTP_400_BAD_REQUEST)


    except Workspace.DoesNotExist:
        return Response({"error": "Workspace not found or you do not have the "
                    "permission to edit this workspace"}, 
                    status=status.HTTP_400_BAD_REQUEST)

    # Now the serialization part and saving it
    serializer = WorkspaceSerializer(workspace, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_workspace(request, workspace_id):
    """
    Lets the user delete a workspace given the ID of the workspace. however, 
    the user must be authorized. 
    """
    user = request.user.id

    # Make sure the workspace exists first
    try:
        workspace = Workspace.objects.get(id=workspace_id)

    except Workspace.DoesNotExist:
        return Response({"error": "Workspace not found or you do not have "
                         "permissions to edit the workspace"}, 
                         status=status.HTTP_400_BAD_REQUEST)

    # Then make sure the workspace belongs to the user 
    try:
        Contributor.objects.get(group=workspace.group, user=user)
    except Contributor.DoesNotExist:
        return Response({"error": "You do not have permission to edit this "
                         "workspace"}, status=status.HTTP_400_BAD_REQUEST)
    
    workspace.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)