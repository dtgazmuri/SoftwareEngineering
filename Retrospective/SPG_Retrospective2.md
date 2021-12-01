RETROSPECTIVE: Team P13
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: ? vs ? 
- Total points committed vs done: ? vs ? 
- Nr of hours planned vs spent (as a team): ? vs ?

**Remember**  a story is done ONLY if it fits the Definition of Done:



- Code review completed

- Code present on VCS

- Unit testing done

- E2E testing done

> In this sprint number 2, we have revised our DoD with respect to sprint number 1, in order to consider also unit testing and E2E testing as part od DoD.


### Detailed statistics
[//]: # (Here I put calcules in comments                                                                                            Story 0: TASKS DONE = sprint planning(9h vs 9h), implement clock (2h vs 2h 15m), TD Estimation and Management (6h vs 5h15m), Resolve Github Issues (2h vs 2h), Responsive Interface (3h vs 3h), Put togheter documentation (1h vs 2h), Scrum meeting (6h vs 6h), Restospective (6h vs 6h)                                                                                                               Story 0: TASKS NOT DONE =SonarQube(3h vs 3h), Docker (6h vs 9h 30m), Backend testing (6h vs 16h30m), Frontend testing (10h vs 12h30m), Rearrange application behaviour according to system clock (8h vs 5h)

)

[//]: # ( )

[//]: # ()


| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |   13    | -      |      68h   |     82h      |
| 10    |     3   |     5  |      8h    |      12h     |
|    11 |     3   |     3  |      8h    |       6h     |
|    12 |     3   |     5  |       8h   |      6h      |


> 'place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - average estimated: 101h / 35 =   **2.88**
  - average actual: 96h / 35 =   **2.74**
  - standard deviation: **1.304**
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  - 101h/96h = **1.052**

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated		0h
  - Total hours spent			0h
  - Nr of automated unit test cases 	0
  - Coverage (if available)		0%
- E2E testing:
  - Total hours estimated		0h
  - Total hours spent			0h
- Code review 
  - Total hours estimated 		3h
  - Total hours spent			3h

- Technical Debt management:		
  - Total hours estimated 		0h
  - Total hours spent			0h
  - Hours estimated for remediation by SonarQube		
    - Reliability 10m 
    - Security 0m
    - Maintainability 1d 1h
    - Total of 1d 1h 10m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
    - Critics: 4 issues for a total of 45m
    - Major: 52 issues for a total of 7h 30m
    - Total of: 1d 15m
  - Hours spent on remediation 														0h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")									0.6%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability)	
    - Reliability: D
    - Security: A
    - Maintainability: A

NOTE: out policy is to remedy at all Critics and Major issues, and ignore minor.

## ASSESSMENT

- What caused your errors in estimation (if any)?


- What lessons did you learn (both positive and negative) in this sprint?

  Negative lessons:

  Positive lessons:

- Which improvement goals set in the previous retrospective were you able to achieve? 

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  

- One thing you are proud of as a Team:
