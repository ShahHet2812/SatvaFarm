from django.urls import path
from .views import PlantHealthReportAPIView

urlpatterns = [
    # This single endpoint now handles both GET (list) and POST (upload and predict)
    path('plant-health/', PlantHealthReportAPIView.as_view(), name='plant-health-api'),
]
