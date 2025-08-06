from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import CustomUser
from scheme.models import Scheme
from article.models import Article

class DashboardStatsView(APIView):
    def get(self, request):
        try:
            # Get counts
            farmer_count = CustomUser.objects.filter(individual_type='Farmer').count()
            scheme_count = Scheme.objects.count()
            article_count = Article.objects.count()
            
            return Response({
                'farmer_count': farmer_count,
                'scheme_count': scheme_count,
                'article_count': article_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from .models import Scheme
from .serializers import SchemeSerializer
from django.http import Http404

class SchemeAPIView(APIView):
    def get(self, request):
        schemes = Scheme.objects.all().order_by('-id')
        serializer = SchemeSerializer(schemes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SchemeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SchemeDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Scheme.objects.get(pk=pk)
        except Scheme.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        scheme = self.get_object(pk)
        serializer = SchemeSerializer(scheme)
        return Response(serializer.data)