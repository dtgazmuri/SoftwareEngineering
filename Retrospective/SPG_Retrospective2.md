RETROSPECTIVE: Team P13
=====================================

The retrospective should include _at least_ the following
sections:

- [Process Measures](#process-measures)
- [Quality Measures](#quality-measures)
- [General Assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: ? vs ? 
- Total points committed vs done: ? vs ? 
- Nr of hours planned vs spent (as a team): 96 vs 102

**Remember**  a story is done ONLY if it fits the Definition of Done:



- Code review completed

- Code present on VCS

- Unit testing done

- E2E testing done

> In this sprint number 2, we have revised our DoD with respect to sprint number 1, in order to consider also unit testing and E2E testing as part od DoD.


### Detailed statistics
<!--- Here I put calcules in comments

STORY 0: TASKS DONE = sprint planning(9h vs 9h), implement clock (2h vs 2h 15m), TD Estimation and Management (6h vs 5h15m), Resolve Github Issues (2h vs 2h), Responsive Interface (3h vs 3h), Put togheter documentation (1h vs 2h), Scrum meeting (6h vs 6h), Restospective (6h vs 6h) 
STORY 0: TASKS NOT DONE =SonarQube(3h vs 3h), Docker (6h vs 9h 30m), Backend testing (6h vs 16h30m), Frontend testing (10h vs 12h30m), Rearrange application behaviour according to system clock (8h vs 5h)

STORY 10: TASKS DONE: SPG-10:API (3h vs 3h), SPG-10:Backend (4h vs 4h)
STORY 10: TASKS NOT DONE: SPG-10:Frontend (3h vs 1h30m)

STORY 11: TASKS DONE: _None_
STORY 11: TASKS NOT DONE: SPG-11:Frontend (3h vs 6h), SPG-11:API (3h vs 2h15m), SPG-11:Backend (3h vs 2h15m)

STORY 12: TASKS DONE: _None_
STORY 12: TASKS NOT DONE: SPG-12:Frontend (3h vs 1h), SPG-12:API (3h vs 0h), SPG-12:Backend (3h vs 0h)
--->
| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |   13    | -      |      68h   |     82h      |
| 10    |     3   |     5  |      10h   |      8h 30m  |
|    11 |     3   |     5  |      9h    |    10h 30m   |
|    12 |     3   |     3  |      9h    |      1h      |


> 'place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - average estimated: 96h / 22 =   **4.36**
  - average actual: 102h / 22 =   **4.63**
  - standard deviation: **2.3461**
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  - 96h/102h = **0,941**

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated		20h
  - Total hours spent			34h
  - Nr of automated unit test cases 
    - Frontend Unit Testing: 27
    - Backend Unit Testing: 18
  - Coverage (if available)		0%
- E2E testing:
  - Total hours estimated		5h
  - Total hours spent			3h (stefano)
- Code review 
  - Total hours estimated 		4h 30m
  - Total hours spent			4h 30m

- Technical Debt management:		
  - Total hours estimated 		3h
  - Total hours spent			3h
  - Hours estimated for remediation by SonarQube		
    - Reliability 0m 
    - Security 0m
    - Maintainability 2d 3h
    - Total of 2h 3h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
    - Critics: 11 issues for a total of 1h 26m
    - Major: 85 issues for a total of 1d 6h
    - Total of: 2d 3h
  - Hours spent on remediation 														3h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")									0.6%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability)	
    - Reliability: A
    - Security: A
    - Maintainability: A

NOTE: out policy is to remedy at all Critics and Major issues, and ignore minor.

## ASSESSMENT

- What caused your errors in estimation (if any)?

  We made errors in estimation mainly because we spent more time than expected on learning the technologies needed for testing.

- What lessons did you learn (both positive and negative) in this sprint?

  Negative lessons:

  We are spending a lot of time in the sprint planning rather than in the actual work and, even if it results on a more organized plan, we have a limited time to work and in proportion a lot of it consists on planning.

  Positive lessons:

  We learned the importance of testing since it proved to be very useful and insightful for our purposes. Moreover, we divided the work load in a better way compared to the previous sprint.

- Which improvement goals set in the previous retrospective were you able to achieve?
 
    We managed very well to include most of the testing phase in the sprint.

- Which ones you were not able to achieve? Why?

    We were not able to include all of the E2E testing and we were not efficient in our meetings.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  We want to deliver a complete work, both on developing and testing. We also want to be more organized and efficient during all the meeting in order to have more time for the project.  

- One thing you are proud of as a Team:

  We are increasing very quickly our global knowledge about programming a web application, especially in the testing part. 
