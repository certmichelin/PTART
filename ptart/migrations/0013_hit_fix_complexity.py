# Generated by Django 2.2.24 on 2022-05-02 10:16

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ptart", "0012_project_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="hit",
            name="fix_complexity",
            field=models.IntegerField(
                default=0,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(3),
                ],
            ),
        ),
    ]
