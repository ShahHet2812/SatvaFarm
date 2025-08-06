from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Comment, Like, Article
from .serializers import CommentSerializer, LikeSerializer
from rest_framework import generics
from .serializers import ArticleSerializer

class ArticleListAPIView(generics.ListAPIView):
    queryset = Article.objects.all().order_by('-date')
    serializer_class = ArticleSerializer

class ArticleDetailAPIView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'id'

class AddCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, article=article)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, article_id):
        try:
            article = Article.objects.get(id=article_id)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

        like_exists = Like.objects.filter(user=request.user, article=article).exists()
        if like_exists:
            return Response({'detail': 'Already liked'}, status=status.HTTP_400_BAD_REQUEST)

        like = Like.objects.create(user=request.user, article=article)
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemoveLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, article_id):
        try:
            like = Like.objects.get(user=request.user, article_id=article_id)
            like.delete()
            return Response({'detail': 'Like removed'}, status=status.HTTP_204_NO_CONTENT)
        except Like.DoesNotExist:
            return Response({'error': 'Like not found'}, status=status.HTTP_404_NOT_FOUND)

