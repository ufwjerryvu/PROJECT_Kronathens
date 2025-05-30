from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from accounts.models import User
from collaboration.models import Group, Contributor

from .models import *
from .serializers import *

def workspace_exists(workspace_id):
    """
    Checks if a workspace exists. Returns true if it does and false if not.
    """
    try:
        workspace = Workspace.objects.get(id=workspace_id)
    except Workspace.DoesNotExist:
        return False
    return True

def item_exists(item_id):
    """
    Checks if an item exists. Returns true if it does and false if otherwise.
    """
    try:
        Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return False

    return True

def user_can_modify(group_id, user_id):
    """
    Checks if the user has the permission to edit the workspace. Returns true 
    if yes and false otherwise.
    """
    try:
        Contributor.objects.get(group=group_id, user=user_id)
    except Contributor.DoesNotExist:
        return False
    return True

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
                            "workspace"}, status=status.HTTP_401_UNAUTHORIZED)


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
                         "workspace"}, status=status.HTTP_401_UNAUTHORIZED)
    
    workspace.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_items(request, workspace_id):
    """
    Get all items from a workspace. User has to be authorized. No need for a m-
    ethod that finds individual items.
    """
    user = request.user.id

    # Check if the workspace that the user is asking for is valid.
    try:
        workspace = Workspace.objects.get(id=workspace_id)

        # Check if the user has permissions to access the workspace
        try:
            Contributor.objects.get(id=workspace.group.id, user=user)
        except Contributor.DoesNotExist:
            return Response({"error": "You do not have permission to access "
                             "workspace."}, status=status.HTTP_401_UNAUTHORIZED)

    except Workspace.DoesNotExist:
        return Response({"error": "Workspace does not exist or you do not have "
                         "permission to edit this workspace."}, 
                         status=status.HTTP_400_BAD_REQUEST)

    items = Item.objects.filter(workspace=workspace_id)
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_item(request, workspace_id):
    """
    Creates an item in the workspace. 
    """
    user = request.user.id

    if not workspace_exists(workspace_id=workspace_id):
        return Response({"error": "Workspace not found or you do not have "
                         "permissions to edit this workspace"}, 
                         status=status.HTTP_400_BAD_REQUEST)

    workspace = Workspace.objects.get(id=workspace_id)
    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permissions to edit this "
                         "workspace"}, status=status.HTTP_401_UNAUTHORIZED)
    
    copy = request.data
    copy["workspace"] = workspace_id
    serializer = CreateItemSerializer(data=copy)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def modify_item(request, item_id):
    """
    Lets the user modify an item. But we need to know that the user can access
    the workspace. 
    """
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({"error": "Item does not exist"}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if not workspace_exists(workspace_id=item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not have "
                        "permissions to edit this workspace"},
                        status=status.HTTP_400_BAD_REQUEST)

    workspace = Workspace.objects.get(id=item.workspace.id)
    if not user_can_modify(group_id=workspace.group.id, user_id=request.user.id):
        return Response({"error": "You do not have permissions to edit this "
                         "workspace."}, status=status.HTTP_401_UNAUTHORIZED)

    
    item = Item.objects.get(id=item_id)
    serializer = ItemSerializer(item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_item(request, item_id):
    """
    Lets the user delete an item.
    """
    user = request.user.id

    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({"error": "Item does not exist"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    if not workspace_exists(workspace_id=item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not have "
                         "permissions to edit this workspace. "},
                         status=status.HTTP_400_BAD_REQUEST)
    
    if not user_can_modify(group_id=item.workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                         "workspace"}, status=status.HTTP_401_UNAUTHORIZED)
    
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_subitems(request, item_id):
    """
    Lets the user list all subitems of an item, given the item's ID.
    """
    user = request.user.id

    if not item_exists(item_id):
        return Response({"error": "Item does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)

    item = Item.objects.get(id=item_id)

    if not workspace_exists(item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not "
                            "have permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)
    workspace = Workspace.objects.get(id=item.workspace.id)
    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                            "workspace."}, status=status.HTTP_401_UNAUTHORIZED)
    
    subitems = Subitem.objects.filter(item=item_id)
    serializer = SubitemSerializer(subitems, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_subitem(request, item_id):
    """
    Lets the user create a subitem under an item, given the item's ID.
    """
    user = request.user.id

    if not item_exists(item_id):
        return Response({"error": "Item does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)

    item = Item.objects.get(id=item_id)

    if not workspace_exists(item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not "
                            "have permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)
    
    workspace = Workspace.objects.get(id=item.workspace.id)
    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                            "workspace."}, status=status.HTTP_401_UNAUTHORIZED)
    

    copy = request.data
    copy["item"] = item_id
    serializer = CreateSubitemSerializer(data=copy)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def modify_subitem(request, subitem_id):
    """
    Allows the user to modify the subitems in the list. 
    """
    user = request.user.id

    try:
        subitem = Subitem.objects.get(id=subitem_id)
    except Subitem.DoesNotExist:
        return Response({"error": "Subitem does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)

    item_id = subitem.item.id
    if not item_exists(item_id):
        return Response({"error": "Item does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)

    item = Item.objects.get(id=item_id)

    if not workspace_exists(item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not "
                            "have permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)
    
    workspace = Workspace.objects.get(id=item.workspace.id)

    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                            "workspace."}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = SubitemSerializer(subitem, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_subitem(request, subitem_id):
    """
    Allows the user to delete a subitem, if they are authorized and the subitem
    exists, that is. 
    """
    user = request.user.id

    try:
        subitem = Subitem.objects.get(id=subitem_id)
    except Subitem.DoesNotExist:
        return Response({"error": "Subitem does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)
    item_id = subitem.item.id
    if not item_exists(item_id):
        return Response({"error": "Item does not exist or you do not have "
                            "permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)

    item = Item.objects.get(id=item_id)

    if not workspace_exists(item.workspace.id):
        return Response({"error": "Workspace does not exist or you do not "
                            "have permissions to edit this workspace."},
                            status=status.HTTP_400_BAD_REQUEST)
    
    workspace = Workspace.objects.get(id=item.workspace.id)
    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                            "workspace."}, status=status.HTTP_401_UNAUTHORIZED)
    
    subitem.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_workspace_aggr_content(request, workspace_id):
    """
    Gets all the items and subitems in a workspace. 
    """
    user = request.user.id

    if not workspace_exists(workspace_id):
        return Response({"error": "Workspace not found or you do not have "
                            "permission to edit it."},
                            status=status.HTTP_400_BAD_REQUEST)
    
    workspace = Workspace.objects.prefetch_related(
        'item_set__subitem_set'  # to avoid N + 1 query problems
    ).get(id=workspace_id)

    if not user_can_modify(group_id=workspace.group.id, user_id=user):
        return Response({"error": "You do not have permission to edit this "
                            "workspace"}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = AggregatedWorkspaceSerializer(workspace)

    return Response(serializer.data, status=status.HTTP_200_OK) 