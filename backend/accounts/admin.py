from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    User,
    CustomerProfile,
    HelperProfile,
    RetailerProfile,
)


admin.site.register(User, UserAdmin)
admin.site.register(CustomerProfile)
admin.site.register(HelperProfile)
admin.site.register(RetailerProfile)
