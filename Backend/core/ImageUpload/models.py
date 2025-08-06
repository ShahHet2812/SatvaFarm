from django.db import models

class PlantHealthReport(models.Model):
    # The image uploaded by the user
    image = models.ImageField(upload_to='plant_images/')
    health = models.CharField(max_length=100)           
    issue = models.TextField(blank=True, null=True) # Can be blank for healthy plants
    recommendation = models.TextField(blank=True, null=True) # Can be blank for healthy plants

    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.image.name} - Health: {self.health}"