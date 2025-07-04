from django.urls import path
from . import views

urlpatterns = [
    path('button-pressed/', views.button_pressed, name='button_pressed'),
]