from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PlantHealthReport
from .serializers import PlantHealthReportSerializer
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os

# Import the prediction function
from .utils.predict import predict_plant_disease

class PlantHealthReportAPIView(APIView):
    """
    Handles listing existing reports and creating new ones with predictions.
    """
    def get(self, request):
        """
        Returns a list of all saved plant health reports.
        """
        reports = PlantHealthReport.objects.all().order_by('-created_at')
        serializer = PlantHealthReportSerializer(reports, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Receives an image, runs prediction, and saves the report.
        """
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the uploaded file temporarily to process it
        try:
            file_name = default_storage.save(image_file.name, ContentFile(image_file.read()))
            image_path = os.path.join(settings.MEDIA_ROOT, file_name)

            # Get prediction from the model
            prediction_result = predict_plant_disease(image_path)

            if "error" in prediction_result:
                 # Clean up the temp file
                default_storage.delete(file_name)
                return Response(prediction_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            image_file.seek(0)
            
            # Prepare data for the serializer
            report_data = {
                'health': prediction_result.get('health'),
                'confidence': prediction_result.get('confidence'),
                'issue': prediction_result.get('issue'),
                'recommendation': prediction_result.get('recommendation'),
                # The image will be handled by the serializer
            }
            print(f"Prediction Result: {prediction_result}")
            # We need to include the image file in the data for the serializer
            # The serializer expects a file object, not just a path
            request.data['image'] = image_file
            
            # Create a mutable copy of request.data to update it
            mutable_data = request.data.copy()
            mutable_data.update(report_data)

            serializer = PlantHealthReportSerializer(data=mutable_data)
            if serializer.is_valid():
                serializer.save()
                 # We can now delete the temp file if it's not the one saved by the model
                # The ImageField already saved it to the correct location.
                if default_storage.exists(file_name):
                    # Check if the path is different from the saved instance's path
                    # This logic can be tricky; for simplicity, we assume ImageField handles it.
                    # The main point is not to leave orphaned files.
                    # If MEDIA_ROOT is the same as the upload_to folder, this might delete the file.
                    # A safer approach is to let a cleanup job handle old files in a temp directory.
                    pass
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                 # Clean up the temp file if validation fails
                default_storage.delete(file_name)
                print("Serializer validation failed:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Ensure temp file is deleted on any exception
            if 'file_name' in locals() and default_storage.exists(file_name):
                default_storage.delete(file_name)
            return Response({"error": "An unexpected error occurred.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)