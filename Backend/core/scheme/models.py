from django.db import models
from django.utils.dateparse import parse_date

class Scheme(models.Model):
    title = models.CharField(max_length=200)
    provider = models.CharField(max_length=100)
    organizationName = models.CharField(max_length=150)
    contactName = models.CharField(max_length=100)
    contactEmail = models.EmailField()
    contactPhone = models.CharField(max_length=20)
    deadline = models.DateField(null=True, blank=True)
    description = models.TextField()
    eligibility = models.TextField()
    benefits = models.TextField()
    documents = models.TextField(help_text="List required documents")
    applicationProcess = models.TextField()
    website = models.URLField(blank=True)
    tags = models.CharField(max_length=255, help_text="Comma-separated tags")

    def __str__(self):
        return self.title

    
# Create your models here.
