package com.school.classroom.service;

import com.school.classroom.entity.*;
import com.school.classroom.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final TermRepository termRepository;
    private final ClassroomRepository classroomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data creation.");
            return;
        }

        log.info("Seeding initial application data...");

        // 1. Seed Admin
        User adminUser = User.builder()
            .username("admin")
            .password(passwordEncoder.encode("admin123"))
            .email("admin@school.com")
            .fullName("System Administrator")
            .role(Role.ADMIN)
            .build();
        userRepository.save(adminUser);

        // 2. Seed 3 Teachers
        List<Teacher> teachers = new ArrayList<>();
        String[][] teacherData = {
            {"t_smith", "password123", "john.smith@school.com", "John Smith", "EMP101", "Mathematics", "+1-555-0101"},
            {"t_davis", "password123", "sarah.davis@school.com", "Sarah Davis", "EMP102", "Science", "+1-555-0102"},
            {"t_wilson", "password123", "robert.wilson@school.com", "Robert Wilson", "EMP103", "History & English", "+1-555-0103"}
        };

        for (String[] td : teacherData) {
            User u = User.builder()
                .username(td[0])
                .password(passwordEncoder.encode(td[1]))
                .email(td[2])
                .fullName(td[3])
                .role(Role.TEACHER)
                .build();
            User savedUser = userRepository.save(u);

            Teacher teacher = Teacher.builder()
                .user(savedUser)
                .employeeId(td[4])
                .department(td[5])
                .phone(td[6])
                .build();
            teachers.add(teacherRepository.save(teacher));
        }

        // 3. Seed 30 Students
        List<Student> students = new ArrayList<>();
        String[] firstNames = {"Alex", "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", 
                               "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia", "Lucas", "Harper", "Henry", "Evelyn", 
                               "Alexander", "Abigail", "Michael", "Emily", "Daniel", "Elizabeth", "Jacob", "Mila", "Logan", "Ella"};
        String[] lastNames = {"Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
                              "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall",
                              "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams"};

        for (int i = 0; i < 30; i++) {
            String roll = "STU" + String.format("%03d", i + 1);
            Student s = Student.builder()
                .rollNumber(roll)
                .firstName(firstNames[i])
                .lastName(lastNames[i])
                .dateOfBirth(LocalDate.of(2010 + (i % 3), (i % 12) + 1, (i % 28) + 1))
                .gender(i % 2 == 0 ? "Male" : "Female")
                .grade("Grade " + (9 + (i % 4)))
                .contactEmail(firstNames[i].toLowerCase() + "." + lastNames[i].toLowerCase() + "@student.school.com")
                .contactPhone("+1-555-02" + String.format("%02d", i + 1))
                .guardianName("Parent of " + firstNames[i])
                .guardianPhone("+1-555-09" + String.format("%02d", i + 1))
                .address((i + 101) + " Academic Way, Springfield")
                .enrollmentDate(LocalDate.of(2025, 8, 15))
                .notes("Enrolled student " + (i + 1))
                .build();
            students.add(studentRepository.save(s));
        }

        // 4. Seed 3 Terms (Past, Current, Future relative to 2026)
        LocalDate today = LocalDate.now();
        Term pastTerm = Term.builder()
            .name("Fall 2025")
            .startDate(today.minusMonths(10))
            .endDate(today.minusMonths(4))
            .build();
        termRepository.save(pastTerm);

        Term currentTerm = Term.builder()
            .name("Spring 2026")
            .startDate(today.minusMonths(2))
            .endDate(today.plusMonths(3))
            .build();
        termRepository.save(currentTerm);

        Term futureTerm = Term.builder()
            .name("Fall 2026")
            .startDate(today.plusMonths(4))
            .endDate(today.plusMonths(10))
            .build();
        termRepository.save(futureTerm);

        // 5. Seed 6 Classrooms across terms
        // Classroom 1: Current - Math 101 (Teacher Smith, Students 0-9)
        Classroom c1 = Classroom.builder()
            .name("Algebra II")
            .gradeSection("Grade 10-A")
            .subject("Mathematics")
            .roomNumber("Room 101")
            .term(currentTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(0))))
            .students(new HashSet<>(students.subList(0, 10)))
            .build();
        classroomRepository.save(c1);

        // Classroom 2: Current - Biology 201 (Teacher Davis, Students 5-19)
        Classroom c2 = Classroom.builder()
            .name("AP Biology")
            .gradeSection("Grade 11-B")
            .subject("Science")
            .roomNumber("Lab 204")
            .term(currentTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(1))))
            .students(new HashSet<>(students.subList(5, 20)))
            .build();
        classroomRepository.save(c2);

        // Classroom 3: Current - World History (Teacher Wilson, Students 15-29)
        Classroom c3 = Classroom.builder()
            .name("World History")
            .gradeSection("Grade 9-C")
            .subject("History")
            .roomNumber("Room 302")
            .term(currentTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(2))))
            .students(new HashSet<>(students.subList(15, 30)))
            .build();
        classroomRepository.save(c3);

        // Classroom 4: Past - Geometry 901 (Teacher Smith, Students 0-14)
        Classroom c4 = Classroom.builder()
            .name("Introductory Geometry")
            .gradeSection("Grade 9-A")
            .subject("Mathematics")
            .roomNumber("Room 101")
            .term(pastTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(0))))
            .students(new HashSet<>(students.subList(0, 15)))
            .build();
        classroomRepository.save(c4);

        // Classroom 5: Past - Physical Science (Teacher Davis, Students 10-24)
        Classroom c5 = Classroom.builder()
            .name("Physical Science")
            .gradeSection("Grade 10-B")
            .subject("Science")
            .roomNumber("Lab 202")
            .term(pastTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(1))))
            .students(new HashSet<>(students.subList(10, 25)))
            .build();
        classroomRepository.save(c5);

        // Classroom 6: Future - Advanced Calculus (Teacher Smith & Davis, Students 0-9)
        Classroom c6 = Classroom.builder()
            .name("Advanced Calculus & STEM")
            .gradeSection("Grade 12-A")
            .subject("Mathematics")
            .roomNumber("Room 105")
            .term(futureTerm)
            .teachers(new HashSet<>(Set.of(teachers.get(0), teachers.get(1))))
            .students(new HashSet<>(students.subList(0, 10)))
            .build();
        classroomRepository.save(c6);

        log.info("Database seeding completed successfully!");
    }
}
