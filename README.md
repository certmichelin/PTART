![](https://img.shields.io/github/issues/Fisjkars/PTART.svg)
![](https://img.shields.io/github/forks/Fisjkars/PTART.svg)
![](https://img.shields.io/github/stars/Fisjkars/PTART.svg)
![](https://img.shields.io/github/license/Fisjkars/PTART.svg)

# PTART (Pentests, Audits, and Reporting tool).

PTART is a vulnerability organizer tool developed for Pentesters, Bug bounty hunters, Anybody who wants to hack.

## Installation

**Preparing PTART environment :**

Python requires Python 3.7 and a few more packages. The simplest way to set up PTART is using  [pipenv](https://github.com/pypa/pipenv). 

1. Clone the project and go to the new directory.
2. Create a new virtual environment and installing dependencies: `pipenv install`.
3. Run the virtual environment: `pipenv shell`
4. Create the database: `python manage.py migrate`
5. Create the super user: `python manage.py createsuperuser`
6. (Optional) Initiate PTART with integrated loader.

That's all for the first time. Follow the next steps whenever you want to start PTART.

**Starting PTART:**

1. Run the virtual environment: `pipenv shell`
2. Start PTART server: `python manage.py runserver`
3. Access [http://127.0.0.1:8000/](http://127.0.0.1:8000/) on your favorite browser.
4. Login with the user credentials.
5. Welcome to PTART.
6. Once you are done, stop the server: `Ctrl + C`
