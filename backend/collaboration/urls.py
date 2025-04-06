from django.urls import path
from . import views

urlpatterns = [
    path('groups/all/', views.get_all_groups),
    path('groups/get/<int:group_id>/', views.get_group_from_id),
    path('groups/create/', views.create_group),
    path('groups/update/<int:group_id>/', views.modify_group_details),
    path('groups/delete/<int:group_id>/', views.delete_group),
    path('groups/join/toggle/<int:group_id>/', views.toggle_join_group)
]