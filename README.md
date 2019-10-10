![](https://img.shields.io/github/issues/certmichelin/PTART.svg)
![](https://img.shields.io/github/forks/certmichelin/PTART.svg)
![](https://img.shields.io/github/stars/certmichelin/PTART.svg)
![](https://img.shields.io/github/license/certmichelin/PTART.svg)

# PTART (Pentests, Audits, and Reporting tool).

PTART is a vulnerability organizer tool developed for Pentesters, Bug bounty hunters, Anybody who wants to be a hacker. Basically this tool will allow you to :

- Report a vulnerabiltity with Screenshots, Attachments, CVSSv3 Score, OWASP Top l0 labels in less than 3min.
- Avoid retyping again and again the same vulnerability content by using templates.
- Generate ToDo lists from Pentest methodologies. (Owasp and Wahh are natively included).
- Have shared resources within the team.
- Generate automatically a nice HTML/PDF RevealJS report.
- Customize yours labels for categorizing vulnerabilities.

Coming soon : 
- Scope/Discovery Management.
- Remediation management.
- Timeline for hits
- Connectivity with common service (HackerOne, Bugcrowd, JIRA, Slack, etc...) 

A special thanks to [@pavanw3b](https://twitter.com/pavanw3b) for the [Sh00t!](https://github.com/pavanw3b/sh00t) project.

![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot3.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot1.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot2.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot5.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot6.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot7.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot8.PNG)

# Release Note

### Version 1.1
- Add user comments in Hits, these comments will be displayed in the presentor view of Reveal js report.

### Version 1.0
- Initial Version.

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

## Upgrade:

1. Navigate to the folder where PTART was cloned: `cd PTART`
2. Stop the server if it's running: `Ctrl + C`
3. Pull the latest code base via git: `git pull` or download the source from Github and replace the files.
4. Setup any additional dependencies: `pipenv install`
5. Run the virtual environment: `pipenv shell`
6. Make the latest database changes: `python manage.py migrate`
7.  Start the server: `python manage.py runserver`
8. Enjoy

