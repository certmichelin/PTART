# Generated by Django 3.2.15 on 2022-12-02 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ptart", "0017_rename_introduction_project_executive_summary"),
    ]

    operations = [
        migrations.AddField(
            model_name="attackscenario",
            name="body",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="attackscenario",
            name="svg",
            field=models.TextField(blank=True, default=""),
        ),
    ]
