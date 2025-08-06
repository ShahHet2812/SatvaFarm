from rest_framework import serializers
from .models import PlantHealthReport

class PlantHealthReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantHealthReport
        fields = '__all__'
