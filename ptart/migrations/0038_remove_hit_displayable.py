# Generated by Django 4.2.13 on 2024-09-06 15:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ptart', '0037_hit_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hit',
            name='displayable',
        ),
    ]