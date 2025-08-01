from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Member

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_member_for_new_user(sender, instance, created, **kwargs):
    if created:
        Member.objects.get_or_create(user=instance)
