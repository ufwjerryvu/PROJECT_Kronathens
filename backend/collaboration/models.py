from django.db import models
from django.utils import timezone

from accounts.models import User

class Group(models.Model):
    """
    Group is synonymous with collection. A user might have a set of collections
    to which their checklists exist. 
    """

    class Meta:
        db_table = "Group"
        verbose_name = "Group/Collection"
        verbose_name_plural = "Groups/Collections"
    
    # The user holds the creator ID. We delete the groups if the user is deleted.
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, null=False)
    description = models.TextField(null=True)

class Contributor(models.Model):
    """
    Group contributor is the contributor to a group. This is basically a junct-
    ion table.
    """

    class Meta:
        db_table = "Contributor"
        verbose_name = "Contributor"
        verbose_name_plural = "Contributors"
    
    # The group ID and the user ID are linked. 
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    