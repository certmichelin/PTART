# Generated by Django 3.2.15 on 2022-12-01 00:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("ptart", "0016_attackscenario"),
    ]

    operations = [
        migrations.RenameField(
            model_name="project",
            old_name="introduction",
            new_name="executive_summary",
        ),
    ]
