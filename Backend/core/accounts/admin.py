from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# We create a custom admin class to display your new fields
class CustomUserAdmin(UserAdmin):
    # This extends the base UserAdmin to include your custom fields
    model = CustomUser
    
    # Add your custom fields to the list display in the admin panel
    list_display = ('username', 'email', 'individual_type', 'location', 'is_staff')
    
    # Add your custom fields to the editing form in the admin panel
    # This adds a new section called "Custom Fields" to the user edit page
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('individual_type', 'location', 'id_proof')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('individual_type', 'location', 'id_proof')}),
    )

# Register your CustomUser model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)