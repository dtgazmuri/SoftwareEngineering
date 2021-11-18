RETROSPECTIVE: Team P13
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 9 vs 9 
- Total points committed vs done: 37 vs 37 
- Nr of hours planned vs spent (as a team): 96  vs 

**Remember**  a story is done ONLY if it fits the Definition of Done:



- Code review completed

- Code present on VCS

> In this sprint number 1, we have considered unit testing and end to end testing as a separate tasks inside the uncategorized cards, so we revised our DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |   7     | -      |      29h   |     26h 15m  |
| 1     |     3   |     5  |      8h    |      12h     |
|    2  |     3   |     3  |      8h    |       6h     |
|    3  |     3   |     5  |       8h   |      6h      |
|    4  |     3   |     3  |       8h   |     8h       |
|    5  |     3   |     2  |       8h   |     8h 30m   |
|    6  |     3   |     3  |       6h   |     5h 45m   |
|    7  |     6   |     8  |  13h 30m   |       14h    |
|    8  |     1   |     3  |    4h 30m  |      3h      |
|    9  |     3   |     5  |     8h     |      6h 30m  |


> 'place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
  - average estimated: 101h / 35 =   **2.88**
  - average actual: 96h / 35 =   **2.74**
  - standard deviation: **1.304**
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
  - 101h/96h = **1.052**

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

  We had estimation errors due to two main reasons. The first is that we decided to change the technology we were going to work with. In the first project we worked with Java, while we switched to JavaScript and React for this one. This meant that not all of us had used this technology recently, leading to some team members needing to re-learn or study the language before programming. Furthermore, we also had different programming speeds. The second reason was that we are still pretty inexperienced estimating, so we had a hard time estimating the time of larger stories. However, it is worth noting that not all stories were wrongly estimated; we did estimate some of them correctly.

- What lessons did you learn (both positive and negative) in this sprint?

  Negative lessons:

  In this sprint we decided to divide ourselves into 3 couples, with each couple taking care of 3 stories. We expected to assign to one member of each couple the backend side and the other member the frontend side of the application. After trying out this system, we decided it might not be well suited for our team and our specific capabilities. Due to this, we have decided to try and have each person take on one story individually for the next sprint, both the frontend and backend.

  Positive lessons:

  Even though we changed the technologies we used for the new application, we adapted very well to the new programming language we chose and the constraints of the new project. Moreover, we agreed since the beginning on the main ideas for developing the applications, due to the fact that during this months we have come to know each other better and we established a sort of trust to the other team members and their ideas. 

- Which improvement goals set in the previous retrospective were you able to achieve? 

  Our previous goals were to be more efficient on dividing the time into development, review and testing. We managed to divide the time better for the development phase.

- Which ones you were not able to achieve? Why?

  We actually have not managed the properly divide the time for the review and testing phases, leaving it as a technical debt on the second sprint, mostly due to the fact that we focused too much on developing a more complete application for the demo presentation.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  1) We need to be more efficient in our team meetings, minimizing the time we need to coordinate ourselves and organize our work.
  2) We need to include the testing phase of the future tasks we will develop in the next sprint and not to leave it as a technical debt, even if it means developing less stories.
  

- One thing you are proud of as a Team:

  We are very proud of achieving the goals we set ourselves during the first meetings and we are pretty satisfied of the partial application we developed. We have listened to the feedback and we are already working to improve our work. 