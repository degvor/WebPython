# Generated by Django 4.2.11 on 2024-04-30 22:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=20)),
                ('job_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='jobs.job')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
            ],
        ),
    ]