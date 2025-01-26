// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.

  if (ag.course_id !== course.id) {
    //* we validate course_id in assignmentGroup to match id of course
    throw new Error("Assignment group does not belong to the correct course.");
  }

  const result = [];
  const learnerData = {}; //* organize submissions by learner_id

  submissions.forEach((submission) => {
    const {
      learner_id,
      assignment_id,
      submission: { submitted_at, score },
    } = submission;
    const assignment = ag.assignments.find((a) => a.id === assignment_id);

    if (!assignment) {
      throw new Error(`Assignment with ID ${assignment_id} not found.`);
    }

    const { due_at, points_possible } = assignment;

    if (new Date(due_at) > new Date()) return; //* skip what's not due

    if (points_possible === 0) {
      //* handle case if points_possible is 0 to avoid division by zero!
      throw new Error(
        `Points possible for assingment ${assignment_id} cannot be 0.`
      );
    }

    let modifyScore = score;
    if (new Date(submitted_at) > new Date(due_at)) {
      modifyScore -= points_possible * 0.1; //* deduction of points
    }

    const percentage = modifyScore / points_possible; //* percentage score for assignment!

    if (!learnerData[learner_id]) {
      learnerData[learner_id] = {
        id: learner_id,
        avg: 0,
        assignments: {},
        totalPoints: 0,
        totalMaxPoints: 0,
      };
    }

    learnerData[learner_id].assignments[assignment_id] = percentage;

    //* collect points for weighted average calculation!
    learnerData[learner_id].totalPoints += modifyScore * ag.group_weight;
    learnerData[learner_id].totalMaxPoints += points_possible * ag.group_weight;
  });

  for (const learnerID in learnerData) {
    //* weighted average assessed for each learner!
    const learner = learnerData[learnerID];
    if (learner.totalMaxPoints > 0) {
      learner.avg = learner.totalPoints / learner.totalMaxPoints;
    } else {
      learner.avg = 0;
    }

    const learnerResult = {
      //* final results!
      id: learner.id,
      avg: learner.avg,
    };

    for (const assignmentID in learner.assignments) {
      //* assignment percentage score gets added to result!
      learnerResult[assignmentID] = learner.assignments[assignmentID];
    }

    result.push(learnerResult);
  }

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

//   return result;
