from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from .serializers import *

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    This is the register view. Only be able to create with this and the class
    should only respond to POST requests.
    """
    queryset = User.objects.all()

    # Any user can access this even unauthenticated ones. 
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        # We could put the serializer directly but we want to use DRF's features
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        }, status=status.HTTP_201_CREATED)

class UserDetailView(generics.RetrieveUpdateAPIView):
    """
    Let the user view details about themselves and be able to update them usi-
    ng POST and PATCH methods. 
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == "PUT" or self.request.method == "PATCH":
            return UserUpdateSerializer
        return UserSerializer
    
class LogoutView(APIView):
    """
    Lets the user log out.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    