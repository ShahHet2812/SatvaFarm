from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    INDIVIDUAL_TYPE_CHOICES = [
        ('Farmer', 'Farmer'),
        ('Government', 'Government'),
        ('Bank', 'Bank'),
        ('Corporate', 'Corporate'),
        ('Event', 'Event'),
    ]

    individual_type = models.CharField(max_length=20, choices=INDIVIDUAL_TYPE_CHOICES)
    id_proof = models.FileField(upload_to='id_proofs/', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username
