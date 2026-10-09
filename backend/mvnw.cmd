@echo off
setlocal

set "DIR=%~dp0"
set "WRAPPER_JAR=%DIR%\.mvn\wrapper\maven-wrapper.jar"

java "-Dmaven.multiModuleProjectDirectory=%DIR%\" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
