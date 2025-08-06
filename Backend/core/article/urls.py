from django.urls import path
from .views import ArticleListAPIView, ArticleDetailAPIView, AddCommentAPIView, AddLikeAPIView, RemoveLikeAPIView

urlpatterns = [
    path('articles/', ArticleListAPIView.as_view(), name='article-list'),
    path('articles/<int:id>/', ArticleDetailAPIView.as_view(), name='article-detail'),
    path('articles/<int:article_id>/comment/', AddCommentAPIView.as_view(), name='add-comment'),
    path('articles/<int:article_id>/like/', AddLikeAPIView.as_view(), name='add-like'),
    path('articles/<int:article_id>/unlike/', RemoveLikeAPIView.as_view(), name='remove-like'),
]
