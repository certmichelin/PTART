![](https://img.shields.io/github/issues/certmichelin/PTART.svg)
![](https://img.shields.io/github/forks/certmichelin/PTART.svg)
![](https://img.shields.io/github/stars/certmichelin/PTART.svg)
![](https://img.shields.io/github/license/certmichelin/PTART.svg)

# PTART (PenTests, Audits, and Reporting Tool).

PTART is a vulnerability organizer tool developed for pentesters, bug bounty hunters, anybody who wants to leverage its security expertise. Basically this tool will help you to :

- Report a vulnerabiltity with screenshots, attachments, CVSSv3 Score, OWASP top 10 labels in less than 3min.
- Avoid retyping again and again the same vulnerabilities content by using templates.
- Generate ToDo lists from pentest methodologies (OWASP and Wahh are natively included) and assign tasks to a project member.
- Generate automatically a nice HTML/PDF RevealJS report.
- Customize yours labels for categorizing vulnerabilities.
- Have discussions on a bug using the comment area.
- Have a common and shared workspace within the team. 


A special thanks to [@pavanw3b](https://twitter.com/pavanw3b) for the [Sh00t!](https://github.com/pavanw3b/sh00t) project.

## Glossary

- **Flag:** It's a test case that needs to be tested. Flags can be generated automatically based on the testing methodology chosen or directly during the pentest. Based on our experience, flags are often useful when we are busy to struggle with an endpoint and we see a new point of interest in order to come back to it afterward.

- **Hit:** Hits are **bugs**. Typically a hit contains technical description of the bug, Affected Files/URLs, Steps To Reproduce and Fix Recommendation. Screenshots, attachments, comments can enrich the content of the vulnerability.

- **Assessment:** Assessment is a testing assessment. It can be an assessment of an application, a program - up to the user the way wanted to manage. It's a part of project.

- **Project:** Project contains assessments. Project can be a logical separation of what you do. It can be different job, bug bounty, up to you to decide.

## Screenshots

##### PTART main page
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot3.PNG)

##### Create a new hit
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot1.PNG)

##### Simply paste a screenshot to add it!
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot2.PNG)

##### Automatic report creation
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot5.PNG)

##### PTART main page
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot6.PNG)

##### Comments in your presentation
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot8.PNG)
![enter image description here](https://raw.githubusercontent.com/certmichelin/PTART/master/docs/screenshot9.PNG)

# Release Note

### Version 1.1 (Not Realeased)
- Add user comments in Hits, these comments will be displayed in the presentor view of Reveal js report.
- Add asset management for each project. Let's organize easily the scope of your project.

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
6. (Optional) Initiate PTART with integrated loaders.

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
