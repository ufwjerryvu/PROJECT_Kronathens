from django.db import models

from collaboration.models import *

class Workspace(models.Model):
    """
    This is the checklist itself. This is just another name for it.
    """

    class Meta:
        db_table = "Workspace"
        verbose_name = "Workspace/Checklist"
        verbose_name_plural = "Workspaces/Checklists"
    
    # Points to the group that contains the workspace
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(max_length=128, null=False)
    description = models.TextField(null=True)

class Item(models.Model):
    """
    This is an item in the checklist. Synonymous to a header.
    """
    
    class Meta:
        db_table = "Item"
        verbose_name = "Item"
        verbose_name_plural = "Items"
    
    # Points to the checklist that contains this item.
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    heading = models.TextField(null=False, blank=True)

class Subitem(models.Model):
    """
    This is a sub-item under the checklist item/heading. 
    """
    
    class Meta:
        db_table = "Subitem"
        verbose_name = "Subitem"
        verbose_name_plural = "Subitems"
    
    # Points to the item that points to it. 
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    content = models.TextField(null=False, blank=True)

    # Each subitem has a value of one unless specified otherwise. 
    weight = models.IntegerField(default=1, null=False)
    completion_status = models.BooleanField(default=False, null=False)