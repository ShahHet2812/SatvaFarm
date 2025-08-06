from django.db import models
from accounts.models import CustomUser

CATEGORY_CHOICES = [
    ('crops', 'Crops'),
    ('vegetables', 'Vegetables'),
    ('pests', 'Pests'),
    ('diseases', 'Diseases'),
    ('techniques', 'Techniques'),
    ('seasonal', 'Seasonal'),
]

class Article(models.Model):
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    popular_tags = models.CharField(max_length=255, help_text="Comma-separated tags")
    date = models.DateField(auto_now_add=True)
    title = models.CharField(max_length=200)
    summary = models.TextField(max_length=500, help_text="Brief summary of the article", blank=True, null=True)
    image = models.ImageField(upload_to='article_images/')
    description = models.TextField()
    total_mins = models.PositiveIntegerField(help_text="Estimated reading time in minutes")
    popular_tags = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return self.title
    
class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='comments')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='comments')
    description = models.TextField()

    def __str__(self):
        return f'Comment by {self.user.username} on {self.article.title}'
    
class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='likes')

    def __str__(self):
        return f'Like by {self.user} on {self.article}'
