# Generated by Django 3.2.16 on 2023-01-11 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ptart", "0025_case_reference"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="methodologies",
            field=models.ManyToManyField(to="ptart.Methodology"),
        ),
    ]
