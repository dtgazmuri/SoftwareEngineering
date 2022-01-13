RETROSPECTIVE: Team P13
=====================================

The retrospective should include _at least_ the following
sections:

- [Process Measures](#process-measures)
- [Quality Measures](#quality-measures)
- [General Assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 6 vs 3 

- Total points committed vs done: 21 vs 11

- Nr of hours planned vs spent (as a team): 100 vs 99h 30m

  (For the three missing story we didn't have time to finish the frontend/backend testing so they are not done)

**Remember**  a story is done ONLY if it fits the Definition of Done:



- Code review completed

- Code present on VCS

- Unit testing done

- E2E testing done


> In this sprint number 4 we have used the same DoD used in the previous sprint.


### Detailed statistics
<!--- Here I put calcules in comments
hours estimated vs hours spent

STORY 0: TASKS DONE = E2E testing (7h vs 7h), Improving coverage - backend (5h30m vs 7h30m), SCRUM meeting (6h vs6h), Sprint retrospective (6h vs 6h), sprint planning (9h vs 9h), Farmer page readaptation (1h vs 1h), Rework on story 11 and main page(3h vs 4h), Docker (4h vs 4h30m),  Github issues (3h vs 2h30m), Improving coverage - frontend (6h vs 8h30m)

STORY 10: TASKS DONE: SPG-10:Frontend - Testing (3h vs 1h)

STORY 13: TASKS DONE: SPG-13: Frontend - testing (3h vs 3h), SPG-13: API - testing (2h vs 1h30m), SPG-13: Backend - testing (3h s 1h30m)

STORY 14: TASKS DONE: SPG-14: Frontend - testing (3h30m vs 3h30m)

STORY 40: TASKS DONE: Telegram notification - testing (2h vs 15m), Learning how to build a telegram bot in Node (3h30m vs 3h30m), Implementing the Telegram notification (6h vs 7h30m)

STORY 41: TASKS DONE: SPG-41:Frontend (4h30m vs 6h30m), SPG-41:Frontend - testing (2h30m vs 6h), SPG-41:Backend (4h30m vs 3h30m), SPG-41:Backend - testing (2h30m vs 1h), SPG-41:API (3h30m vs 3h), SPG-41:API - testing (2h vs 1h15m),


--->
| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |   10    |     -  |  50h30m    |     56h      | 
|    10 |     1   |     5  |      3h    |     1h       | <!--DONE-->
|    13 |     3   |     3  |      8h    |     6h       | <!--DONE-->
|    14 |     1   |     2  |   3h30m    |     3h30m    | <!--DONE-->
|    40 |     3   |     *  |  11h30m    |     11h15m   | <!--DONE-->
|    41 |     6   |     *  |  19h30m    |     21h15m   | <!--DONE-->


> 'place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - average estimated: 96h / 24 =   **4**
  - average actual: 99h / 24 =   **4.125**
  - standard deviation: **1.848**
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  - 96h/99h = **0,9697**

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated		26h 30m (to recover previous sprint) + 11h (for this sprint) -> total of 37h 30m
  - Total hours spent			31h 45m
  - Nr of automated unit test cases 
    - Frontend Unit Testing: 97
    - Backend Unit Testing: 38
  - Coverage (if available)		22.6%
- E2E testing:
  - Total hours estimated		12h 30m
  - Total hours spent			11h 30m
- Code review 
  - Total hours estimated 		5h 15m
  - Total hours spent			5h 30m

- Technical Debt management:		
  - Total hours estimated 		3h
  - Total hours spent			4h
  - Hours estimated for remediation by SonarQube		
    - Reliability 0m 
    - Security 0m
    - Maintainability 1d 3h
    - Total of 1d 3h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
    - Critics: 2 issues for a total of 38m
    - Major: 38 issues for a total of 1d
    - Total of: 1h 38m
  - Hours spent on remediation 														4h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")									0.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability)	
    - Reliability: A
    - Security: A
    - Maintainability: A

NOTE: our policy is to remedy at all Critics and Major issues, and ignore minor.

## ASSESSMENT

- What caused your errors in estimation (if any)?

  On this final sprint, our estimations were not perfect but they continued improving. This is because our knowledge of the technologies and tools we are using has improved substantially throughout the semester. This was also reflected in the reduced time we needed to develop new tasks. There were some estimation errors in the subdivision of tasks (i.e. when we broke down a big story into smaller parts), but the total time allocated for the entire task was usually fairly accurate.

- What lessons did you learn (both positive and negative) in this sprint?

  Negative lessons:

  A big lesson we learnt the hard way throughout the entire project is the importance of reducing the amount technical debt. We spent a lot of time trying to properly test what we had done two weeks ago, which is very inefficient. Another problem was that we selected just a few people to do it, when it would probably have been better if every person tested their one work, since it is a lot easier and the person testing already understand perfectly the code.

  Positive lessons:

  Recently, especially in this sprint, we have been noticing our errors in previous sprints and have been working to fix them. This tells us that we have been learning about the optimization of the process of software development, which will be very useful when we have to undertake our next software projects in our lives.

- Which improvement goals set in the previous retrospective were you able to achieve?

  We managed to continue having more efficient meetings, dividing the work load adequately between us. We also managed to resolve the technical debt we had from previous sprints, also minimizing the amount we incurred in this sprint.

- Which ones you were not able to achieve? Why?

  We were not able to test every single story we developed in this sprint, so there is some technical debt that needs to be addressed now in the current sprint.

- One thing you are proud of as a Team:

  Throughout the entire semester, our programming knowledge and our teamwork abilities have improved a lot. We are also very proud of the final project we managed to deliver, because it works very well and the amount of technical debt at the end is minimal; it is a nearly finished product. We were also able to listen to the stakeholder's feedback and improve based on it, which is a very important attribute of a good programmer.
