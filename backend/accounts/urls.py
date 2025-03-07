from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, UserDetailView, LogoutView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", UserDetailView.as_view(), name="user-detail")
]