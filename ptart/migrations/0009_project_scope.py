# Generated by Django 2.2.8 on 2020-09-08 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ptart", "0008_introduction"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="scope",
            field=models.TextField(blank=True, default=""),
        ),
    ]
