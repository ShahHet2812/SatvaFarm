from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import RegisterSerializer, UserDetailSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import CustomUser
import requests

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # The serializer's .save() method calls the .create() method in RegisterSerializer
        user = serializer.save()
        
        # Create a token for the new user
        token, created = Token.objects.get_or_create(user=user)
        
        # Use the UserDetailSerializer to format the user data
        user_data = UserDetailSerializer(user).data

        # Return the token and the detailed user object
        return Response({
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            
            # --- MODIFICATION: Use UserDetailSerializer to format the response ---
            user_data = UserDetailSerializer(user).data
            
            return Response({
                'token': token.key,
                'user': user_data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class WeatherView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        city = user.location
        if not city:
            return Response({'error': 'Location not set for user'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = 'a43d48e2c6398946dd5515d9a1e4a208'
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

        try:
            response = requests.get(url)
            response.raise_for_status() 
            weather_data = response.json()
            return Response(weather_data)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)