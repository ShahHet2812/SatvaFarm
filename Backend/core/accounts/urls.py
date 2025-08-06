from django.urls import path
from .views import RegisterView, LoginView, WeatherView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('weather/', WeatherView.as_view(), name='weather'),
]