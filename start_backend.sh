#!/bin/bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
