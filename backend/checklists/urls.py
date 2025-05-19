from django.urls import path
from . import views

urlpatterns = [
    path('workspace/all/<int:group_id>/', views.get_all_workspaces),
    path('workspace/create/<int:group_id>/', views.create_workspace),
    path('workspace/update/<int:workspace_id>/', views.modify_workspace_details),
    path('workspace/delete/<int:workspace_id>/', views.delete_workspace),
    path('workspace/item/create/<int:workspace_id>/', views.create_item),
    path('workspace/item/all/<int:workspace_id>/', views.get_all_items),
    path('workspace/item/update/<int:item_id>/', views.modify_item),
    path('workspace/item/delete/<int:item_id>/', views.delete_item)
]