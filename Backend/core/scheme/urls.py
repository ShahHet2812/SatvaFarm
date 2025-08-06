from django.urls import path
from .views import SchemeAPIView, SchemeDetailAPIView, DashboardStatsView

urlpatterns = [
    path('scheme/', SchemeAPIView.as_view(), name='scheme-list-create'),
    path('scheme/<int:pk>/', SchemeDetailAPIView.as_view(), name='scheme-detail'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]