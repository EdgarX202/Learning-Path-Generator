-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2025 at 11:05 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `university_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(150) NOT NULL,
  `course_description` text NOT NULL,
  `department` varchar(100) NOT NULL,
  `credits` int(5) NOT NULL,
  `prerequisites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prerequisites`)),
  `modules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`modules`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_name`, `course_description`, `department`, `credits`, `prerequisites`, `modules`, `createdAt`) VALUES
(1, 'Software Engineering', 'This course introduces the principles of software engineering, covering the entire software development lifecycle. Topics include requirements analysis, software design patterns, testing methodologies, and project management.', 'Computer Science', 20, '[\"cs101\"]', '[\"se201_m1\", \"se201_m2\", \"se201_m3\", \"se201_m4\", \"se201_m5\", \"se201_m6\"]', '2025-07-21 18:14:57'),
(2, 'Artificial Intelligence', 'Explore the fundamentals of artificial intelligence, including problem-solving with search algorithms, knowledge representation, and an introduction to machine learning. Students will build intelligent agents to solve complex problems.', 'Computer Science', 20, '[\"cs101\"]', '[\"ai301_m1\", \"ai301_m2\", \"ai301_m3\", \"ai301_m4\", \"ai301_m5\", \"ai301_m6\"]', '2025-07-21 18:14:57'),
(3, 'Website Development', 'A practical course on building modern, responsive websites. Students will learn front-end technologies like HTML, CSS, and JavaScript, as well as server-side concepts to create dynamic web applications.', 'Computer Science', 20, '[\"cs101\"]', '[\"wd202_m1\", \"wd202_m2\", \"wd202_m3\", \"wd202_m4\", \"wd202_m5\", \"wd202_m6\"]', '2025-07-21 18:15:25');

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `module_name` varchar(200) NOT NULL,
  `learning_objectives` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`learning_objectives`)),
  `topics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`topics`)),
  `assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assessment`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`module_id`, `course_id`, `module_name`, `learning_objectives`, `topics`, `assessment`, `createdAt`) VALUES
(19, 1, 'Introduction to the Software Lifecycle', '[\"Understand the different phases of the software development lifecycle (SDLC).\",\"Compare and contrast waterfall, agile, and spiral models.\"]', '[\"SDLC Phases\", \"Agile Methodologies\", \"Waterfall Model\", \"Scrum\"]', '{\"type\": \"quiz\", \"title\": \"Lifecycle Models Quiz\"}', '2025-07-21 18:41:09'),
(20, 1, 'Requirements Engineering', '[\"Learn how to gather and document software requirements.\",\"Understand the difference between functional and non-functional requirements.\"]', '[\"User Stories\", \"Use Cases\", \"Requirement Elicitation\", \"Requirement Specification\"]', '{\"type\": \"assignment\", \"title\": \"Write a requirements document for a simple app.\"}', '2025-07-21 18:41:09'),
(21, 1, 'Software Design and Architecture', '[\"Understand key software architecture patterns.\",\"Learn the principles of good object-oriented design.\"]', '[\"MVC Pattern\", \"Client-Server Architecture\", \"SOLID Principles\", \"UML Diagrams\"]', '{\"type\": \"quiz\", \"title\": \"Design Patterns Quiz\"}', '2025-07-21 18:41:09'),
(22, 1, 'Implementation and Coding Standards', '[\"Understand the importance of coding standards.\",\"Learn about version control with Git.\"]', '[\"Code Readability\", \"Commenting Best Practices\", \"Git Basics\", \"Branching Strategies\"]', '{\"type\": \"assignment\", \"title\": \"Refactor a piece of code to meet standards.\"}', '2025-07-21 18:41:09'),
(23, 1, 'Software Testing and Quality Assurance', '[\"Learn different levels of testing.\",\"Understand how to write effective test cases.\"]', '[\"Unit Testing\", \"Integration Testing\", \"System Testing\", \"Test-Driven Development (TDD)\"]', '{\"type\": \"quiz\", \"title\": \"Testing Concepts Quiz\"}', '2025-07-21 18:41:09'),
(24, 1, 'Project Management and DevOps', '[\"Get an introduction to agile project management.\",\"Understand the core concepts of DevOps.\"]', '[\"Kanban Boards\", \"Continuous Integration (CI)\", \"Continuous Deployment (CD)\", \"Build Automation\"]', '{\"type\": \"assignment\", \"title\": \"Create a project plan for a small feature.\"}', '2025-07-21 18:41:09'),
(25, 3, 'HTML Fundamentals', '[\"Understand the structure of an HTML document.\",\"Learn to use common HTML tags for content.\"]', '[\"HTML5 Semantics\", \"Tags and Attributes\", \"Forms and Inputs\", \"Tables\"]', '{\"type\": \"assignment\", \"title\": \"Create a personal portfolio page structure.\"}', '2025-07-21 18:41:09'),
(26, 3, 'Advanced CSS and Layouts', '[\"Learn how to style web pages with CSS.\",\"Master modern layout techniques like Flexbox and Grid.\"]', '[\"Selectors and Specificity\", \"The Box Model\", \"Flexbox\", \"CSS Grid\", \"Responsive Design\"]', '{\"type\": \"assignment\", \"title\": \"Recreate a complex website layout.\"}', '2025-07-21 18:41:09'),
(27, 3, 'JavaScript Fundamentals', '[\"Understand core JavaScript concepts.\",\"Learn to work with variables, data types, and functions.\"]', '[\"Variables (var, let, const)\", \"Data Types\", \"Operators\", \"Functions\", \"Scope\"]', '{\"type\": \"quiz\", \"title\": \"JavaScript Basics Quiz\"}', '2025-07-21 18:41:09'),
(28, 3, 'DOM Manipulation and Events', '[\"Learn how to interact with the HTML document using JavaScript.\",\"Handle user events like clicks and keypresses.\"]', '[\"Selecting Elements\", \"Modifying Styles and Content\", \"Event Listeners\", \"Event Bubbling\"]', '{\"type\": \"assignment\", \"title\": \"Build a simple interactive to-do list.\"}', '2025-07-21 18:41:09'),
(29, 3, 'Introduction to Backend Development', '[\"Understand the role of a server in web applications.\",\"Learn about APIs and how to fetch data.\"]', '[\"Client-Server Model\", \"HTTP Requests\", \"REST APIs\", \"JSON Data Handling\", \"Fetch API\"]', '{\"type\": \"assignment\", \"title\": \"Fetch and display data from a public API.\"}', '2025-07-21 18:41:09'),
(30, 3, 'Final Project: Build a Web App', '[\"Combine front-end and back-end skills to build a full-stack application.\",\"Learn how to deploy a website to the internet.\"]', '[\"Project Planning\", \"Full-Stack Integration\", \"Deployment Platforms\", \"Final Presentation\"]', '{\"type\": \"project\", \"title\": \"Deploy a complete web application.\"}', '2025-07-21 18:41:09'),
(31, 2, 'Introduction to AI and Intelligent Agents', '[\"Define Artificial Intelligence and its history.\",\"Understand the concept of a rational agent.\"]', '[\"History of AI\", \"Types of AI\", \"Agent Architectures\", \"PEAS description\"]', '{\"type\": \"quiz\", \"title\": \"Intro to AI Concepts\"}', '2025-07-21 18:41:09'),
(32, 2, 'Problem Solving with Search', '[\"Formulate problems for search algorithms.\",\"Understand and implement uninformed and informed search strategies.\"]', '[\"Uninformed Search (BFS, DFS)\", \"Informed Search (Greedy, A*)\", \"Heuristics\", \"Local Search\"]', '{\"type\": \"assignment\", \"title\": \"Solve the 8-puzzle problem with A*.\"}', '2025-07-21 18:41:09'),
(33, 2, 'Knowledge Representation and Logic', '[\"Learn how to represent knowledge for reasoning.\",\"Understand propositional and first-order logic.\"]', '[\"Propositional Logic\", \"First-Order Logic\", \"Inference Rules\", \"Ontologies\"]', '{\"type\": \"quiz\", \"title\": \"Logic Puzzle Quiz\"}', '2025-07-21 18:41:09'),
(34, 2, 'Introduction to Machine Learning', '[\"Understand the basic types of machine learning.\",\"Implement a simple linear regression model.\"]', '[\"Supervised Learning\", \"Unsupervised Learning\", \"Reinforcement Learning\", \"Linear Regression\"]', '{\"type\": \"assignment\", \"title\": \"Predict housing prices with linear regression.\"}', '2025-07-21 18:41:09'),
(35, 2, 'Natural Language Processing (NLP)', '[\"Understand the challenges of processing human language.\",\"Learn about techniques for text analysis.\"]', '[\"Tokenization\", \"Sentiment Analysis\", \"N-grams\", \"Bag-of-Words Model\"]', '{\"type\": \"assignment\", \"title\": \"Build a simple sentiment classifier.\"}', '2025-07-21 18:41:09'),
(36, 2, 'AI Ethics and The Future', '[\"Discuss the ethical implications of AI.\",\"Explore current research directions and the future of AI.\"]', '[\"Bias in AI\", \"Accountability\", \"AI Safety\", \"Superintelligence\", \"Societal Impact\"]', '{\"type\": \"essay\", \"title\": \"Essay on the societal impact of a chosen AI technology.\"}', '2025-07-21 18:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `module_files`
--

CREATE TABLE `module_files` (
  `file_id` int(11) NOT NULL,
  `module_id` varchar(50) NOT NULL,
  `week_title` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module_files`
--

INSERT INTO `module_files` (`file_id`, `module_id`, `week_title`, `file_type`, `file_name`, `file_path`, `uploaded_at`) VALUES
(56, 'INTRO_SE', 'Week 1 - Understanding The Module', 'theory', 'w1.pdf', 'uploads\\w1.pdf', '2025-08-04 20:22:04'),
(57, 'INTRO_SE', 'Week 2 - Data & Operations', 'theory', 'w2.pdf', 'uploads\\w2.pdf', '2025-08-04 20:22:10'),
(78, 'INTRO_SE', 'Week 1 - Understanding The Module', 'practical', 'p1.pdf', 'uploads\\p1.pdf', '2025-08-06 19:52:43'),
(79, 'INTRO_SE', 'Week 2 - Data & Operations', 'practical', 'p2.pdf', 'uploads\\p2.pdf', '2025-08-06 19:52:54'),
(80, 'INTRO_SE', 'Week 3 - Control Flow', 'practical', 'p3.pdf', 'uploads\\p3.pdf', '2025-08-06 19:53:03'),
(81, 'INTRO_SE', 'Week 3 - Control Flow', 'theory', 'w3.pdf', 'uploads\\w3.pdf', '2025-08-06 19:53:13'),
(82, 'INTRO_SE', 'Week 4 - Collections', 'theory', 'w4.pdf', 'uploads\\w4.pdf', '2025-08-06 19:53:21'),
(83, 'INTRO_SE', 'Week 4 - Collections', 'practical', 'p4.pdf', 'uploads\\p4.pdf', '2025-08-06 19:53:29'),
(84, 'INTRO_SE', 'Week 5 - Functions & Modularity', 'practical', 'p5.pdf', 'uploads\\p5.pdf', '2025-08-06 19:53:41'),
(85, 'INTRO_SE', 'Week 5 - Functions & Modularity', 'theory', 'w5.pdf', 'uploads\\w5.pdf', '2025-08-06 19:53:50'),
(86, 'INTRO_SE', 'Week 6 - Introduction to OOP', 'theory', 'w7.pdf', 'uploads\\w7.pdf', '2025-08-06 19:54:01'),
(87, 'INTRO_SE', 'Week 6 - Introduction to OOP', 'practical', 'p7.pdf', 'uploads\\p7.pdf', '2025-08-06 19:54:09'),
(88, 'INTRO_SE', 'Week 8 - Error Handling & Debugging', 'practical', 'p8.pdf', 'uploads\\p8.pdf', '2025-08-06 19:54:20'),
(89, 'INTRO_SE', 'Week 9 - Introduction to Software Testing', 'practical', 'p9.pdf', 'uploads\\p9.pdf', '2025-08-06 19:54:26'),
(90, 'INTRO_SE', 'Week 8 - Error Handling & Debugging', 'theory', 'w8.pdf', 'uploads\\w8.pdf', '2025-08-06 19:54:36'),
(91, 'INTRO_SE', 'Week 9 - Introduction to Software Testing', 'theory', 'w9.pdf', 'uploads\\w9.pdf', '2025-08-06 19:54:43'),
(92, 'INTRO_SE', 'Week 10 - Version Control with Git & GitHub', 'theory', 'w10.pdf', 'uploads\\w10.pdf', '2025-08-06 19:54:53'),
(93, 'INTRO_SE', 'Week 10 - Version Control with Git & GitHub', 'practical', 'p10.pdf', 'uploads\\p10.pdf', '2025-08-06 19:55:02'),
(94, 'INTRO_SE', 'Week 11 - Revision', 'theory', 'w11.pdf', 'uploads\\w11.pdf', '2025-08-06 19:55:12'),
(95, 'INTRO_SE', 'Week 11 - Revision', 'practical', 'p11.pdf', 'uploads\\p11.pdf', '2025-08-06 19:55:21'),
(96, 'INTRO_SE', 'Final Project', 'project', 'final.pdf', 'uploads\\final.pdf', '2025-08-06 19:55:29');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `module_id` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `color` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`note_id`, `user_id`, `module_id`, `content`, `color`, `created_at`) VALUES
(37, 2, 'INTRO_SE', 'Hello Watcher One', 'yellow', '2025-08-04 20:26:20'),
(38, 2, 'INTRO_SE', 'Test Sticky Notes!', 'purple', '2025-08-04 20:26:28'),
(39, 6, 'INTRO_SE', 'Hello', 'blue', '2025-08-08 16:13:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` int(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `enrolled_courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`enrolled_courses`)),
  `completed_courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`completed_courses`)),
  `learning_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`learning_paths`)),
  `role` enum('student','staff') NOT NULL DEFAULT 'student',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `first_name`, `last_name`, `enrolled_courses`, `completed_courses`, `learning_paths`, `role`, `createdAt`) VALUES
(1, 10000001, 'staffpass1', 's.davis@university.edu', 'Susan', 'Davis', NULL, NULL, NULL, 'staff', '2025-07-21 19:13:17'),
(2, 10000002, 'staffpass2', 'm.evans@university.edu', 'Michael', 'Evans', NULL, NULL, NULL, 'staff', '2025-07-21 19:13:17'),
(3, 10000003, 'staffpass3', 'l.chen@university.edu', 'Li', 'Chen', NULL, NULL, NULL, 'staff', '2025-07-21 19:13:17'),
(4, 10000004, 'staffpass4', 'c.roberts@university.edu', 'Charlotte', 'Roberts', NULL, NULL, NULL, 'staff', '2025-07-21 19:13:17'),
(5, 10000005, 'staffpass5', 'j.carter@university.edu', 'James', 'Carter', NULL, NULL, NULL, 'staff', '2025-07-21 19:13:17'),
(6, 40310835, 'studentpass1', 'olivia.p@student.edu', 'Olivia', 'Patel', '[\"1\", \"2\"]', NULL, '{\"INTRO_SE\": {\"learningPath\": [{\"description\": \"Learn about the software development life cycle and its importance in planning and requirement gathering.\", \"module_number\": 1, \"title\": \"Week 1: Understanding the SDLC\", \"topics\": [{\"concept\": \"In the world of software development, a well-planned path is crucial. The Software Development Life Cycle (SDLC) outlines the various stages involved in designing, developing, and testing software.\", \"project\": \"Implement a basic console application that prints out each phase of the SDLC in C#\", \"resource_link\": null, \"title\": \"Introduction to the SDLC in C#\", \"topic_number\": 1}]}, {\"description\": \"Understand how to write reusable functions, use control structures for conditional and repetitive code execution.\", \"module_number\": 2, \"title\": \"Week 2: Functions and Control Flow in C#\", \"topics\": [{\"concept\": \"Reusable functions are an essential tool in programming. In C#, you can make functions to help keep your code organized.\", \"project\": \"Write a simple program that calculates the sum and average of a list of numbers using reusable functions\", \"resource_link\": null, \"title\": \"Functions in C#\", \"topic_number\": 1}, {\"concept\": \"To keep your code clean and well-organized, it\'s important to use control flow statements like if-else, while, do-while.\", \"project\": \"Develop a simple program that asks the user for their name and age and then prints out a greeting message based on their input\", \"resource_link\": null, \"title\": \"Control Flow in C#\", \"topic_number\": 2}]}, {\"description\": \"Learn about arrays, vectors, maps, sets, and linked lists and how to use them effectively.\", \"module_number\": 3, \"title\": \"Week 3: Data Structures in C#\", \"topics\": [{\"concept\": \"In programming, arrays are collections of similar elements. In C#, there are different types of arrays that do the same job but have slightly different interfaces.\", \"project\": \"Write a program to reverse an array of integers using vector logic\", \"resource_link\": null, \"title\": \"Arrays and Vectors in C#\", \"topic_number\": 1}, {\"concept\": \"In addition to arrays, programming languages often provide maps and sets as built-in data structures for storing key-value pairs.\", \"project\": \"Design a simple program using maps that stores information about cars and displays relevant details\", \"resource_link\": null, \"title\": \"Maps and Sets in C#\", \"topic_number\": 2}]}, {\"description\": \"Explore OOP concepts, classes, objects, inheritance, polymorphism, encapsulation.\", \"module_number\": 4, \"title\": \"Week 4: Object-Oriented Programming (OOP) in C#\", \"topics\": [{\"concept\": \"Programming principles involve using abstract or concrete entities known as \\\"objects\\\" which can hold data and code as well.\", \"project\": \"Implement a basic BankAccount class with getter, setter method for account name and balance, constructor with initial balance 1000.00, toString to display account information\", \"resource_link\": null, \"title\": \"Introduction to OOP in C#\", \"topic_number\": 1}]}, {\"description\": \"Understand how to work with standard library containers like vectors and lists, as well as iterators for efficient iteration.\", \"module_number\": 5, \"title\": \"Week 5: Collections and Iterators in C#\", \"topics\": [{\"concept\": \"C# comes with many helpful classes that you can use right away, called the standard library. This means you don\'t have to write your own code for basic tasks like storing data.\", \"project\": \"Write a program to process student information and display details based on department using vector containers\", \"resource_link\": null, \"title\": \"Standard Library Containers in C#\", \"topic_number\": 1}]}, {\"description\": \"Learn about debugging techniques, effective error handling methods.\", \"module_number\": 6, \"title\": \"Week 6: Debugging and Error Handling in C#\", \"topics\": [{\"concept\": \"While coding, you may need to debug your code or fix errors. There are different ways to do this, depending on your environment and the type of error.\", \"project\": \"Write a program that prints out error messages with specific debugging information for user errors\", \"resource_link\": null, \"title\": \"Debugging Techniques in C#\", \"topic_number\": 1}]}, {\"description\": \"Get hands-on experience with unit testing using `assert` statements and test-driven development (TDD)\", \"module_number\": 7, \"title\": \"Week 7: Unit Testing in C#\", \"topics\": [{\"concept\": \"To help you develop efficient and correct code, it\'s essential to write tests along your way.\", \"project\": \"Write a test-driven development (TDD) program for a simple calculator using the `assert` method\", \"resource_link\": null, \"title\": \"Unit Testing Basics in C#\", \"topic_number\": 1}]}, {\"description\": \"Understand how to work with version control systems like Git, collaborating with others.\", \"module_number\": 8, \"title\": \"Week 8: Version Control and Collaboration in C#\", \"topics\": [{\"concept\": \"To keep track of changes, programming teams use special systems called `VCSs` or `Version Control Systems`. One popular system is `Git`, where developers can keep track of, create new branches and merge between them.\", \"project\": \"Make a simple console application that prints out \'Successful update\' when updating Git repository without conflicts\", \"resource_link\": null, \"title\": \"Getting Started with Git in C#\", \"topic_number\": 1}]}, {\"description\": \"Implement a simple command-line application for managing student rosters using C++ language, with unit tests and proper documentation.\", \"module_number\": 9, \"title\": \"Week 9: Practice Project - Student Roster in C#\", \"topics\": [{\"concept\": \"The Student Roster Management System should be able to perform various operations such as adding or removing students, updating student information, displaying the roster of a specific department, etc.\", \"project\": null, \"resource_link\": null, \"title\": \"Student Roster Manager\", \"topic_number\": 1}]}, {\"description\": \"Choose an approved option and implement a complete command-line application using the C++ language, with unit tests, version control, proper documentation.\", \"module_number\": 10, \"title\": \"Week 10: Final Project - Command-Line Application in C#\", \"topics\": []}]}}', 'student', '2025-08-10 18:57:46'),
(7, 40310836, 'studentpass2', 'liam.w@student.edu', 'Liam', 'Walker', '[\"3\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(8, 40310837, 'studentpass3', 'emma.g@student.edu', 'Emma', 'Garcia', '[\"2\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(9, 40310838, 'studentpass4', 'noah.h@student.edu', 'Noah', 'Hall', '[\"1\"]', NULL, '{\"INTRO_SE\": {\"learningPath\": [{\"description\": \"Learn the basics of Java programming and familiarize yourself with its syntax.\", \"module_number\": 1, \"title\": \"Week 1: Introduction to Java Programming\", \"topics\": [{\"concept\": \"In Java, variables are used to store values. You\'ll learn how to declare and use variables in your code, including assigning values and getting the value of a variable.\", \"project\": \"Write a program that declares two integer variables and assigns them values 5 and 10, then prints their sum using System.out.println()\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/\", \"title\": \"Introduction to Variables in Java\", \"topic_number\": 1}]}, {\"description\": \"Master the use of functions, conditional statements, loops, and jump statements in Java.\", \"module_number\": 2, \"title\": \"Week 2: Java Functions and Control Flow\", \"topics\": [{\"concept\": \"In Java, you can define your own methods (functions) that take parameters and return values. Learn how to declare functions, pass parameters, and use return statements.\", \"project\": \"Write a program that defines a function that takes an integer as input, squares it, and returns the result, then test its functionality\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/essential/java/methods.html\", \"title\": \"Functions in Java with Parameters and Return Statements\", \"topic_number\": 1}, {\"concept\": \"In Java, you can control the flow of your program using conditional statements (if-else) and loops. Learn how to write if-else statements, for-loops, and while-loops.\", \"project\": \"Write a program that asks the user for their age and then prints out whether they are older or younger than 25, depending on their input\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flowcontr2.html\", \"title\": \"Control Flow in Java: If-Else Statements and Loops\", \"topic_number\": 2}]}, {\"description\": \"Learn about the basics of data structures and how to implement them in Java.\", \"module_number\": 3, \"title\": \"Week 3: Data Structures in Java\", \"topics\": [{\"concept\": \"In Java, arrays are a fundamental data structure for storing collections of elements. Learn how to declare arrays, access their elements, and modify them\", \"project\": \"Write a program that declares an array of integers and then prints the sum of all its elements\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/essential/io/array.html\", \"title\": \"Arrays in Java\", \"topic_number\": 1}, {\"concept\": \"Learn how to declare vectors in Java, access their elements, and modify them. Vectors are similar to arrays but can grow dynamically.\", \"project\": \"Write a program that declares a vector of integers and then prints the sum of all its elements\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/essential/io/array.html\", \"title\": \"Vectors in Java\", \"topic_number\": 2}]}, {\"description\": \"Learn about the concept and principles of OOP in Java, including classes, objects, constructors, destructors, attributes, and methods.\", \"module_number\": 4, \"title\": \"Week 4: Introduction to Java Object-Oriented Programming (OOP)\", \"topics\": [{\"concept\": \"In Java, you can create your own custom classes that encapsulate data and behavior. Learn about the difference between classes (blueprints) and objects (instances).\", \"project\": \"Write a program that defines a simple class for a person with attributes name, age, and hair color, then creates an instance of this class and prints its characteristics\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/java/concepts/class.html\", \"title\": \"Introduction to Classes vs. Objects in Java\", \"topic_number\": 1}]}, {\"description\": \"Learn how to handle errors and debug your Java programs effectively.\", \"module_number\": 5, \"title\": \"Week 5: Error Handling and Debugging in Java\", \"topics\": [{\"concept\": \"In Java, you can use try-catch blocks to catch and handle exceptions. Learn about the syntax and usage of these blocks.\", \"project\": \"Write a program that uses try-catch blocks to handle arithmetic exceptions when performing division operations\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/essential/io/index.html\", \"title\": \"Error Handling with Try-Catch Blocks in Java\", \"topic_number\": 1}]}, {\"description\": \"Learn the basics of unit testing and how to use JUnit for testing your Java code.\", \"module_number\": 6, \"title\": \"Week 6: Unit Testing in Java with JUnit\", \"topics\": [{\"concept\": \"In Java, you can use the JUnit framework to write and run unit tests. Learn about its features and how to get started with writing unit tests.\", \"project\": \"Write a program that defines a simple class for a rectangle and then writes unit tests for its area calculation and perimeter methods\", \"resource_link\": \"https://junit.org/junit5/\", \"title\": \"Introduction to JUnit Unit Testing Framework in Java\", \"topic_number\": 1}]}, {\"description\": \"Learn the basics of version control systems, focusing on Git and GitHub.\", \"module_number\": 7, \"title\": \"Week 7: Introduction to Version Control with Git and GitHub\", \"topics\": [{\"concept\": \"In this course, you will learn the basics of version control systems, specifically Git and GitHub. You will create a repository, commit changes, push/pull code, and collaborate with others.\", \"project\": \"Create a simple GitHub repository for your class assignments, then practice pushing changes and collaborating with peers\", \"resource_link\": \"https://github.com/\", \"title\": \"Getting Started with Git and GitHub in Java\", \"topic_number\": 1}]}, {\"description\": \"Develop a comprehensive project that puts the learning path into practice.\", \"module_number\": 8, \"title\": \"Week 8-10: Final Project Development in Java\", \"topics\": [{\"concept\": \"In this course, you will learn how to develop your own comprehensive projects using Java programming. You will design, implement, test, and submit a final project.\", \"project\": \"Write a program that implements your own simple banking system or stock market tracking software\", \"resource_link\": \"\", \"title\": \"Final Project Design and Implementation in Java\", \"topic_number\": 1}]}, {\"description\": \"Review key concepts and consider future learning directions in software development.\", \"module_number\": 11, \"title\": \"Week 11: Review and Future Learning Directions in Java\", \"topics\": [{\"concept\": \"In this course, you will review and summarize all the lessons covered so far. You will reinforce your understanding of Java programming concepts and prepare for future learning directions.\", \"project\": \"Write a reflective report on your journey with Java learning, highlighting major takeaways and potential future learning interests\", \"resource_link\": \"\", \"title\": \"Reviewing Key Concepts in Java Programming\", \"topic_number\": 1}]}]}}', 'student', '2025-08-19 09:00:34'),
(10, 40310839, 'studentpass5', 'ava.m@student.edu', 'Ava', 'Martinez', '[\"2\", \"3\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(11, 40310840, 'studentpass6', 'william.j@student.edu', 'William', 'Jones', '[\"3\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(12, 40310841, 'studentpass7', 'sophia.b@student.edu', 'Sophia', 'Brown', '[\"2\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(13, 40310842, 'studentpass8', 'james.t@student.edu', 'James', 'Taylor', '[\"1\"]', NULL, '{\"INTRO_SE\": {\"learningPath\": [{\"description\": \"In this module, you\'ll explore the basics of programming in Java. Learn how to write functions, variables, and data types.\", \"module_number\": 1, \"title\": \"Week 1: Java Fundamentals\", \"topics\": [{\"concept\": \"In Java, a variable is declared using keywords like int, double, or boolean. Understand the difference between primitives (int, double, etc.) and reference types.\", \"project\": \"Write a Java program to print \'Hello World!\' using the System.out.println() method with string concatenation.\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/java/basics/\", \"title\": \"Java Variables and Data Types\", \"topic_number\": 1}, {\"concept\": \"In Java, control flow statements (if-else, for, while) help execute code based on conditions. Learn to use them effectively.\", \"project\": \"Write a Java program using if-else statements to print numbers between 1 and 10.\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/java/nuts-and-bolts/flow.html\", \"title\": \"Java Control Flow\", \"topic_number\": 2}, {\"concept\": \"Java has built-in error handling features like try-catch blocks. Master the art of catching and handling exceptions.\", \"project\": \"Write a Java program that uses try-catch blocks to handle arithmetic operations (e.g., division by zero).\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/essential/java/try_catch.html\", \"title\": \"Java Error Handling\", \"topic_number\": 3}]}, {\"description\": \"In this module, you\'ll dive deeper into programming concepts in Java. Focus on variables, operators, and control structures.\", \"module_number\": 2, \"title\": \"Week 2: Programming Fundamentals\", \"topics\": [{\"concept\": \"In Java, use if-else statements for conditional execution of code based on conditions.\", \"project\": \"Write a Java program using if-else statements to print numbers between 1 and 10 based on a condition (e.g., even or odd).\", \"resource_link\": \"https://docs.oracle.com/javase/tutorial/java/nuts-and-bolts/flow.html\", \"title\": \"Java Conditional Statements\", \"topic_number\": 1}, {\"title\": \"Java Loops and Conditionals\", \"topic_number\": 2}, {\"title\": \"Java Basic Algorithmic Concepts\", \"topic_number\": 3}]}, {\"description\": \"In the final module, you\'ll design, implement, test, and document a complete command-line application from scratch using your new Java skills.\", \"module_number\": 13, \"title\": \"Week 11-12: Java Final Project\", \"topics\": []}]}}', 'student', '2025-08-08 16:04:53'),
(14, 40310843, 'studentpass9', 'isabella.w@student.edu', 'Isabella', 'White', '[\"1\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(15, 40310844, 'studentpass10', 'logan.k@student.edu', 'Logan', 'King', '[\"3\", \"2\", \"1\"]', NULL, '{\"INTRO_SE\": {\"learningPath\": [{\"description\": \"This module covers the basics of software development and sets the stage for our journey through modern JavaScript programming. In this week, you\'ll learn about variables, data types, functions, classes, and control flow in the context of JavaScript.\", \"module_number\": 1, \"title\": \"Week 1: Introduction to JavaScript Programming\", \"topics\": [{\"concept\": \"In JavaScript, a variable represents a value that can be updated during program execution. You\'ll learn about different data types like numbers, strings, booleans, arrays, objects, and how to use operators for basic arithmetic.\", \"project\": \"Create a JavaScript console application that asks the user for name and age, then prints out greetings with the requested information.\", \"resource_link\": \"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Globals\", \"title\": \"Variables, Data Types, and Operators\", \"topic_number\": 1}]}, {\"description\": \"Functions are essential building blocks of any programming language. In this week, you\'ll learn how to define and use functions in the context of JavaScript, including function overloading, default arguments, and returning values from functions.\", \"module_number\": 2, \"title\": \"Week 2: Functions in JavaScript\", \"topics\": [{\"concept\": \"Functions are blocks of reusable code that allow you to group a set of statements together. You\'ll learn how to define functions using the function keyword, as well as call them with input arguments.\", \"project\": \"Create a JavaScript function that calculates the sum of two numbers and prints out the result.\", \"resource_link\": \"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions\", \"title\": \"Defining and Using Functions\", \"topic_number\": 1}]}, {\"description\": \"This week, you\'ll learn the basics of object-oriented programming (OOP) with JavaScript classes. You\'ll discover how to create constructors, define methods, and work with inheritance and polymorphism.\", \"module_number\": 3, \"title\": \"Week 3: Classes and Objects in JavaScript\", \"topics\": [{\"concept\": \"In JavaScript, you can use the class keyword to define a blueprint for creating objects. You\'ll learn about constructors, methods, properties, and how to create instances of classes.\", \"project\": \"Create a simple bank account system where you have one class for bank account and another for transactions.\", \"resource_link\": \"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Object#Classes_and_Inheritance\", \"title\": \"Introducing Classes and Objects\", \"topic_number\": 1}]}, {\"description\": \"This week, you\'ll explore various data structures commonly used in modern programming. You\'ll learn about arrays, vectors, lists, and more, with a focus on efficient storage and processing.\", \"module_number\": 4, \"title\": \"Week 4: Data Structures in JavaScript\", \"topics\": [{\"concept\": \"In JavaScript, you can use the array data structure to store a collection of items. You\'ll learn about the different ways you can define arrays and work with their properties and methods.\", \"project\": \"Write a function that checks if two given arrays have any matching elements between them.\", \"resource_link\": \"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array\", \"title\": \"Arrays and Vectors\", \"topic_number\": 1}]}, {\"description\": \"Error handling is an essential part of programming. In this week, you\'ll learn how to plan for errors using try-catch blocks, rethrow exceptions, write robust code, and debug your applications using print statements and a debugger.\", \"module_number\": 5, \"title\": \"Week 5: Error Handling and Debugging\", \"topics\": [{\"concept\": \"In JavaScript, you can use the try-catch block to manage runtime errors. You\'ll learn about different types of exceptions and how to handle them effectively.\", \"project\": \"Write a function that calculates the tip for a given bill and tries to calculate an average cost by dividing it through each item\'s quantity.\", \"resource_link\": \"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_errors\", \"title\": \"Error Handling\", \"topic_number\": 1}]}, {\"description\": \"Unit testing is an essential part of the software development life cycle. In this week, you\'ll learn how to write unit tests using popular libraries like Jest or Mocha, and discover the benefits of early detection and improved code quality.\", \"module_number\": 6, \"title\": \"Week 6: Unit Testing in JavaScript\", \"topics\": [{\"concept\": \"Unit testing allows you to verify that small units of your code work as expected. You\'ll learn how to write test cases, assertions, mock dependencies, and more using popular libraries.\", \"project\": \"Write a simple unit test for a function that checks if two numbers are even or odd.\", \"resource_link\": \"https://jestjs.io/\", \"title\": \"Introduction to Unit Testing\", \"topic_number\": 1}]}, {\"description\": \"This week, you\'ll learn the basics of version control using Git. You\'ll discover how to create a new repository on GitHub, work with branches, commits, and history, and effectively manage your codebase.\", \"module_number\": 7, \"title\": \"Week 7: Version Control with Git\", \"topics\": [{\"concept\": \"In this topic, you\'ll learn the basics of Git version control. You\'ll discover how to initialize a repository, add files, commit changes, and push updates to the remote repository.\", \"project\": \"Create a new repository on GitHub and create a simple README file to start tracking your code development.\", \"resource_link\": \"https://github.com/git-guides\", \"title\": \"Introduction to Git\", \"topic_number\": 1}]}, {\"description\": \"In the final weeks, you\'ll apply all the concepts learned throughout the module to build a complete command-line application. You can choose from one of three project ideas, or your own idea.\", \"module_number\": 8, \"title\": \"Week 8-10: Programming Project\", \"topics\": []}, {\"description\": \"The final week is dedicated to reviewing all the concepts learned throughout the module. You\'ll also plan for further learning in software development, identify key areas for improvement, and set goals for your next steps.\", \"module_number\": 11, \"title\": \"Week 11: Revision and Next Steps\", \"topics\": []}]}}', 'student', '2025-08-10 20:28:50'),
(16, 40310845, 'studentpass11', 'mia.l@student.edu', 'Mia', 'Lee', '[\"3\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(17, 40310846, 'studentpass12', 'benjamin.c@student.edu', 'Benjamin', 'Clark', '[\"2\", \"1\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(18, 40310847, 'studentpass13', 'charlotte.r@student.edu', 'Charlotte', 'Rodriguez', '[\"3\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(19, 40310848, 'studentpass14', 'lucas.a@student.edu', 'Lucas', 'Allen', '[\"1\"]', NULL, NULL, 'student', '2025-07-21 19:13:17'),
(20, 40310849, 'studentpass15', 'amelia.y@student.edu', 'Amelia', 'Young', '[\"2\"]', NULL, NULL, 'student', '2025-07-21 19:13:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`module_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `module_files`
--
ALTER TABLE `module_files`
  ADD PRIMARY KEY (`file_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `module_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `module_files`
--
ALTER TABLE `module_files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `modules`
--
ALTER TABLE `modules`
  ADD CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
