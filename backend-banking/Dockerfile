# ---------- BUILD STAGE ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /build

# Copy pom.xml first (for dependency caching)
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application JAR
RUN mvn clean package -DskipTests

# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from build stage
# Replace <your-jar-name> with the actual JAR built by Maven
COPY --from=build /build/target/backend-banking-0.0.1-SNAPSHOT.jar app.jar

# Expose port (should match your Spring Boot server.port)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
