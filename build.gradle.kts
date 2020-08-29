plugins {
    java

    application
}

repositories {
    mavenCentral()
    jcenter()
}

var currentOS = org.gradle.internal.os.OperatingSystem.current()
var platform = "win"
if (currentOS.isWindows()) {
    platform = "win"
} else if (currentOS.isLinux()) {
    platform = "linux"
} else if (currentOS.isMacOsX()) {
    platform = "mac"
}

dependencies {
    implementation("com.google.guava:guava:29.0-jre")
    
    implementation("org.openjfx:javafx-base:14:${platform}")
    implementation("org.openjfx:javafx-graphics:14:${platform}")
    implementation("org.openjfx:javafx-controls:14:${platform}")
    implementation("org.openjfx:javafx-fxml:14:${platform}")
    implementation("org.openjfx:javafx-web:14:${platform}")

}

application {
    mainClassName = "com.zigma.App"
    applicationDefaultJvmArgs = listOf(
        "--module-path=C:\\MyFiles\\javafx-sdk-11.0.2\\lib",
        "--add-modules=javafx.controls,javafx.fxml,javafx.web"
    )
}
