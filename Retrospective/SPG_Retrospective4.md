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


> In this sprint number 3, we have revised our DoD with respect to sprint number 2, in order to consider also E2E testing as part of DoD.


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

  Our estimations have been improving as we continue working with React and the testing tools, becasue we understand better the complexity of the tasks we undertake. Nevertheless, we had estimation errors on the development of stories 14 and 15. This is becasuse this stories introduced something new that was not present at all in our application before this sprint (involving the farmers and the manager), making it hard to estimate properly the amount of time they would require.

- What lessons did you learn (both positive and negative) in this sprint?

  Negative lessons:

  We were not able to show all the work we did this sprint because some stories had not been completely tested and therefore were not done (because of what the definition states). Due to this, we need to spend more time trying to test everything and thus avoid incurring in more technical debt.

  Positive lessons:

  We had a good sprint planning session, being able to organize the sprint efficiently (without using a lot of time). Due to this, we now know we are able to do it and need to continue working to always have meetings like this.

- Which improvement goals set in the previous retrospective were you able to achieve?

    Our first meeting this sprint, where we organized the entire sprint and divided the work load, was a lot more efficient. It took less time and the organization was clear for everybody.

- Which ones you were not able to achieve? Why?

    We were not able to test every single story we developed in this sprint, so there is some technical debt that needs to be addressed now in the current sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.) 

  We would like to continue having efficient meetings, hopefully avoiding going back to having long ones. We would also like to eradicate or at least continue reducing the amount of technical debt.

- One thing you are proud of as a Team:

  Our programming knowledge continues to improve and we have been able to reduce (not completely eliminate yet) the technical debt incurred in previous sprints. We were also more efficient organizing ourselves.
