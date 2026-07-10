# Step 1: Build the Maven application inside a JDK container environment
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Extract the compiled JAR and execute it inside a lightweight JRE shell container
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/medvault-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]